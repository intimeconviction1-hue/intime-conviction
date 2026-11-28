#!/usr/bin/env node
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { IMPLANTATIONS } from '../src/lib/geographie-judiciaire.mjs';

const ORIGIN = 'https://www.intimeconviction.fr';

const exclusionsNoindexDocumentees = new Map([
  ...IMPLANTATIONS.map(v => ['/juridictions/' + v.id + '/', { nature: 'fiche territoriale provisoire', raison: 'Fiche institutionnelle accessible aux lecteurs, indexation différée jusqu’à validation de son enrichissement éditorial.' }]),
  ['/abonnement/', { nature: 'page utilitaire', raison: 'Espace abonnement non ouvert; la page explique la situation et indique le flux RSS.' }],
  ['/connexion/', { nature: 'page utilitaire', raison: 'Espace lecteur non ouvert; page de connexion sans contenu éditorial indexable.' }],
  ['/recherche/', { nature: 'moteur de recherche', raison: 'Résultats de recherche internes, exclus pour éviter l’indexation de pages à paramètres.' }],
  ['/archives/presse/rechercher/', { nature: 'moteur de recherche', raison: 'Résultats de recherche de la revue de presse, exclus pour éviter l’indexation de pages à paramètres.' }],
  ['/fratricide-a-grasse-un-proces-bouleversant-sur-fond-de-violences-familiales/01/2025/', { nature: 'archive en vérification', raison: 'Notice conservée après retrait du contenu non sourcé; la procédure n’a pas pu être identifiée avec certitude.' }],
]);

function classerDestinationNonIndexable(cible, redirections) {
  const redirection = redirections.find(entree => entree.route === cible);
  if (redirection) return { statut: 'redirection', nature: 'redirection statique', raison: 'La destination redirige vers ' + redirection.cible + '.' };
  const justification = exclusionsNoindexDocumentees.get(cible);
  if (justification) return { statut: 'exclusion légitime', ...justification };
  return { statut: 'à vérifier', nature: 'destination noindex non documentée', raison: 'Aucune justification éditoriale ou fonctionnelle enregistrée.' };
}
function normaliserRoute(pathname) {
  let path = decodeURIComponent(pathname || '/').replace(/\\/g, '/').replace(/\/index\.html$/i, '/').replace(/\.html$/i, '/');
  if (!path.startsWith('/')) path = '/' + path;
  path = path.replace(/\/{2,}/g, '/');
  return /\.[a-z0-9]{1,12}$/i.test(path) ? path : (path.endsWith('/') ? path : path + '/');
}

