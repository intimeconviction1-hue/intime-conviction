import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DOSSIERS } from '../src/lib/dossiers.mjs';
import { REPERES_JUDICIAIRES, VERIFICATION_AU, TYPES_REPERE, PHASES_REPERE,
  dateCalendrierValide, validerReperes, reperesPourDossier, tousLesReperes,
  couvertureParMois } from '../src/lib/chronologie-judiciaire.mjs';

test('le registre documentaire est attribué, sourcé et valide pour les quatre dossiers', () => {
  assert.ok(dateCalendrierValide(VERIFICATION_AU));
  assert.equal(validerReperes(REPERES_JUDICIAIRES, DOSSIERS), true);
  assert.equal(new Set(REPERES_JUDICIAIRES.map(r => r.id)).size, REPERES_JUDICIAIRES.length);
  assert.deepEqual(new Set(REPERES_JUDICIAIRES.map(r => r.dossier)),
    new Set(DOSSIERS.map(d => d.slug)));
  assert.ok(REPERES_JUDICIAIRES.length >= 9);
  for (const r of REPERES_JUDICIAIRES) {
    assert.ok(r.dateEvenement <= VERIFICATION_AU, 'date future indue');
    assert.ok(r.urlSource.startsWith('https://'));
    assert.ok(r.type in TYPES_REPERE);
    assert.ok(r.phase in PHASES_REPERE);
  }
});

test('une date inexistante n’est jamais retenue pour un événement ou une publication', () => {
  for (const d of ['2024-02-30', '2025-13-01', '2024-00-03', '2024-01-00', '2026-11-42', 'demain','2026-9-1']) {
    assert.equal(dateCalendrierValide(d), false, d);
  }
  assert.equal(dateCalendrierValide('2024-02-29'), true);
});

test('pas de source, fausse juridiction ou URL suspecte : l’import des jalons échoue', () => {
  const etalon = REPERES_JUDICIAIRES[0];
  for (const faux of [
    { ...etalon, dateEvenement: '2024-02-30' },
    { ...etalon, phase: 'cassation' },
    { ...etalon, type: 'verdict-invente' },
    { ...etalon, dossier: 'inconnu' },
    { ...etalon, urlSource: 'https://localhost/secret' },
    { ...etalon, urlSource: 'https://lemonde.fr@evil.example/a' },
    { ...etalon, urlSource: 'http://www.lemonde.fr/a' },
    { ...etalon, description: '' },
  ]) {
    assert.throws(() => validerReperes([faux], DOSSIERS));
  }
  assert.throws(() => validerReperes([etalon, { ...etalon }], DOSSIERS));
});

test('les jalons de procès et d’appel sont distingués par affaire et triés par date judiciaire', () => {
  const v = reperesPourDossier('viols-de-mazan');
  assert.ok(v.some(r => r.phase === 'appel' && r.type === 'ouverture'));
  assert.ok(v.some(r => r.phase === 'appel' && r.type === 'decision'));
  assert.ok(v.some(r => r.phase === 'premiere_instance' && r.type === 'decision'));
  assert.equal(v[0].dateEvenement, '2024-12-19');
  assert.equal(v.at(-1).dateEvenement, '2025-10-09');
  const avant = [...REPERES_JUDICIAIRES];
  const global = tousLesReperes();
  assert.ok(global.every((r,i) => i===0 || global[i-1].dateEvenement >= r.dateEvenement));
  assert.deepEqual(REPERES_JUDICIAIRES, avant);
  assert.deepEqual(reperesPourDossier('dossier-inconnu'), []);
});

test('la date de publication n’est pas confondue avec la date d’événement', () => {
  const verdict = REPERES_JUDICIAIRES.find(r => r.id === 'mazan-appel-verdict-2025');
  assert.equal(verdict.dateEvenement, '2025-10-09');
  assert.equal(verdict.dateSource, '2025-10-10');
  const ouverture = REPERES_JUDICIAIRES.find(r => r.id === 'inass-proces-ouverture-2026');
  assert.equal(ouverture.dateEvenement, '2026-11-02');
  assert.equal(ouverture.dateSource, '2026-11-01');
});

test('le suivi de veille compte séparément les dates d’alertes, sans les convertir en dates judiciaires', () => {
  const refs = [
    { dateAlerte: '2024-12-19', titre: 'source A' },
    { dateAlerte: '2024-12-20', titre: 'source B' },
    { dateAlerte: '2025-01-04', titre: 'source C' },
    { dateAlerte: '2024-02-30', titre: 'source erronée' },
  ];
  assert.deepEqual(couvertureParMois(refs), [{ mois:'2025-01', nombre:1 }, { mois:'2024-12', nombre:2 }]);
  assert.ok(REPERES_JUDICIAIRES.every(r => !('dateAlerte' in r)));
});
