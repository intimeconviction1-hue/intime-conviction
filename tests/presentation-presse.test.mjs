import test from 'node:test';
import assert from 'node:assert/strict';
import { presenterTitrePresse } from '../src/lib/presentation-presse.mjs';

test('supprime uniquement un suffixe de source rigoureusement identique', () => {
  assert.deepEqual(presenterTitrePresse('Procès de la cour - BFM', 'BFM'), {
    titre:'Procès de la cour', original:'Procès de la cour - BFM', abrege:false
  });
  assert.equal(presenterTitrePresse('Procès de la cour - AFP', 'BFM').titre,'Procès de la cour - AFP');
});
test('signale explicitement les titres coupés sans inventer de fin', () => {
  const x=presenterTitrePresse('Audience : la cour examine... - BFM', 'BFM');
  assert.equal(x.titre,'Audience : la cour examine...');
  assert.equal(x.abrege,true);
});
test('préserve les tirets et noms propres à l’intérieur du titre', () => {
  assert.equal(presenterTitrePresse('Jean-Pierre à Saint-Brieuc : le verdict', 'Le Monde').titre,'Jean-Pierre à Saint-Brieuc : le verdict');
});
