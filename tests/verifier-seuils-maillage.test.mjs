import test from 'node:test';
import assert from 'node:assert/strict';
import { verifierMaillage } from '../scripts/verifier-seuils-maillage.mjs';

const conforme = {
  liensInternesCasses: 0,
  imagesLocalesCassees: 0,
  canoniquesNonConformes: 0,
  pagesOrphelines: 0,
  profondeurMoyenne: 2.9,
  profondeurMaximale: 3,
  pagesAuDelaDeTroisClics: 0,
  destinationsNonIndexablesUniques: [{ cible: '/connexion/', statut: 'exclusion légitime' }],
};

test('accepte les mesures conformes et les exclusions noindex justifiées', () => {
  assert.deepEqual(verifierMaillage(conforme), []);
});

test('refuse les régressions du graphe et les nouvelles exclusions non justifiées', () => {
  const rapport = {
    ...conforme,
    liensInternesCasses: 2,
    pagesOrphelines: 1,
    profondeurMoyenne: 3.2,
    profondeurMaximale: 5,
    pagesAuDelaDeTroisClics: 1,
    destinationsNonIndexablesUniques: [{ cible: '/inconnue/', statut: 'à vérifier' }],
  };
  assert.deepEqual(verifierMaillage(rapport), [
    'liens cassés : 2',
    'pages orphelines : 1',
    'profondeur moyenne : 3.2',
    'profondeur maximale : 5',
    'pages au-delà de trois clics : 1',
    'destination noindex à justifier : /inconnue/',
  ]);
});
