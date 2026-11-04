import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { classerNouvelle } from './classer-nouvelles.mjs';
import { lireFil } from './fil-actualites.mjs';

export function normaliserVeille(rows) {
  if (!Array.isArray(rows)) throw new Error('Veille : liste attendue.');
  const uniques=new Map();
  for(const r of rows) {
    if(typeof r.titre!=='string'||r.titre.length<12||r.titre.length>500||typeof r.source!=='string'||!r.source||r.source.length>180||!/^\d{4}-\d{2}-\d{2}$/.test(r.dateAlerte)||!Number.isFinite(Date.parse(r.dateAlerte))) continue;
    let u;try {u=new URL(r.lien);}catch{continue;}
    if(!['https:','http:'].includes(u.protocol)||u.username||u.password||u.port||!u.hostname.includes('.')||/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(u.hostname)||/(:|\.(local|internal)$|google\.(com|fr)$)/.test(u.hostname))continue;
    for(const k of [...u.searchParams.keys()]) if(/^(utm_|fbclid|gclid)/i.test(k))u.searchParams.delete(k);
    u.hash='';
    const item={titre:r.titre.replace(/\s+/g,' ').trim(),source:r.source.trim(),lien:u.href,dateAlerte:r.dateAlerte,rubrique:classerNouvelle(r.titre)};
    const ancien=uniques.get(item.lien);
    // La première alerte connue situe le lien dans l’archive, sans le rajeunir.
    if(!ancien||item.dateAlerte<ancien.dateAlerte) uniques.set(item.lien,item);
  }
  return [...uniques.values()].sort((a,b)=>b.dateAlerte.localeCompare(a.dateAlerte)||a.titre.localeCompare(b.titre,'fr'));
}
let cache;
export async function lireVeille() {
  cache ??= (async()=>{
    const fichier=process.env.IC_VEILLE ?? resolve('../intime-conviction-articles/veille-alertes.json');
    try { const d=JSON.parse(await readFile(fichier,'utf8'));return {...d,articles:normaliserVeille(d.articles)}; }
    catch(e){if(e.code==='ENOENT'&&!process.env.IC_VEILLE)return {articles:[]};throw e;}
  })();
  return cache;
}
export async function lireActualites() {
  const [fil,veille]=await Promise.all([lireFil(),lireVeille()]);
  const seuil=Date.now()-7*86400000;
  const recents=veille.articles.filter(a=>Date.parse(a.dateAlerte)>=seuil).map(a=>({...a,date:a.dateAlerte+'T12:00:00Z'}));
  const vus=new Set(),articles=[];
  for(const a of [...(fil?.articles??[]),...recents]) {
    const cle=(a.source+'|'+a.titre).normalize('NFKC').toLocaleLowerCase('fr');
    if(vus.has(cle)||vus.has(a.lien))continue;vus.add(cle);vus.add(a.lien);articles.push(a);
  }
  articles.sort((a,b)=>b.date.localeCompare(a.date));
  return articles.length?{releveLe:fil?.releveLe??veille.importeLe,articles}:null;
}