export function mesurerGraphe(pages, ressources = new Set()) {
  const toutesRoutes = new Set(pages.keys());
  const toutesRessources = new Set([...ressources].map(normaliserRoute));
  const indexables = new Map([...pages].filter(([, html]) => !/<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*noindex/i.test(html)));
  const routes = new Set(indexables.keys());
  const graphe = new Map([...routes].map(route => [route, new Set()]));
  const liensCasses = [];
  const liensNonIndexables = [];
  const nonIndexablesParCible = new Map();
  const liensVersSoi = [];
  let liensInternes = 0;
  let recommandations = 0;
  let imagesLocales = 0;
  const imagesLocalesCassees = [];
  const pagesAvecRecommandations = new Set();
  const redirections = [];
  const canoniquesNonConformes = [];

  for (const [route, html] of indexables) {
    if (/class=["'][^"']*voisins[^"']*["']/.test(html)) pagesAvecRecommandations.add(route);
    const canonical = /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i.exec(html)?.[1];
    if (canonical) {
      try {
        const c = normaliserRoute(new URL(canonical, ORIGIN).pathname);
        if (c !== route) canoniquesNonConformes.push({ route, canonique: c });
      } catch {}
    }
    const refresh = /<meta\b[^>]*\bhttp-equiv=["']refresh["'][^>]*\bcontent=["']\s*\d+\s*;\s*url=([^"']+)["']/i.exec(html)?.[1];
    if (refresh) {
      try { redirections.push({ route, cible: normaliserRoute(new URL(refresh, ORIGIN + route).pathname) }); } catch {}
    }

    for (const match of html.matchAll(/<a\b([^>]*?)\bhref=(["'])(.*?)\2([^>]*)>/gi)) {
      const attrs = match[1] + match[4];
      const raw = match[3].replaceAll('&amp;', '&');
      if (/data-maillage-link/i.test(attrs)) recommandations++;
      if (!raw || /^(?:mailto:|tel:|javascript:|data:)/i.test(raw)) continue;
      let url;
      try { url = new URL(raw, ORIGIN + route); } catch { continue; }
      if (!['www.intimeconviction.fr', 'intimeconviction.fr'].includes(url.hostname)) continue;
      const cible = normaliserRoute(url.pathname);
      liensInternes++;
      if (cible === route) {
        if (!url.hash) liensVersSoi.push({ route, href: raw });
        continue;
      }
      if (!toutesRoutes.has(cible) && !toutesRessources.has(cible)) {
        liensCasses.push({ route, href: raw, cible });
        continue;
      }
      if (!routes.has(cible)) {
        if (toutesRoutes.has(cible)) {
          liensNonIndexables.push({ route, href: raw, cible });
          let entree = nonIndexablesParCible.get(cible);
          if (!entree) entree = { cible, occurrences: 0, sources: new Set(), echantillonHref: raw };
          entree.occurrences++;
          entree.sources.add(route);
          nonIndexablesParCible.set(cible, entree);
        }
        continue;
      }
      graphe.get(route).add(cible);
    }
    for (const match of html.matchAll(/<img\b[^>]*\bsrc=(["'])(.*?)\1/gi)) {
      const raw = match[2].replaceAll('&amp;', '&');
      if (!raw || /^(?:data:|blob:)/i.test(raw)) continue;
      let url;
      try { url = new URL(raw, ORIGIN + route); } catch { continue; }
      if (!['www.intimeconviction.fr', 'intimeconviction.fr'].includes(url.hostname)) continue;
      imagesLocales++;
      const cible = normaliserRoute(url.pathname);
      if (!toutesRoutes.has(cible) && !toutesRessources.has(cible)) imagesLocalesCassees.push({ route, src: raw, cible });
    }
  }

  const profondeurs = new Map([['/', 0]]);
  const file = ['/'];
  for (let i = 0; i < file.length; i++) {
    const route = file[i];
    for (const cible of graphe.get(route) ?? []) {
      if (!profondeurs.has(cible)) {
        profondeurs.set(cible, profondeurs.get(route) + 1);
        file.push(cible);
      }
    }
  }
  const valeurs = [...profondeurs.values()].filter(n => n > 0).sort((a, b) => a - b);
  const percentile = p => valeurs.length ? valeurs[Math.floor((valeurs.length - 1) * p)] : null;
  const orphelines = [...routes].filter(route => route !== '/' && !profondeurs.has(route));
  const pagesAuDelaDeTroisClics = [...profondeurs]
    .filter(([route, profondeur]) => route !== '/' && profondeur > 3)
    .sort((a, b) => b[1] - a[1]);
  return {
    pagesIndexables: routes.size,
    liensInternes,
    imagesLocales,
    imagesLocalesCassees: imagesLocalesCassees.length,
    echantillonImagesLocalesCassees: imagesLocalesCassees.slice(0, 100),
    liensInternesCasses: liensCasses.length,
    echantillonLiensCasses: liensCasses.slice(0, 100).map(lien => ({ ...lien, classe: 'erreur technique', raison: 'La destination n’existe ni dans les pages ni dans les ressources générées.' })),
    liensVersPagesNonIndexables: liensNonIndexables.length,
    echantillonLiensVersPagesNonIndexables: liensNonIndexables.slice(0, 100),
    destinationsNonIndexablesUniques: [...nonIndexablesParCible.values()].map(entree => ({ cible: entree.cible, occurrences: entree.occurrences, pagesSources: entree.sources.size, echantillonHref: entree.echantillonHref, echantillonPagesSources: [...entree.sources].slice(0, 8), ...classerDestinationNonIndexable(entree.cible, redirections) })).sort((a, b) => b.occurrences - a.occurrences || a.cible.localeCompare(b.cible, 'fr')),
    liensVersSoi: liensVersSoi.length,
    echantillonLiensVersSoi: liensVersSoi.slice(0, 100),
    pagesOrphelines: orphelines.length,
    echantillonPagesOrphelines: orphelines.slice(0, 100),
    pagesAtteignablesDepuisAccueil: profondeurs.size,
    profondeurMoyenne: valeurs.length ? Number((valeurs.reduce((a, b) => a + b, 0) / valeurs.length).toFixed(2)) : null,
    profondeurMediane: percentile(.5),
    profondeurP90: percentile(.9),
    profondeurMaximale: valeurs.at(-1) ?? null,
    pagesAuDelaDeTroisClics: pagesAuDelaDeTroisClics.length,
    echantillonPagesProfondes: pagesAuDelaDeTroisClics.slice(0, 100).map(([route, profondeur]) => ({ route, profondeur })),
    pagesAvecRecommandations: pagesAvecRecommandations.size,
    liensDeRecommandation: recommandations,
    redirectionsStatiques: redirections,
    canoniquesNonConformes: canoniquesNonConformes.length,
    echantillonCanoniquesNonConformes: canoniquesNonConformes.slice(0, 100),
  };
}

async function auditerDossier(root) {
  const pages = new Map();
  const ressources = new Set();
  async function parcourir(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = resolve(dir, entry.name);
      if (entry.isDirectory()) await parcourir(file);
      else if (entry.isFile()) {
        const rel = relative(root, file).split(sep).join('/');
        let route = '/' + rel;
        if (extname(entry.name).toLowerCase() === '.html') {
          route = route.replace(/\/index\.html$/i, '/').replace(/\.html$/i, '/');
          route = normaliserRoute(route);
          if (route !== '/404/') pages.set(route, await readFile(file, 'utf8'));
        } else {
          ressources.add(normaliserRoute(route));
        }
      }
    }
  }
  await parcourir(root);
  return mesurerGraphe(pages, ressources);
}

async function main() {
  const root = resolve(process.argv[2] ?? 'dist');
  const report = { generatedAt: new Date().toISOString(), ...await auditerDossier(root) };
  const output = process.env.IC_AUDIT_MAILLAGE_OUTPUT;
  if (output) {
    await mkdir(dirname(resolve(output)), { recursive: true });
    await writeFile(output, JSON.stringify(report, null, 2) + '\n', 'utf8');
  }
  console.log(JSON.stringify(report, null, 2));
}
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) await main();
