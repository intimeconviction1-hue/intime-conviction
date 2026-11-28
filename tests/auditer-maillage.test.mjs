import test from 'node:test';
import assert from 'node:assert/strict';
import { mesurerGraphe } from '../scripts/auditer-maillage.mjs';

test('mesure liens, profondeur, orphelins, auto-liens et liens cassés', () => {
  const pages = new Map([
    ['/', '<a href="/rubrique/">Rubrique</a>'],
    ['/rubrique/', '<a href="/article/">Article</a><a href="/absent/">Absent</a>'],
    ['/article/', '<a href="/article/#debut">Sommaire</a><a href="/article/">Lien sur soi</a>'],
    ['/orpheline/', '<p>Page accessible par aucune autre page.</p>'],
  ]);
  const r = mesurerGraphe(pages);
  assert.equal(r.pagesIndexables, 4);
  assert.equal(r.liensInternesCasses, 1);
  assert.equal(r.liensVersSoi, 1);
  assert.equal(r.pagesOrphelines, 1);
  assert.equal(r.profondeurMoyenne, 1.5);
  assert.equal(r.profondeurMaximale, 2);
});

test('exclut du graphe les destinations noindex sans les compter cassées', () => {
  const pages = new Map([
    ['/', '<a href="/privee/">Lien</a><a href="/ouverte/">Autre</a>'],
    ['/privee/', '<meta name="robots" content="noindex,follow">'],
    ['/ouverte/', '<a href="/privee/">Lien</a>'],
  ]);
  const r = mesurerGraphe(pages);
  assert.equal(r.liensInternesCasses, 0);
  assert.equal(r.liensVersPagesNonIndexables, 2);
  assert.equal(r.echantillonLiensVersPagesNonIndexables.length, 2);
  assert.equal(r.echantillonLiensVersPagesNonIndexables[0].cible, '/privee/');
  assert.deepEqual(r.destinationsNonIndexablesUniques, [{ cible: '/privee/', occurrences: 2, pagesSources: 2, echantillonHref: '/privee/', echantillonPagesSources: ['/', '/ouverte/'] }]);
  assert.equal(r.pagesOrphelines, 0);
});

test('les fichiers statiques et flux valides ne sont pas signalés comme pages cassées', () => {
  const pages = new Map([['/', '<a href="/feed.xml">Flux</a><img src="/images/cour.webp">']]);
  const r = mesurerGraphe(pages, new Set(['/feed.xml', '/images/cour.webp']));
  assert.equal(r.liensInternesCasses, 0);
  assert.equal(r.liensVersPagesNonIndexables, 0);
  assert.equal(r.imagesLocales, 1);
  assert.equal(r.imagesLocalesCassees, 0);
});


test('expose les pages qui dépassent trois clics', () => {
  const pages = new Map([
    ['/', '<a href="/a/">A</a>'],
    ['/a/', '<a href="/b/">B</a>'],
    ['/b/', '<a href="/c/">C</a>'],
    ['/c/', '<a href="/d/">D</a>'],
    ['/d/', '<p>Page profonde.</p>'],
  ]);
  const r = mesurerGraphe(pages);
  assert.equal(r.pagesAuDelaDeTroisClics, 1);
  assert.deepEqual(r.echantillonPagesProfondes, [{ route: '/d/', profondeur: 4 }]);
});
