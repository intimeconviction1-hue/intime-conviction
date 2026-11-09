// Sitemap des pages publiques réellement générées par Astro.
// Les redirections, les pages des moteurs de recherche internes et les
// ressources externes ne sont pas proposées dans ce sitemap.
import { lireVeille } from '../lib/veille.mjs';
import { CULTURE } from '../lib/culture.mjs';
import { DOSSIERS, referencesPourDossier } from '../lib/dossiers.mjs';
import { RUBRIQUES } from '../lib/rubriques.mjs';
import { tousLesArticles } from '../lib/articles.mjs';

const PAR_PAGE_RUBRIQUE = 30;
const PAR_PAGE_PRESSE = 60;
const PAR_PAGE_DOSSIER = 42;

const PAGES_STATIQUES = [
  '/', '/archives/', '/archives/presse/',
  '/ligne-editoriale/', '/comprendre/', '/annuaire/',
  '/agenda/', '/assister/', '/jurisprudence/', '/veille-roles/', '/carte/',
  '/chronologie/', '/dossiers/'
];

export async function GET({ site }) {
  const [articles, veille] = await Promise.all([tousLesArticles(), lireVeille()]);
  const adresses = new Set(PAGES_STATIQUES);

  for (const c of CULTURE) adresses.add('/culture/' + c.slug + '/');

  const parRubrique = new Map(RUBRIQUES.map(r => [r.slug, 0]));
  for (const article of articles) {
    parRubrique.set(article.data.rubrique, (parRubrique.get(article.data.rubrique) ?? 0) + 1);
    // Une notice dont les faits restent invérifiables demeure accessible par son URL
    // historique, mais n'est pas proposée à l'indexation.
    if (article.data.verificationEnCours !== true) adresses.add(article.data.chemin);
    adresses.add('/archives/' + article.data.date.getFullYear() + '/');
  }
  for (const r of RUBRIQUES) {
    const pages = Math.ceil((parRubrique.get(r.slug) ?? 0) / PAR_PAGE_RUBRIQUE);
    for (let p = 1; p <= pages; p++) {
      adresses.add('/rubrique/' + r.slug + '/' + (p === 1 ? '' : p + '/'));
    }
  }

  const anneesPresse = new Map();
  for (const reference of veille.articles) {
    const annee = reference.dateAlerte.slice(0, 4);
    anneesPresse.set(annee, (anneesPresse.get(annee) ?? 0) + 1);
  }
  for (const [annee, count] of anneesPresse) {
    for (let p = 1; p <= Math.ceil(count / PAR_PAGE_PRESSE); p++) {
      adresses.add('/archives/presse/' + annee + '/' + (p === 1 ? '' : p + '/'));
    }
  }

  for (const dossier of DOSSIERS) {
    const total = referencesPourDossier(dossier, veille.articles).length;
    for (let p = 1; p <= Math.ceil(total / PAR_PAGE_DOSSIER); p++) {
      adresses.add('/dossiers/' + dossier.slug + '/' + (p === 1 ? '' : p + '/'));
    }
  }

  const xml = [...adresses].map(chemin => '<url><loc>' +
    new URL(chemin, site).href.replace(/&/g, '&amp;') + '</loc></url>').join('\n');
  return new Response('<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    xml + '\n</urlset>\n', {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
}
