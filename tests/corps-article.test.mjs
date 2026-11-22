import { test } from 'node:test';
import assert from 'node:assert/strict';
import { niveauxDeTitres, liensArchives, corpsAffiche } from '../src/lib/corps-article.mjs';

test('les intertitres qui commencent en h4 remontent en h2, sans saut', () => {
  assert.equal(niveauxDeTitres('<h4>A</h4><p>x</p><h5 class="b">B</h5>'), '<h2>A</h2><p>x</p><h3 class="b">B</h3>');
});
test('des h4 suivis d’un h2 deviennent tous des h2', () => {
  assert.equal(niveauxDeTitres('<h4>a</h4><h4>b</h4><h2>c</h2><h4>d</h4>'), '<h2>a</h2><h2>b</h2><h2>c</h2><h3>d</h3>');
});
test('un corps qui commence déjà en h2 ne bouge pas', () => {
  assert.equal(niveauxDeTitres('<h2>A</h2><h3>B</h3>'), '<h2>A</h2><h3>B</h3>');
  assert.equal(niveauxDeTitres('<h2>A</h2><h4>B</h4>'), '<h2>A</h2><h3>B</h3>');
  assert.equal(niveauxDeTitres('<p>sans titre</p>'), '<p>sans titre</p>');
});
test('un lien externe ancien passe par l’archive, à la date de l’article', () => {
  assert.equal(liensArchives('<a href="http://www.lexpress.fr/a.html">x</a>', '2009-10-03'),
    '<a href="https://web.archive.org/web/20091003/http://www.lexpress.fr/a.html">x</a>');
});
test('nos propres liens, les liens déjà archivés et les articles récents ne bougent pas', () => {
  const nous = '<a href="https://www.intimeconviction.fr/x/">x</a><a href="/archives/">y</a>';
  assert.equal(liensArchives(nous, '2009-10-03'), nous);
  const archive = '<a href="https://web.archive.org/web/2010/http://a.fr/">x</a>';
  assert.equal(liensArchives(archive, '2009-10-03'), archive);
  const recent = '<a href="https://www.lemonde.fr/a">x</a>';
  assert.equal(liensArchives(recent, '2024-05-01'), recent);
});
test('anti-complaisance : la version sans réécriture laisse le lien mort tel quel', () => {
  const html = '<h3>T</h3><a href="http://quid.fr/">q</a>';
  assert.notEqual(corpsAffiche(html, '2010-01-01'), html);
  assert.match(corpsAffiche(html, '2010-01-01'), /^<h2>T<\/h2><a href="https:\/\/web\.archive\.org\/web\/20100101\/http:\/\/quid\.fr\/">/);
});
