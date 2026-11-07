import test from 'node:test';
import assert from 'node:assert/strict';
import { formatArchiveVerifie } from '../src/lib/formats-archives.mjs';

test('les compilations historiques contrôlées portent une notice adaptée', () => {
  const selections = [
    '/13329-2/02/2017/',
    '/13366-2/02/2017/'
  ];
  for (const chemin of selections) {
    assert.equal(formatArchiveVerifie(chemin)?.nom, 'Sélection de presse');
  }
  const revues = [
    '/cours-du-jour-6-janvier-2025/01/2025/',
    '/cours-du-jour-17-janvier-2025/01/2025/'
  ];
  for (const chemin of revues) {
    assert.equal(formatArchiveVerifie(chemin)?.nom, 'Revue de presse');
  }
});

test('ne classe pas automatiquement les archives non vérifiées', () => {
  assert.equal(formatArchiveVerifie('/15-ans-de-prison-au-pirate-des-caraibes/05/2009/'), null);
  assert.equal(formatArchiveVerifie('/quelconque/01/2010/'), null);
});
