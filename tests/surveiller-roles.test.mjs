import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {extraireDocuments,differencier,sourcesSurveillees,creerRapportMarkdown,executer} from '../scripts/surveiller-roles.mjs';

const BASE='https://www.cours-appel.justice.fr/bordeaux/roles-des-cours-dassises';
const PDF1='https://www.cours-appel.justice.fr/sites/default/files/2026-11/Role%20assises%20novembre.pdf';
const PDF2='https://www.cours-appel.justice.fr/sites/default/files/2026-12/Role%20assises%20decembre.pdf';
const html=(docs=[])=>'<html><body><h1>Rôles des assises</h1>'+docs.map(d=>
  '<a href="'+d.url+'">'+d.titre+'</a>').join('\n')+'</body></html>';

test('les sources sont regroupées par URL officielle, jamais par répétition départementale',()=>{
 const sources=sourcesSurveillees();
 assert.ok(sources.length>=8);
 assert.equal(new Set(sources.map(s=>s.url)).size,sources.length);
 assert.ok(sources.every(s=>s.url.startsWith('https://www.cours-appel.justice.fr/')));
 assert.ok(sources.every(s=>s.mode==='publication'||s.mode==='ressort'));
 assert.equal(sources.some(s=>s.url.includes('/rouen/')),false);
 assert.equal(sources.some(s=>s.url.includes('/caen/')),false);
 const besancon=sources.find(s=>s.url.includes('/besancon/'));
 assert.deepEqual(besancon.codes,['25','39','70','90']);
});

test('les liens PDF institutionnels sont extraits sans lire les PDF ni reprendre les corps de courriels',()=>{
 const contenu='<p>Accusé X, courrier privé</p>'+
 '<a class="download" href="/sites/default/files/2026-11/Role%20assises%20novembre.pdf">Téléchargement</a>'+
 '<a href="/sites/default/files/2026-11/Role%20assises%20novembre.pdf">Rôle des assises de novembre</a>'+
 '<a href="https://evil.example/role.pdf">Rôle illégal</a>'+
 '<a href="https://www.cours-appel.justice.fr/actualites">Actualités</a>';
 const docs=extraireDocuments(contenu,BASE);
 assert.equal(docs.length,1);
 assert.equal(docs[0].url,PDF1);
 assert.ok(!JSON.stringify(docs).includes('courrier privé'));
 assert.equal(extraireDocuments('<a href="/sites/default/files/audiences.pdf">PDF</a>',BASE,'ressort').length,1);
 assert.equal(extraireDocuments('<a href="/sites/default/files/depliant.pdf">PDF</a>',BASE,'ressort').length,0);
});

test('différences détectées pour ajouts, retraits et renommage de document',()=>{
 const a={url:PDF1,titre:'Rôle novembre'};
 const b={url:PDF2,titre:'Rôle décembre'};
 let d=differencier([a],[{...a,titre:'Rôle novembre actualisé'},b]);
 assert.equal(d.ajouts.length,1);
 assert.equal(d.retraits.length,0);
 assert.equal(d.renommes.length,1);
 d=differencier([a,b],[b]);
 assert.deepEqual(d.retraits,[a]);
 assert.equal(d.ajouts.length,0);
});

test('la première collecte constitue une base, les suivantes signalent les documents nouveaux',async()=>{
 const dossier=await mkdtemp(join(tmpdir(),'roles-ic-'));
 try{
  const opts={sources:[{url:BASE,codes:['33'],mode:'publication'}],
   etatChemin:join(dossier,'etat.json'),rapportChemin:join(dossier,'rapport.json'),issueChemin:join(dossier,'issue.md')};
  let r=await executer({...opts,lire:async()=>({urlFinale:BASE,html:html([{url:PDF1,titre:'Rôle novembre'}])})});
  assert.equal(r.initialisees,1);assert.equal(r.modifications.length,0);
  r=await executer({...opts,lire:async()=>({urlFinale:BASE,html:html([{url:PDF1,titre:'Rôle novembre'},{url:PDF2,titre:'Rôle décembre'}])})});
  assert.equal(r.initialisees,0);assert.equal(r.modifications.length,1);
  assert.equal(r.modifications[0].differences.ajouts[0].url,PDF2);
  const etat=JSON.parse(await readFile(opts.etatChemin,'utf8'));
  assert.equal(etat.pages[BASE].length,2);
  const notice=await readFile(opts.issueChemin,'utf8');
  assert.match(notice,/Vérification éditoriale obligatoire/);
  assert.match(notice,/décembre/);
 } finally {await rm(dossier,{recursive:true,force:true});}
});

test('un échec réseau ou une page vidée de tous ses documents ne supprime jamais le relevé précédent',async()=>{
 const dossier=await mkdtemp(join(tmpdir(),'roles-ic-'));
 try{
  const opts={sources:[{url:BASE,codes:['33'],mode:'publication'}],
    etatChemin:join(dossier,'etat.json'),rapportChemin:join(dossier,'rapport.json'),issueChemin:join(dossier,'issue.md')};
  await executer({...opts,lire:async()=>({urlFinale:BASE,html:html([{url:PDF1,titre:'Rôle novembre'}])})});
  await assert.rejects(
    executer({...opts,lire:async()=>({urlFinale:BASE,html:html([])})}),
    /Aucune source officielle accessible/
  );
  const etat=JSON.parse(await readFile(opts.etatChemin,'utf8'));
  assert.equal(etat.pages[BASE][0].url,PDF1);
  await assert.rejects(executer({...opts,lire:async()=>{throw Error('Timeout');}}),/Aucune source officielle accessible/);
 }finally{await rm(dossier,{recursive:true,force:true});}
});

test('le compte rendu ne prétend jamais valider une audience',()=>{
 const message=creerRapportMarkdown([{
  url:BASE,codes:['33'],differences:{ajouts:[{url:PDF1,titre:'Rôle novembre'}],retraits:[],renommes:[]}
 }]);
 assert.match(message,/ne prouve pas qu’une audience est fixée/);
 assert.match(message,/Vérification éditoriale obligatoire/);
});
