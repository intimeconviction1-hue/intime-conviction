import test from 'node:test';
import assert from 'node:assert/strict';
import { hierarchiserPresse } from '../src/lib/hierarchiser-presse.mjs';

const ref = (titre, date) => ({ titre, date, source:'Journal', lien:'https://example.fr/article' });

test('préserve la priorité aux références du jour le plus récent', () => {
  const r = [
    ref('Verdict en appel', '2026-11-06T12:00:00Z'),
    ref('Une affaire évoquée', '2026-11-07T10:00:00Z'),
  ];
  assert.deepEqual(hierarchiserPresse(r).map(x=>x.titre), ['Une affaire évoquée', 'Verdict en appel']);
});

test('fait précéder un titre complet et judiciaire par rapport à un titre elliptique du même jour', () => {
  const r = [
    ref('Audience à...', '2026-11-07T11:00:00Z'),
    ref('Un regard sur la ville', '2026-11-07T10:00:00Z'),
    ref('Ouverture du procès à la cour d’assises', '2026-11-07T09:00:00Z')
  ];
  assert.deepEqual(hierarchiserPresse(r).map(x=>x.titre),
    ['Ouverture du procès à la cour d’assises','Un regard sur la ville','Audience à...']);
});

test('ne modifie ni les titres ni les dates ni les liens de presse et reste stable', () => {
  const a=ref('Procès du jour', '2026-11-07T10:00:00Z');
  const b=ref('Verdict annoncé', '2026-11-07T11:00:00Z');
  const items=[a,b];
  assert.deepEqual(hierarchiserPresse(items),[a,b]);
  assert.deepEqual(items,[a,b]);
  assert.equal(hierarchiserPresse([]).length,0);
});
