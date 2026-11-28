import test from 'node:test';
import assert from 'node:assert/strict';
import { allouerVisuels, indexerMaillage, relierAuGuide } from '../src/lib/maillage.mjs';
const date = new Date('2026-11-20');
const article = (chemin, maillage, extra = {}) => ({data:{chemin, maillage, date, titre:'Une audience', extrait:'', ...extra}});

test('les liens explicites distinguent les affaires et omettent doublons, articles masqués et futurs', () => {
  const a = article('/a/', {affaire:'procès-a', recommander:['/a/', '/b/', '/c/', '/f/', '/d/']});
  const b = article('/b/', {affaire:'procès-a'});
  const c = article('/c/', {}, {verificationEnCours:true});
  const d = article('/d/');
  const f = article('/f/', {}, {date:new Date('2027-01-01')});
  assert.deepEqual(indexerMaillage([a,b,c,d,f], Date.parse('2026-11-27'))(a),
    [{titre:'Sur la même affaire', articles:[b]}, {titre:'Pour aller plus loin', articles:[d]}]);
});

test('un enjeu commun ne devient jamais une affaire commune', () => {
  const a = article('/a/', {}, {titre:'La légitime défense au procès de X'});
  const b = article('/b/', {}, {titre:'La légitime défense au procès de Y'});
  assert.equal(indexerMaillage([a,b], Date.parse('2026-11-27'))(a)[0].titre, 'Même enjeu juridique, autres affaires');
});

test('les thèmes littéraux du corps enrichissent le maillage sans créer un lien entre affaires', () => {
  const a = article('/a/', {}, {titre:'Audience à Lyon', html:'<p>Le dossier évoque un huis clos.</p>'});
  const b = article('/b/', {}, {titre:'Audience à Lille', html:'<p>Un autre procès se tient à huis clos.</p>'});
  const modules = indexerMaillage([a,b], Date.parse('2026-11-27'))(a);
  assert.equal(modules[0].titre, 'Même enjeu juridique, autres affaires');
  assert.match(modules[0].description, /ne signifie pas que les affaires, les faits ou les personnes sont liés/);
});
test('le guide est lié une seule fois dans la prose, sans toucher aux sources ni aux ancres existantes', () => {
  const html = '<p>Un pourvoi en cassation.</p><p>Un autre pourvoi en cassation.</p><h2>Sources</h2><p>La cour d’assises.</p>';
  const resultat = relierAuGuide(html);
  assert.equal(resultat.match(/href=/g).length, 1);
  assert.match(resultat, /href="\/jurisprudence\/">pourvoi en cassation/);
});

test('les visuels sont uniques entre les modules de recommandations', () => {
  const a = article('/a/', {});
  const b = article('/b/', {});
  const c = article('/c/', {});
  const modules = [{ titre: 'Premier', articles: [a, b] }, { titre: 'Second', articles: [c] }];
  const visibles = allouerVisuels(modules, data => ({
    image: { src: data.chemin === '/c/' ? 'photo-c' : 'photo-a' },
  }));
  assert.deepEqual(visibles.map(m => m.articles.map(x => x.data.chemin)), [['/a/'], ['/c/']]);
  assert.deepEqual(visibles[1].imagesExclues, ['photo-a']);
});
