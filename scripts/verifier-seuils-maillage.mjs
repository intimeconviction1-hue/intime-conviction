#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

export function verifierMaillage(rapport) {
  const erreurs = [];
  if (rapport.liensInternesCasses !== 0) erreurs.push('liens cassés : ' + rapport.liensInternesCasses);
  if (rapport.imagesLocalesCassees !== 0) erreurs.push('images manquantes : ' + rapport.imagesLocalesCassees);
  if (rapport.canoniquesNonConformes !== 0) erreurs.push('canoniques non conformes : ' + rapport.canoniquesNonConformes);
  if (rapport.pagesOrphelines !== 0) erreurs.push('pages orphelines : ' + rapport.pagesOrphelines);
  if (rapport.profondeurMoyenne === null || rapport.profondeurMoyenne >= 3) erreurs.push('profondeur moyenne : ' + rapport.profondeurMoyenne);
  if (rapport.profondeurMaximale === null || rapport.profondeurMaximale > 3) erreurs.push('profondeur maximale : ' + rapport.profondeurMaximale);
  if (rapport.pagesAuDelaDeTroisClics !== 0) erreurs.push('pages au-delà de trois clics : ' + rapport.pagesAuDelaDeTroisClics);
  for (const destination of rapport.destinationsNonIndexablesUniques ?? []) {
    if (destination.statut === 'à vérifier') erreurs.push('destination noindex à justifier : ' + destination.cible);
  }
  return erreurs;
}

if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  const fichier = process.argv[2];
  if (!fichier) throw new Error('Usage : node scripts/verifier-seuils-maillage.mjs rapport.json');
  const rapport = JSON.parse(await readFile(fichier, 'utf8'));
  const erreurs = verifierMaillage(rapport);
  if (erreurs.length) {
    console.error(erreurs.join('\\n'));
    process.exitCode = 1;
  } else {
    console.log('Graphe conforme : aucun lien cassé, aucune page orpheline, profondeur ≤ 3 et destinations noindex justifiées.');
  }
}
