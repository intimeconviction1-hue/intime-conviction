import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { analyserFlux, mettreAJour } from '../src/lib/fil-actualites.mjs';

const maintenant = new Date('2026-11-01T12:00:00Z');
const item = ({ titre='Un procès - Journal Exemple', source='Journal Exemple', date='Sun, 01 Nov 2026 10:00:00 GMT', lien='https://news.google.com/rss/articles/exemple' } = {}) => `<item><title><![CDATA[${titre}]]></title><link>${lien}</link><pubDate>${date}</pubDate><source url="https://example.org">${source}</source><description><![CDATA[Texte intégral à ne jamais recopier]]></description></item>`;
const rss = (...items) => `<rss version="2.0"><channel>${items.join('')}</channel></rss>`;

test('le flux donne un titre attribué et un lien, sans recopier la description', () => {
  const [a] = analyserFlux(rss(item()),maintenant);
  assert.equal(a.titre,'Un procès');
  assert.equal(a.source,'Journal Exemple');
  assert.equal(a.date,'2026-11-01T10:00:00.000Z');
  assert.equal(a.lien,'https://news.google.com/rss/articles/exemple');
  assert.equal('description' in a,false);
});

test('trie par date et dédoublonne un même titre du même média', () => {
  const titres = analyserFlux(rss(item({titre:'Plus ancien - Journal Exemple',date:'Fri, 30 Oct 2026 10:00:00 GMT'}),item(),item()),maintenant).map(a=>a.titre);
  assert.deepEqual(titres,['Un procès','Plus ancien']);
});

test('écarte liens dangereux, dates invalides, titres sans média et nouvelles périmées', () => {
  const articles = analyserFlux(rss(item(),item({titre:'Dangereux',lien:'javascript:alert(1)'}),item({titre:'Autre domaine',lien:'https://example.org/articles/x'}),item({titre:'Futur',date:'Sun, 08 Nov 2026 10:00:00 GMT'}),item({titre:'Ancien',date:'Wed, 01 Oct 2025 10:00:00 GMT'}),item({titre:'Sans date',date:'invalide'}),item({titre:'Sans source',source:''})),maintenant);
  assert.equal(articles.length,1);
});

test('refuse le XML malformé, les entités déclarées et un flux vide', () => {
  assert.throws(()=>analyserFlux('<html>erreur',maintenant));
  assert.throws(()=>analyserFlux('<!DOCTYPE rss [<!ENTITY a "x">]>'+rss(item()),maintenant));
  assert.throws(()=>analyserFlux(rss(),maintenant));
});

test('conserve uniquement 24 nouvelles, les plus récentes', () => {
  const articles = analyserFlux(rss(...Array.from({length:30},(_,i)=>item({titre:`Procès ${i}`,lien:`https://news.google.com/rss/articles/${i}`}))),maintenant);
  assert.equal(articles.length,24);
});

test('une panne garde exactement le dernier relevé et sa date', async () => {
  const dir = await mkdtemp(join(tmpdir(),'ic-actualites-'));
  const chemin=join(dir,'releve.json');
  try {
    await mettreAJour({chemin,maintenant,fetchImpl:async()=>({ok:true,text:async()=>rss(item())})});
    const avant=await readFile(chemin,'utf8');
    const secours=await mettreAJour({chemin,maintenant:new Date('2026-11-02T12:00:00Z'),fetchImpl:async()=>{throw new Error('réseau indisponible')}});
    assert.equal(secours.secours,true);
    assert.equal(secours.releveLe,maintenant.toISOString());
    assert.equal(await readFile(chemin,'utf8'),avant);
    // Une réponse HTML de Google ne doit pas écraser un relevé valide.
    const invalide=await mettreAJour({chemin,maintenant,fetchImpl:async()=>({ok:true,text:async()=>'<html>indisponible</html>'})});
    assert.equal(invalide.secours,true);
    assert.equal(await readFile(chemin,'utf8'),avant);
  } finally { await rm(dir,{recursive:true,force:true}); }
});

test('sans relevé utilisable, une panne arrête la publication', async () => {
  const dir=await mkdtemp(join(tmpdir(),'ic-actualites-'));
  try {
    const chemin=join(dir,'invalide.json');
    await writeFile(chemin,'{}');
    await assert.rejects(()=>mettreAJour({chemin,maintenant,fetchImpl:async()=>({ok:false,status:503})}),/aucun relevé de secours/);
  } finally { await rm(dir,{recursive:true,force:true}); }
});
