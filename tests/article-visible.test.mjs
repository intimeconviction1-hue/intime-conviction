import test from 'node:test';
import assert from 'node:assert/strict';
import { articleVisible, articlesNonProgrammes, datePublicationAtteinte } from '../src/lib/article-visible.mjs';

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

test('un article daté exactement à l’instant de publication est visible', () => {
  assert.equal(articleVisible({date:new Date(maintenant)}, maintenant), true);
});

test('une date future ne peut créer ni page, ni entrée de recherche ou de sitemap', () => {
  const articles = [
    {id:'publie', data:{date:new Date(maintenant - 60000)}},
    {id:'programme', data:{date:new Date(maintenant + 60000)}},
    {id:'date-invalide', data:{date:new Date('invalid')}},
  ];
  assert.deepEqual(articlesNonProgrammes(articles, maintenant).map(a => a.id), ['publie']);
});

test('une archive historique en cours de vérification reste distincte des futures publications', () => {
  const archive={date:new Date(maintenant - 60000),verificationEnCours:true};
  assert.equal(datePublicationAtteinte(archive, maintenant), true);
  assert.equal(articleVisible(archive, maintenant), false);
  assert.deepEqual(articlesNonProgrammes([{data:archive}], maintenant).length, 1);
});

test('la date exacte autorise la génération, mais une seconde plus tard doit attendre', () => {
  assert.equal(datePublicationAtteinte({date:new Date(maintenant)},maintenant), true);
  assert.equal(datePublicationAtteinte({date:new Date(maintenant+1000)},maintenant), false);
});
