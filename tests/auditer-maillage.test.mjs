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
  assert.equal(r.pagesOrphelines, 1);
});
