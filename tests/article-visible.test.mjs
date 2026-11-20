import test from 'node:test';
import assert from 'node:assert/strict';
import { articleVisible } from '../src/lib/article-visible.mjs';

const maintenant = Date.parse('2026-11-20T07:00:00Z');
test('un article daté dans le passé et vérifié peut figurer sur l’accueil', () => {
  assert.equal(articleVisible({date:new Date('2026-11-19T12:00:00Z')}, maintenant), true);
});
test('un article programmé pour plus tard ne figure pas à la une', () => {
  assert.equal(articleVisible({date:new Date('2026-11-21T08:00:00Z')}, maintenant), false);
});
test('un article en cours de vérification ne figure pas à la une', () => {
  assert.equal(articleVisible({date:new Date('2026-11-19T12:00:00Z'), verificationEnCours:true}, maintenant), false);
});
test('les dates absentes ou invalides ne deviennent jamais des publications', () => {
  assert.equal(articleVisible({date:new Date('invalid')}, maintenant), false);
  assert.equal(articleVisible({}, maintenant), false);
});
