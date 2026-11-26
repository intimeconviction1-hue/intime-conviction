#!/usr/bin/env node
/**
 * Barrière de publication : les pages destinées aux lecteurs ne doivent pas
 * contenir de notes de fabrication, d'explications sur le fonctionnement du site
 * ou de commentaires adressés à la rédaction.
 *
 * Les attributions de source, dates, titres, mentions légales, informations
 * d'accessibilité et les textes journalistiques ne sont pas bannis.
 */
import { access, readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = process.argv[2] ?? 'dist';
const exclusions = [
  { id: 'explication-du-flux', pattern: /(?:une sélection de titres publiés par des médias identifiés|les titres sont présentés avec leur source|il ne s’agit (?:ni|pas) (?:d’un|de) compte rendu d’audience réalisé par notre rédaction)/iu },
  { id: 'déclaration-interne', pattern: /(?:ne constituent pas des comptes rendus d.audience réalisés par notre rédaction|ces dossiers ne sont pas des enquêtes originales)/iu },
  { id: 'notice-automatisation', pattern: /(?:relevé rss du|dernière alerte archivée|flux rss (?:du|mis à jour)|collecte automatique de titres|relevé automatique du)/iu },
  { id: 'commentaire-interface', pattern: /(?:faites défiler la sélection|une sélection de titres publiés|les références sont issues d'un traitement automatique)/iu },
  { id: 'instructions-de-publication', pattern: /(?:texte à remplacer avant publication|commentaire interne à supprimer|placeholder éditorial|todo\s*:\s*(?:rédaction|publication))/iu },
];

export function normaliser(texte) {
  return texte.normalize('NFKC').replace(/&(?:nbsp|amp|quot|apos|rsquo|lsquo|hellip);/g, ' ')
    .replace(/&#(?:x[\da-f]+|\d+);/giu, ' ').replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, ' ').trim();
}

// Ne contrôler que les textes que le lecteur verra, et non le JavaScript,
// les styles ou les métadonnées techniques des documents.
export function textePublic(html) {
  return normaliser(html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, ' ')
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/giu, ' ')
    .replace(/<!--[^]*?-->/gu, ' ')
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/giu, ' ')
    .replace(/<[^>]+>/gu, ' '));
}

export function anomalies(html) {
  const publicTexte = textePublic(html);
  return exclusions.filter(regle => regle.pattern.test(publicTexte)).map(regle => regle.id);
}

async function parcours(dossier) {
  const fichiers = [];
  for (const element of await readdir(dossier, { withFileTypes: true })) {
    const chemin = join(dossier, element.name);
    if (element.isDirectory()) fichiers.push(...await parcours(chemin));
    else if (element.isFile() && chemin.endsWith('.html')) fichiers.push(chemin);
  }
  return fichiers;
}

if (process.argv[1]?.endsWith('controle-publication.mjs')) {
  let erreurs = 0;
  let articles = 0;
  const images = new Set();
  for (const fichier of await parcours(ROOT)) {
    const html = await readFile(fichier, 'utf8');
    const problemes = anomalies(html);
    if (relative(ROOT, fichier) === 'rubrique/cours-du-jour/index.html') {
      const grille = html.match(/<div id="articles-redaction"[^>]*>\s*<ul\b[^>]*>([\s\S]*?)<\/ul>/u)?.[1] ?? '';
      const visuels = new Map();
      for (const [, image] of grille.matchAll(/<img\b[^>]*\ssrc="([^"]+)"/gu)) {
        visuels.set(image, (visuels.get(image) ?? 0) + 1);
      }
      for (const [image, total] of visuels) {
        if (total > 1) console.warn(`Illustration répétée ${total} fois dans les derniers articles : ${image}`);
      }
    }
    if (/\/\d{2}\/\d{4}\/index\.html$/.test(fichier) && /<article class="article"(?: |>)/.test(html)) {
      articles++;
      const image = html.match(/<figure class="photo-article"[^>]*>\s*<img\b[^>]*\bsrc="(\/[^"]+)"/)?.[1];
      if (image) images.add(image);
      else problemes.push('illustration-article-absente');
    }
    if (problemes.length) {
      console.error('PAGE REFUSÉE :', relative(ROOT, fichier), '(', problemes.join(', '), ')');
      erreurs++;
    }
  }
  for (const image of images) {
    try { await access(join(ROOT, image)); }
    catch { erreurs++; console.error('IMAGE INTROUVABLE :', image); }
  }
  console.log(`Couverture des articles : ${articles} pages contrôlées, ${images.size} visuels référencés.`);
  if (erreurs) {
    console.error(`Publication bloquée : ${erreurs} anomalie(s) éditoriale(s) ou d’illustration.`);
    process.exitCode = 1;
  } else console.log('Contrôle éditorial : aucune note interne interdite détectée.');
}
