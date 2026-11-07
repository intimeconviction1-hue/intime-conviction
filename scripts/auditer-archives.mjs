#!/usr/bin/env node
/**
 * Audit documentaire non destructif du fonds d'articles.
 *
 * Usage :
 *   IC_ARTICLES=articles-prives/articles npm run audit:archives
 *
 * Ce programme signale les points à vérifier et n'altère jamais les fichiers.
 * Une mention « AFP » ou « SOURCE » ne prouve pas une reprise intégrale ;
 * elle impose seulement une vérification éditoriale de la provenance.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const racine = process.env.IC_ARTICLES ?? 'articles-prives/articles';
const fichiers = [];
async function parcourir(dossier) {
  for (const entree of await readdir(dossier, { withFileTypes: true })) {
    const chemin = join(dossier, entree.name);
    if (entree.isDirectory()) await parcourir(chemin);
    else if (entree.isFile() && entree.name.endsWith('.json')) fichiers.push(chemin);
  }
}

const findings = [];
const annees = new Map();
const urls = new Map();
const titres = new Map();
const avis = (niveau, code, chemin, detail) => findings.push({ niveau, code, fichier:relative(racine,chemin), detail });

try {
  await parcourir(racine);
} catch (error) {
  console.error('Fonds indisponible : ' + racine + ' (' + error.message + ')');
  process.exitCode = 1;
}

for (const chemin of fichiers) {
  let article;
  try { article = JSON.parse(await readFile(chemin, 'utf8')); }
  catch (error) { avis('erreur','json_invalide',chemin,error.message); continue; }

  const titre = typeof article.titre === 'string' ? article.titre.trim() : '';
  const html = typeof article.html === 'string' ? article.html : '';
  const annee = String(article.date ?? '').slice(0,4);
  const url = typeof article.chemin === 'string' ? article.chemin : '';
  if (!titre) avis('erreur','titre_absent',chemin,'Titre vide');
  if (!/^\d{4}$/.test(annee)) avis('erreur','date_invalide',chemin,'Date absente ou mal formée');
  else annees.set(annee,(annees.get(annee)??0)+1);
  if (!/^\/[\w%.-]+\/\d{2}\/\d{4}\/$/i.test(url)) avis('erreur','url_a_verifier',chemin,'Structure inattendue');
  if (url && urls.has(url)) avis('erreur','url_dupliquee',chemin,'Autre fichier : '+urls.get(url));
  else if (url) urls.set(url,relative(racine,chemin));
  if (titre) {
    const normalise = titre.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if (titres.has(normalise)) avis('a_verifier','titre_recurrent',chemin,'Autre fichier : '+titres.get(normalise));
    else titres.set(normalise,relative(racine,chemin));
    if (/^(cours du jour|les peines de la semaine|tour de france|hier la justice)\b/i.test(normalise))
      avis('a_verifier','titre_generique',chemin,'Un contexte descriptif peut être utile');
  }
  if (Number(article.mots) < 100) avis('a_verifier','contenu_court',chemin,String(article.mots ?? '?')+' mots annoncés');
  if (!html.trim()) avis('erreur','contenu_vide',chemin,'Champ HTML vide');
  // Une signature issue de l'import WordPress n'établit pas nécessairement
  // la paternité d'une dépêche ou d'un texte cité. Aucun changement automatique.
  const debutTexte = html.slice(0, 900)
    .replace(/<[^>]*>/g, ' ').replace(/&(?:nbsp|amp|quot|#\d+);/gi, ' ')
    .replace(/\s+/g, ' ').trim().slice(0, 300);
  const sourceEnOuverture = /^(?:AFP|AP|Reuters|SOURCE\b|NOUVELOBS\.COM|CLICANOO\.COM)\b/i.test(debutTexte)
    || /^\s*<p>\s*(?:AFP|AP|Reuters)\b/i.test(html);
  if (sourceEnOuverture) {
    avis('a_verifier','provenance_source',chemin,'Une source extérieure apparaît au début du texte');
    if (String(article.auteur ?? '').trim().toLowerCase() === 'intime conviction')
      avis('a_verifier','attribution_a_controler',chemin,'Signature générique et source extérieure mentionnée : vérifier les crédits');
  }
  if (!String(article.auteur ?? '').trim()) avis('a_verifier','signature_absente',chemin,'Aucun auteur renseigné');
}

const ordre = ['erreur','a_verifier'];
const comptes = Object.fromEntries(ordre.map(k=>[k,findings.filter(f=>f.niveau===k).length]));
const codes = {};
for (const f of findings) codes[f.code]=(codes[f.code]??0)+1;
console.log(JSON.stringify({
  fichiers:fichiers.length, repartitionParAnnee:Object.fromEntries([...annees].sort((a,b)=>b[0].localeCompare(a[0]))),
  signalements:comptes, parType:codes, exemples:findings.slice(0,40),
  note:'Signalements pour examen humain, jamais des corrections ou des conclusions automatiques.'
},null,2));
if (comptes.erreur) process.exitCode=1;
