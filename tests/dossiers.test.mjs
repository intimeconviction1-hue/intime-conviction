import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DOSSIERS, normaliserTitre, referencesPourDossier, statistiquesDossier } from '../src/lib/dossiers.mjs';

const dossier = (slug) => DOSSIERS.find(d => d.slug === slug);
const item = (titre, dateAlerte='2024-01-01', lien='https://exemple.fr/a', source='Journal A') =>
  ({ titre, dateAlerte, lien, source });

test('les dossiers sont uniques et leurs règles explicitement établies', () => {
  assert.equal(new Set(DOSSIERS.map(d => d.slug)).size, DOSSIERS.length);
  assert.equal(DOSSIERS.length, 4);
});

test('la recherche reste insensible aux accents, ponctuations et casse', () => {
  assert.equal(normaliserTitre("Procès de l’A10, affaire PÉCHIER"), 'proces de l a10 affaire pechier');
  assert.equal(referencesPourDossier(dossier('affaire-pechier'), [item('PROCÈS de Frédéric PÉCHIER')]).length, 1);
});

test('un nom de dossier doit figurer dans le titre, pas dans un extrait ou un corps privé', () => {
  const liste = [
    {...item('Procès devant la cour d’assises'), extrait: 'Jubillar', body: 'Jubillar'},
    item('La cour examine la question Jubillar', '2025-09-25', 'https://exemple.fr/b'),
    item('La cour examine la question Dubillard', '2025-09-26', 'https://exemple.fr/c'),
  ];
  const r = referencesPourDossier(dossier('affaire-jubillar'), liste);
  assert.deepEqual(r.map(x => x.titre), ['La cour examine la question Jubillar']);
  assert.deepEqual(Object.keys(r[0]).sort(), ['dateAlerte','lien','source','titre']);
});

test('la petite martyre de l’A10 est reconnue sans retenir A10 isolé', () => {
  const r = referencesPourDossier(dossier('martyre-de-a10'), [
    item('La martyre de l’A10', '2024-05-01', 'https://exemple.fr/a'),
    item('Accident sur l’autoroute A10', '2024-05-02', 'https://exemple.fr/b'),
    item('Le dossier Inass Touloub', '2024-05-03', 'https://exemple.fr/c'),
  ]);
  assert.equal(r.length, 2);
});

test('la première date par URL est conservée, puis les liens triés du plus récent au plus ancien', () => {
  const refs = referencesPourDossier(dossier('viols-de-mazan'), [
    item('Mazan : dernier écho', '2026-09-04', 'https://exemple.fr/b', 'Source B'),
    item('Viols de Mazan : rappel', '2024-12-01', 'https://exemple.fr/a', 'Source A'),
    item('Viols de Mazan : rappel', '2025-02-01', 'https://exemple.fr/a', 'Source A'),
    item('Autre nouvelle', '2026-11-03', 'https://exemple.fr/c'),
  ]);
  assert.equal(refs.length, 2);
  assert.deepEqual(refs.map(x => x.dateAlerte), ['2026-09-04','2024-12-01']);
  assert.deepEqual(statistiquesDossier(refs), {
    total: 2, medias: 2, debut: '2024-12-01', fin: '2026-09-04',
    annees: [['2026',1],['2024',1]]
  });
});

test('aucune règle ne rapproche les titres sur la seule base du genre de crime', () => {
  const generic = [item('Un procès pour meurtre devant la cour d’assises')];
  for (const d of DOSSIERS) assert.equal(referencesPourDossier(d, generic).length, 0);
});
