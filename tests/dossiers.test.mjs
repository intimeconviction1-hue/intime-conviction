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

test('le dossier Mazan exclut une affaire distincte située dans la même commune', () => {
  const faux = item(
    'Meurtre de Jesse Vivaldi à Mazan : son ami condamné',
    '2026-11-01',
    'https://www.laprovence.com/article/faits-divers-justice/4014453826746614/meurtre-de-jesse-vivaldi-a-mazan-son-ami-d-enfance-condamne-a-20-ans-de-reclusion-criminelle-par-la-cour-d-assises'
  );
  const vrai = item('Procès en appel des viols de Mazan : nouvelle audience', '2026-11-02', 'https://exemple.fr/mazan');
  assert.deepEqual(referencesPourDossier(dossier('viols-de-mazan'), [faux, vrai]).map(a => a.titre), [vrai.titre]);
});

test('les références écartées d’un dossier ne disparaissent pas de la veille générale', () => {
  const comparaison = item('Un air de procès Pelicot… Laëtitia R. refuse le huis clos', '2026-05-18',
    'https://www.20minutes.fr/justice/4224088-20260518-air-proces-pelicot-laetitia-r-violee-torturee-prostituee-refuse-huis-clos-grand-dam-defense');
  assert.equal(referencesPourDossier(dossier('viols-de-mazan'), [comparaison]).length, 0);
});
