import test from 'node:test';
import assert from 'node:assert/strict';
import { alertesEcriture } from '../scripts/auditer-production.mjs';

const article = (html, data = {}) => ({
  auteur: 'Rédaction d’Intime Conviction',
  date: '2026-11-20T09:00:00+01:00',
  titre: 'Un récit judiciaire suffisamment précis pour être publié',
  extrait: 'Une confrontation d’arguments vérifiés.',
  html,
  ...data,
});

test('une chronique fluide, sourcée en fin de texte, ne déclenche aucune alerte', () => {
  const html = '<p>' + ('Une pièce vérifiée donne lieu à un débat contradictoire. ').repeat(60) +
    '</p><h2>Sources</h2><ul><li>Compte rendu</li></ul>';
  assert.deepEqual(alertesEcriture(article(html)), []);
});

test('signale les citations répétées et les mises à jour empilées', () => {
  const prose = ('Selon la presse, une étape est décrite. ').repeat(8) + ('La cour examine les faits. ').repeat(95);
  const html = '<p>' + prose + '</p>' +
    '<h2>Actualisation du 15 novembre</h2><p>A</p>' +
    '<h2>16 novembre 2026 · Débats</h2><p>B</p>' +
    '<h2>Mise à jour du 17 novembre</h2><p>C</p>' +
    '<h2>Sources</h2><ul><li>Documents</li></ul>';
  const avis = alertesEcriture(article(html));
  assert.ok(avis.includes('attributions_medias_envahissantes'));
  assert.ok(avis.includes('empilement_actualisations'));
});

test('ne retouche pas les articles historiques ou les documents de presse', () => {
  assert.deepEqual(alertesEcriture(article('<p>Archives</p>', { date: '2009-11-20' })), []);
  assert.deepEqual(alertesEcriture(article('<p>Presse</p>', { auteur: 'Agence extérieure' })), []);
});
