import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routesArticles } from '../src/lib/adresses-articles.mjs';

const article = chemin => ({ data: { chemin } });

test('les archives gardent leur adresse WordPress et un accès par l’ancien dossier', () => {
  const chemin = '/des-proces-%c2%ab-durs-violents-%c2%bb/12/2009/';
  const archive = article(chemin);
  const avecBom = article('/%ef%bb%bfarchive/01/2010/');
  const ordinaire = article('/archive/01/2010/');
  const [route, routeBom, simple, redirection, redirectionBom] = routesArticles([archive, avecBom, ordinaire]);

  assert.deepEqual(route, {
    params: { slug: 'des-proces-«-durs-violents-»', mois: '12', annee: '2009' },
    article: archive
  });
  assert.equal(routeBom.params.slug, '\uFEFFarchive');
  assert.equal(simple.article, ordinaire);
  assert.deepEqual(redirection, {
    params: { slug: 'des-proces-%c2%ab-durs-violents-%c2%bb', mois: '12', annee: '2009' },
    redirection: chemin
  });
  assert.equal(redirectionBom.redirection, avecBom.data.chemin);
});

test('une collision après décodage ou normalisation arrête la construction', () => {
  assert.throws(() => routesArticles([
    article('/caf%c3%a9/01/2010/'),
    article('/cafe%cc%81/01/2010/')
  ]), /Collision d’adresses/);
  assert.equal(routesArticles([
    article('/caf%c3%a9/01/2010/'),
    article('/caf%C3%A9/02/2010/')
  ]).length, 4);
});
