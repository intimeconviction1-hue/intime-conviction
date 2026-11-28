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
// Réserver aussi les quelques photos choisies pour les cartes de presse.
// Le reste de la photothèque demeure privé et ne passe jamais dans dist/.
const selectionPresse = join(dossier, 'selection-presse.json');
const visuelsPresse = [];
if (existsSync(selectionPresse)) {
  const { images = [] } = JSON.parse(await readFile(selectionPresse, 'utf8'));
  const inventaire = JSON.parse(await readFile(join(dossier, 'inventaire.json'), 'utf8'));
  const index = new Map(inventaire.images.filter(x => x.statut === 'unique').map(x => [x.image, x]));
  const imagesRedaction = new Set(Object.values(resultat).map(x => basename(x.image.src)));
  const dejaVues = new Set();
  for (const fichier of images) {
    if (typeof fichier !== 'string' || !/^[a-z0-9._-]+$/.test(fichier) || !fichier.endsWith('.webp') || basename(fichier) !== fichier)
      throw new Error('Nom de visuel presse invalide : ' + fichier);
    const details = index.get(fichier);
    if (!details) throw new Error('Image presse absente du catalogue : ' + fichier);
    if (imagesRedaction.has(fichier)) throw new Error('Photo presse déjà attribuée à la rédaction : ' + fichier);
    if (dejaVues.has(fichier)) throw new Error('Photo presse répétée dans la sélection : ' + fichier);
    dejaVues.add(fichier);
    await copyFile(join(dossier, 'images', fichier), join(destination, fichier));
    visuelsPresse.push({
      image: {src:'/illustrations-articles/' + fichier, width:details.largeur_origine, height:details.hauteur_origine},
      lieu:'Illustration judiciaire d’archives · Ne représente pas les faits ou l’audience rapportés',
      auteur:'Photothèque Intime Conviction',
      source:'/illustrations-articles/' + fichier
    });
  }
}
await writeFile(resolve('.cache/photos-presse.json'), JSON.stringify(visuelsPresse, null, 2) + '\n');

// Visuel institutionnel choisi dans la photothèque, indépendant des articles.
const fichierManchette = 'photos_assises-img-5317-3964923-caebef1a3.webp';
if (existsSync(join(dossier, 'images', fichierManchette))) {
  await copyFile(join(dossier, 'images', fichierManchette), join(destination, 'manchette-accueil.webp'));
}


/** Photographies documentaires Commons : téléchargement local, jamais de hotlink.
 * En cas d'indisponibilité, conserver le repli neutre existant.
 */
const documentaires = [
  {"slug":"versailles-sadhana-verdict-assises","fichier":"Cour d'assises de Versailles.jpg","nom":"assises-versailles","lieu":"Salle de la cour d’assises de Versailles, Journées du patrimoine 2019","auteur":"Tiraden","licence":"CC BY-SA 4.0","lienLicence":"https://creativecommons.org/licenses/by-sa/4.0/"},
  {"slug":"charente-assises-romain-runel-ouverture-proces","fichier":"Angoulême.Palais de Justice et Hôtel du Palais.jpg","nom":"palais-angouleme-historique","lieu":"Palais de justice d’Angoulême, carte postale vers 1910","auteur":"Anonyme, collection de cartes postales","licence":"Domaine public","lienLicence":"https://creativecommons.org/publicdomain/mark/1.0/"},
  { slug: 'roubaix-square-bousquet-tir-mehdi-proces-douai', fichier: 'Douai - Palais de justice - 1.jpg', nom: 'palais-douai', lieu: 'Palais de justice de Douai', auteur: 'Peter Potrowl', licence: 'CC BY-SA 4.0', lienLicence: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { slug: 'carine-charpentier-aisne-leroux-verdict-perles', fichier: 'Palais de Justice et remparts Laon.JPG', nom: 'palais-laon', lieu: 'Palais de justice de Laon et remparts', auteur: 'Rémih', licence: 'Domaine public', lienLicence: 'https://creativecommons.org/publicdomain/mark/1.0/' },
  { slug: 'grenoble-henry-duffourd-tentative-meurtre-quatre-condamnations', fichier: 'Palais de Justice Grenoble.JPG', nom: 'palais-grenoble', lieu: 'Palais de justice de Grenoble', auteur: 'Rémih', licence: 'CC BY-SA 3.0', lienLicence: 'https://creativecommons.org/licenses/by-sa/3.0/' }
];
const { createHash } = await import('node:crypto');
const { execFileSync } = await import('node:child_process');
const { mkdtemp } = await import('node:fs/promises');
const { tmpdir } = await import('node:os');
for (const photo of documentaires) {
  const temporaire = await mkdtemp(join(tmpdir(), 'ic-photo-'));
  const cible = join(destination, photo.nom + '.webp');
  try {
    const article = JSON.parse(await readFile(join(contenu, '2026', photo.slug + '.json'), 'utf8'));
    if (article.verificationEnCours === true || new Date(article.date) > new Date()) continue;
    const nom = photo.fichier.replace(/ /g, '_');
    const hash = createHash('md5').update(nom).digest('hex');
    const url = 'https://upload.wikimedia.org/wikipedia/commons/' + hash[0] + '/' + hash.slice(0, 2) + '/' + encodeURIComponent(nom);
    const reponse = await fetch(url, { headers: { 'User-Agent': 'IntimeConviction/1.0 (https://www.intimeconviction.fr/)' }, signal: AbortSignal.timeout(25000) });
    if (!reponse.ok || !reponse.headers.get('content-type')?.startsWith('image/')) throw new Error('HTTP ' + reponse.status);
    const octets = Buffer.from(await reponse.arrayBuffer());
    if (octets.length > 30000000 || octets.length < 1000) throw new Error('Taille image invalide');
    const original = join(temporaire, 'original.jpg');
    await writeFile(original, octets);
    execFileSync('convert', [original, '-auto-orient', '-resize', '1400x1400>', '-strip', '-quality', '83', cible], {timeout: 30000});
    const [width, height] = execFileSync('identify', ['-format', '%w %h', cible], {encoding:'utf8'}).trim().split(/\s+/).map(Number);
    if (!width || !height) throw new Error('Dimensions invalides');
    resultat[article.chemin] = {
      image: { src: '/illustrations-articles/' + photo.nom + '.webp', width, height },
      lieu: photo.lieu + ' · Photographie d’archives, hors audience, redimensionnée',
      auteur: photo.auteur, source: 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(nom),
      licence: photo.licence, lienLicence: photo.lienLicence, croquis: false
    };
    console.log('Photo documentaire locale : ' + photo.nom + ' (' + width + 'x' + height + ')');
  } catch (erreur) {
    await rm(cible, {force:true});
    console.warn('Photo documentaire indisponible : ' + photo.nom + ' ; repli existant conservé : ' + erreur.message);
  } finally { await rm(temporaire, {recursive:true, force:true}); }
}

await writeFile(cache, JSON.stringify(resultat, null, 2) + '\n');
console.log('Images retenues publiées : ' + Object.keys(resultat).length + ' ; autres images privées : non copiées.');
