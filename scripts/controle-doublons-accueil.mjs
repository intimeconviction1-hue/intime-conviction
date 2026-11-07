#!/usr/bin/env node
// Vérifie la sortie HTML réellement produite : le seul test des fonctions
// n'est pas suffisant lorsqu'une page et un relevé de presse évoluent.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const articlesDir = process.env.IC_ARTICLES;
if (!articlesDir) throw new Error('IC_ARTICLES doit pointer vers le fonds éditorial privé.');

const normaliser = texte => String(texte ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLocaleLowerCase('fr').replace(/[’‘]/g,"'")
  .replace(/[^a-z0-9]+/g,' ').trim();

const fichier = await readFile(join(dist,'index.html'),'utf8');
const debut = fichier.indexOf('class="presse-section-intro"');
const fin = fichier.indexOf('class="parcours"',debut);
if (debut < 0 || fin < 0) throw new Error('Structure de la presse en page d’accueil introuvable.');
const presse = normaliser(fichier.slice(debut,fin).replace(/<[^>]*>/g,' '));

const dossier = join(articlesDir,'2026');
const fichiers = (await readdir(dossier)).filter(f=>f.endsWith('.json'));
const limite = Date.now() - 14*86_400_000;
const doublons = [];
for (const nom of fichiers) {
  const article = JSON.parse(await readFile(join(dossier,nom),'utf8'));
  if (!Array.isArray(article.sujetsPresse) || Date.parse(article.date) < limite) continue;
  for (const sujet of article.sujetsPresse) {
    const cle = ' ' + normaliser(sujet) + ' ';
    if (cle.trim().length >= 5 && (' ' + presse + ' ').includes(cle)) doublons.push({article:article.slug,sujet});
  }
}
if (doublons.length) {
  console.error('Doublon en page d’accueil détecté :', JSON.stringify(doublons));
  process.exitCode=1;
} else console.log('Accueil : aucun sujet récent du journal répété dans la sélection de presse.');
