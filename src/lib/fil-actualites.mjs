import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { classerNouvelle } from './classer-nouvelles.mjs';
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export const FLUX = "https://news.google.com/rss/search?q=cour%20d%27assises&hl=fr&gl=FR&ceid=FR:fr";
export const RECHERCHE = "https://www.google.fr/search?q=cour+d%27assises&hl=fr&gl=fr&tbm=nws&tbs=sbd%3A1";
export const CACHE = resolve('.cache/actualites.json');
const JOUR = 86_400_000;
const MAX_XML = 2_000_000;
const parser = new XMLParser({ ignoreAttributes:false, parseTagValue:false, trimValues:true });
const texte = (v) => String(typeof v === 'object' ? v?.['#text'] ?? '' : v ?? '').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();

function lienValide(v) {
  try {
    const u = new URL(v);
    return u.protocol === 'https:' && u.hostname === 'news.google.com'
      && !u.username && !u.password && /^\/(rss\/)?articles\//.test(u.pathname);
  } catch { return false; }
}

export function analyserFlux(xml, maintenant = new Date()) {
  if (typeof xml !== 'string' || xml.length > MAX_XML || /<!DOCTYPE|<!ENTITY/i.test(xml) || XMLValidator.validate(xml) !== true) {
    throw new Error('Flux XML invalide.');
  }
  const channel = parser.parse(xml)?.rss?.channel;
  if (!channel?.item) throw new Error('Flux sans nouvelles.');
  const items = Array.isArray(channel.item) ? channel.item : [channel.item];
  const vus = new Set();
  const articles = [];
  for (const item of items) {
    const source = texte(item.source).slice(0,180);
    let titre = texte(item.title);
    if (source && titre.endsWith(` - ${source}`)) titre = titre.slice(0,-source.length-3).trim();
    const date = new Date(texte(item.pubDate));
    const lien = texte(item.link);
    if (!titre || titre.length > 500 || !source || !lienValide(lien) || !Number.isFinite(date.getTime())) continue;
    if (date.getTime() > maintenant.getTime()+JOUR || date.getTime() < maintenant.getTime()-30*JOUR) continue;
    const cle = `${source}|${titre}`.normalize('NFKC').toLocaleLowerCase('fr');
    if (vus.has(cle)) continue;
    vus.add(cle);
    articles.push({ titre, source, date:date.toISOString(), lien, rubrique:classerNouvelle(titre) });
  }
  articles.sort((a,b) => b.date.localeCompare(a.date));
  if (!articles.length) throw new Error('Aucune nouvelle récente et valide.');
  return articles.slice(0,24);
}

export async function lireFil(chemin = CACHE) {
  try {
    const d = JSON.parse(await readFile(chemin,'utf8'));
    if (!Number.isFinite(new Date(d.releveLe).getTime()) || !Array.isArray(d.articles)) return null;
    const articles = d.articles.filter(a => typeof a.titre === 'string' && a.titre && typeof a.source === 'string' && a.source && lienValide(a.lien) && Number.isFinite(new Date(a.date).getTime()));
    // Reclasse aussi les anciens caches à chaque lecture : le repli sur panne
    // bénéficie immédiatement d'une correction des règles, sans réseau.
    return articles.length ? { releveLe:d.releveLe, articles:articles.slice(0,24).map(a=>({...a,rubrique:classerNouvelle(a.titre)})) } : null;
  } catch { return null; }
}

// Aucun relevé ne devient un commit. Une panne conserve le dernier relevé
// (et sa vraie date) ; sans relevé utilisable, le déploiement s'arrête pour
// laisser le site déjà publié en place.
export async function mettreAJour({ fetchImpl = fetch, chemin = CACHE, maintenant = new Date() } = {}) {
  let erreur;
  for (let tentative = 0; tentative < 2; tentative++) {
    try {
      const response = await fetchImpl(FLUX,{ signal:AbortSignal.timeout(20_000), headers:{ Accept:'application/rss+xml, application/xml' } });
      if (!response.ok) throw new Error(`Google Actualités : HTTP ${response.status}`);
      const contenu = await response.text();
      const articles = analyserFlux(contenu,maintenant);
      const releve = { releveLe:maintenant.toISOString(), articles };
      await mkdir(dirname(chemin),{recursive:true});
      const temporaire = chemin+'.tmp';
      await writeFile(temporaire,JSON.stringify(releve),'utf8');
      await rename(temporaire,chemin);
      return { ...releve, secours:false };
    } catch (e) { erreur=e; }
  }
  const ancien = await lireFil(chemin);
  if (ancien) return { ...ancien, secours:true };
  throw new Error(`Actualités indisponibles et aucun relevé de secours : ${erreur?.message}`);
}
