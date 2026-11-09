// Lecture du relevé éditorial produit pendant la construction.
// Le mécanisme de collecte vit dans le dépôt privé consacré au contenu.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { classerNouvelle } from './classer-nouvelles.mjs';

export const CACHE = resolve('.cache/actualites.json');

export function lienDirectPresse(lien) {
  try {
    const u = new URL(lien);
    return ['https:', 'http:'].includes(u.protocol) && !u.username && !u.password && !u.port
      && u.hostname.includes('.')
      && !/(^|\.)google\.(com|fr)$|^news\.google\./i.test(u.hostname)
      && !/^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)|:|\.(local|internal)$/.test(u.hostname);
  } catch { return false; }
}

function lienGoogleNews(lien) {
  try {
    const u = new URL(lien);
    return u.protocol === 'https:' && u.hostname === 'news.google.com'
      && !u.username && !u.password && /^\/(rss\/)?articles\//.test(u.pathname);
  } catch { return false; }
}

export async function lireFil(chemin = CACHE) {
  try {
    const d = JSON.parse(await readFile(chemin, 'utf8'));
    if (!Number.isFinite(new Date(d.releveLe).getTime()) || !Array.isArray(d.articles)) return null;
    const articles = d.articles.filter(a =>
      typeof a.titre === 'string' && a.titre
      && typeof a.source === 'string' && a.source
      && (lienDirectPresse(a.lien) || lienGoogleNews(a.lien)) && Number.isFinite(new Date(a.date).getTime())
    );
    return articles.length ? {
      releveLe: d.releveLe,
      articles: articles.slice(0, 24).map(a => ({...a, rubrique: classerNouvelle(a.titre)}))
    } : null;
  } catch { return null; }
}
