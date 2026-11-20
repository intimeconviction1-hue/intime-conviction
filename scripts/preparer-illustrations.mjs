/**
 * Sélection privée des photos retenues pour les articles publiés.
 * Lit uniquement les attributions explicites du dépôt privé.
 * Copie uniquement ces fichiers dans l'artefact public du site.
 * Sans dépôt privé : aucune copie et maintien des photos historiques existantes.
 */
import { readFile, copyFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';
import { existsSync } from 'node:fs';

const contenu = resolve(process.env.IC_ARTICLES ?? 'articles-prives/articles');
const depot = resolve(contenu, '..');
const dossier = join(depot, 'phototheque');
const source = join(dossier, 'attributions.json');
const destination = resolve('public/illustrations-articles');
const cache = resolve('.cache/photos-publiees.json');

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await mkdir(resolve('.cache'), { recursive: true });

const resultat = {};
if (existsSync(source)) {
  const { attributions = {} } = JSON.parse(await readFile(source, 'utf8'));
  const inventaire = JSON.parse(await readFile(join(dossier, 'inventaire.json'), 'utf8'));
  const index = new Map(inventaire.images.filter(x => x.statut === 'unique').map(x => [x.image, x]));
  const utilisees = new Map();
  for (const [slug, attribution] of Object.entries(attributions)) {
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Slug image invalide : ' + slug);
    const fichier = attribution.image;
    if (!/^[a-z0-9._-]+\.webp$/.test(fichier) || basename(fichier) !== fichier) throw new Error('Nom image invalide : ' + fichier);
    const details = index.get(fichier);
    if (!details) throw new Error('Illustration absente du catalogue : ' + fichier);
    if (utilisees.has(fichier)) throw new Error('Illustration déjà attribuée à ' + utilisees.get(fichier) + ' : ' + slug);
    utilisees.set(fichier, slug);
    const cheminArticle = join(contenu, '2026', slug + '.json');
    if (!existsSync(cheminArticle)) throw new Error('Attribution à un article inexistant : ' + slug);
    const article = JSON.parse(await readFile(cheminArticle, 'utf8'));
    if (article.verificationEnCours === true || new Date(article.date) > new Date()) continue;
    // Ne pas rendre publique une image non sélectionnée, même si elle se trouve
    // dans le dépôt privé. Le choix est figé dans attributions.json.
    await copyFile(join(dossier, 'images', fichier), join(destination, fichier));
    resultat[article.chemin] = {
      image: {
        src: '/illustrations-articles/' + fichier,
        width: details.largeur_origine,
        height: details.hauteur_origine
      },
      lieu: attribution.legende || 'Illustration d’archives, sans lien avec cette audience',
      auteur: 'Photothèque Intime Conviction',
      source: '/illustrations-articles/' + fichier,
      licence: 'Image de la photothèque du journal',
      lienLicence: '/ligne-editoriale/',
      croquis: false
    };
  }
}
await writeFile(cache, JSON.stringify(resultat, null, 2) + '\n');
console.log('Images retenues publiées : ' + Object.keys(resultat).length + ' ; autres images privées : non copiées.');
