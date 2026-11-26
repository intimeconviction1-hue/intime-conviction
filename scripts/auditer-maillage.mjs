#!/usr/bin/env node
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://www.intimeconviction.fr';

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
        liensNonIndexables.push({ route, href: raw, cible });
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
  return {
    pagesIndexables: routes.size,
    liensInternes,
    imagesLocales,
    imagesLocalesCassees: imagesLocalesCassees.length,
    echantillonImagesLocalesCassees: imagesLocalesCassees.slice(0, 100),
    liensInternesCasses: liensCasses.length,
    echantillonLiensCasses: liensCasses.slice(0, 100),
    liensVersPagesNonIndexables: liensNonIndexables.length,
    liensVersSoi: liensVersSoi.length,
    echantillonLiensVersSoi: liensVersSoi.slice(0, 100),
    pagesOrphelines: orphelines.length,
    echantillonPagesOrphelines: orphelines.slice(0, 100),
    pagesAtteignablesDepuisAccueil: profondeurs.size,
    profondeurMoyenne: valeurs.length ? Number((valeurs.reduce((a, b) => a + b, 0) / valeurs.length).toFixed(2)) : null,
    profondeurMediane: percentile(.5),
    profondeurP90: percentile(.9),
    profondeurMaximale: valeurs.at(-1) ?? null,
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
