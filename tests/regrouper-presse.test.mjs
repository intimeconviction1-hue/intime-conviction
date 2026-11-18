import test from 'node:test';
import assert from 'node:assert/strict';
import { regrouperPresseAccueil } from '../src/lib/regrouper-presse.mjs';

const ref = (titre, date = '2026-11-18') => ({ titre, date, lien: 'https://example.org/' + encodeURIComponent(titre) });

test('deux sources sur le même verdict nommé donnent une seule carte', () => {
  const a = ref('Olivio Gomes condamné à huit ans de réclusion');
  const b = ref('Verdict : Olivio Gomes condamné en cour d’assises');
  const c = ref('Antoine Sollacaro : verdict aux assises');
  assert.deepEqual(regrouperPresseAccueil([a,b,c]), [a,c]);
});

test('des étapes différentes du même procès sont conservées', () => {
  const a = ref('Olivio Gomes : réquisitions du parquet');
  const b = ref('Olivio Gomes condamné : verdict rendu');
  const c = ref('Olivio Gomes : pourvoi en cassation');
  const d = ref('Olivio Gomes : audience reportée');
  assert.deepEqual(regrouperPresseAccueil([a,b,c,d]), [a,b,c,d]);
});

test('une décision en appel reste distincte du verdict non qualifié', () => {
  const a = ref('Olivio Gomes condamné : verdict');
  const b = ref('Olivio Gomes condamné en appel');
  assert.deepEqual(regrouperPresseAccueil([a,b]), [a,b]);
});

test('les dates éloignées sont préservées', () => {
  const a = ref('Antoine Sollacaro : verdict prononcé', '2026-11-10');
  const b = ref('Antoine Sollacaro : verdict prononcé', '2026-11-18');
  assert.deepEqual(regrouperPresseAccueil([a,b]), [a,b]);
});

test('aucune fusion sans nom complet ou sans événement explicite', () => {
  const a = ref('Verdict de la cour d’assises à Paris');
  const b = ref('Verdict de la cour d’assises à Paris');
  const c = ref('Olivio Gomes : les témoignages du procès');
  const d = ref('Olivio Gomes : les témoignages du procès');
  assert.deepEqual(regrouperPresseAccueil([a,b,c,d]), [a,b,c,d]);
});

test('ne modifie ni les références ni leur ordre', () => {
  const items = [ref('Verdict : Olivio Gomes condamné'), ref('Verdict : Olivio Gomes condamné')];
  assert.equal(regrouperPresseAccueil(items)[0], items[0]);
  assert.equal(items.length, 2);
});
