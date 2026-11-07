import test from 'node:test';
import assert from 'node:assert/strict';
import { anomalies, textePublic } from '../scripts/controle-publication.mjs';

test('refuse les explications destinées à la rédaction', () => {
  const html = '<html><body><main>Les titres sont présentés avec leur source. Ils ne constituent pas des comptes rendus d’audience réalisés par notre rédaction.</main></body></html>';
  assert.ok(anomalies(html).length > 0);
});

test('refuse les messages techniques RSS visibles', () => {
  assert.ok(anomalies('<p>Relevé RSS du 7 novembre 2026</p>').length > 0);
});

test('accepte une page de presse avec titre, source et date', () => {
  const html = '<h1>Cours du Jour</h1><article><time>7 novembre 2026</time><span>Le Monde</span><h2>Une audience s’ouvre à Paris</h2></article>';
  assert.deepEqual(anomalies(html), []);
});

test('ignore les commentaires HTML et le code technique', () => {
  const html = '<!-- Relevé RSS du 7 novembre 2026 --><script>const t="les titres sont présentés avec leur source";</script><h1>Cours du Jour</h1>';
  assert.deepEqual(anomalies(html), []);
  assert.equal(textePublic(html), 'Cours du Jour');
});

test('refuse les instructions de publication laissées dans la page', () => {
  assert.ok(anomalies('<p>TODO : rédaction</p>').length > 0);
});
