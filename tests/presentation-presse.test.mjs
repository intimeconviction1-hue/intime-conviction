import test from 'node:test';
import assert from 'node:assert/strict';
import { presenterTitrePresse, extraitPresseValide } from '../src/lib/presentation-presse.mjs';

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

test('ne fabrique aucun résumé à partir d’un simple titre ou d’un flux RSS', () => {
  assert.equal(extraitPresseValide({titre:'Procès et verdict',source:'Journal',lien:'https://example.fr/a'}),null);
  assert.equal(extraitPresseValide({titre:'Procès',extrait:'Texte non vérifié par la rédaction, sans lecture de la source.',lien:'https://example.fr/a'}),null);
});
test('accepte seulement un extrait rédigé et vérifié avec lien vers sa source', () => {
  const extrait='La juridiction doit examiner les éléments de l’accusation et de la défense, selon le compte rendu du média cité.';
  assert.equal(extraitPresseValide({lien:'https://example.fr/a',extrait,extraitVerifie:true}),extrait);
  assert.equal(extraitPresseValide({lien:'javascript:alert(1)',extrait,extraitVerifie:true}),null);
  assert.equal(extraitPresseValide({lien:'https://example.fr/a',extrait:'Trop court',extraitVerifie:true}),null);
});
