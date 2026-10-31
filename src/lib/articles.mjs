import { getCollection } from 'astro:content';

let cache;

// Tous les articles, du plus récent au plus ancien. Lu une fois par
// construction : 3 436 pages qui relisent chacune la collection, c'est 3 436
// fois le même tri.
export async function tousLesArticles() {
  cache ??= (await getCollection('articles')).sort((a, b) => b.data.date - a.data.date);
  return cache;
}

const FORMAT_DATE = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });
export const dateLongue = (d) => FORMAT_DATE.format(d);

const FORMAT_MOIS = new Intl.DateTimeFormat('fr-FR', { month: 'long', timeZone: 'Europe/Paris' });
export const nomDuMois = (d) => FORMAT_MOIS.format(d);

// 230 mots par minute, la vitesse de lecture courante d'un adulte en français.
export const minutesDeLecture = (mots) => Math.max(1, Math.round(mots / 230));
