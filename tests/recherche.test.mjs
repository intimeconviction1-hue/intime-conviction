import test from 'node:test';
import assert from 'node:assert/strict';
import { normaliser, preparerIndex, filtrerEtClasser, filtrerPresse } from '../src/lib/recherche.mjs';
import { dossiersPourRecherche } from '../src/lib/dossiers.mjs';

const index = preparerIndex([
  { titre: 'Cour d’assises : procès à Nîmes', extrait: 'Compte rendu des débats', rubrique: 'cours-du-jour', annee: 2025, chemin: '/a/' },
  { titre: 'Comment fonctionne une cour d’assises ?', extrait: 'Les jurés et le délibéré', rubrique: 'le-banc-des-jures', annee: 2024, chemin: '/b/' },
  { titre: 'Jury populaire', extrait: 'Un procès à Nimes devant la cour criminelle', rubrique: 'delibere', annee: 2023, chemin: '/c/' },
  { titre: 'Procès à Nîmes', extrait: 'Compte rendu', rubrique: 'cours-du-jour', annee: 2018, chemin: '/d/' },
]);

test('les accents, apostrophes et ligatures ne bloquent pas la recherche', () => {
  assert.equal(normaliser("L’ŒUVRE, à Nîmes"), 'l oeuvre a nimes');
  assert.equal(filtrerEtClasser(index, { q: 'nimes' }).length, 3);
});

test('expression exacte et titre prioritaire avant extrait', () => {
  const resultat = filtrerEtClasser(index, { q: 'procès à nimes' });
  assert.equal(resultat[0].chemin, '/d/');
  assert.equal(resultat[1].chemin, '/a/');
  assert.equal(resultat[2].chemin, '/c/');
});

test('la recherche multi-mots vérifie tous les termes, indépendamment de leur ordre', () => {
  const resultat = filtrerEtClasser(index, { q: 'jurés délibéré' });
  assert.deepEqual(resultat.map(a => a.chemin), ['/b/']);
});

test('les filtres par rubrique et année sont combinables', () => {
  assert.deepEqual(filtrerEtClasser(index, { q: 'nimes', rubrique: 'cours-du-jour', annee: '2018' }).map(a => a.chemin), ['/d/']);
});

test('la recherche vide affiche les archives dans leur ordre initial', () => {
  assert.deepEqual(filtrerEtClasser(index).map(a => a.chemin), ['/a/', '/b/', '/c/', '/d/']);
});

test('une affaire peut remonter dans les dossiers et la presse sans article du journal', () => {
  const presse = [
    ['Affaire Jubillar : nouvelle audience', 'Radio France', 'https://example.test/a', '2026-11-09'],
    ['Affaire Jubillar : enquête', 'France 3', 'https://example.test/b', '2025-11-09'],
    ['Le procès à Nîmes', 'Radio France', 'https://example.test/c', '2026-11-09'],
  ];
  assert.deepEqual(filtrerEtClasser(index, {q:'Jubillar'}), []);
  assert.deepEqual(dossiersPourRecherche('Jubillar').map(d => d.slug), ['affaire-jubillar']);
  assert.deepEqual(dossiersPourRecherche('procès'), []);
  assert.deepEqual(filtrerPresse(presse, {q:'Jubillar', annee:'2026'}), [presse[0]]);
  assert.deepEqual(filtrerPresse(presse, {q:'radio nimes'}), [presse[2]]);
});
