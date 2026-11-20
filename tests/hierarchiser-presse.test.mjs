import test from 'node:test';
import assert from 'node:assert/strict';
import { hierarchiserPresse, selectionnerPresseAccueil, pertinentPourAccueilPresse } from '../src/lib/hierarchiser-presse.mjs';

const ref = (titre, date) => ({ titre, date, source:'Journal', lien:'https://example.fr/article' });

test('préserve la priorité aux références du jour le plus récent', () => {
  const r = [
    ref('Verdict en appel', '2026-11-06T12:00:00Z'),
    ref('Une affaire évoquée', '2026-11-07T10:00:00Z'),
  ];
  assert.deepEqual(hierarchiserPresse(r).map(x=>x.titre), ['Une affaire évoquée', 'Verdict en appel']);
});

test('fait précéder un titre complet et judiciaire par rapport à un titre elliptique du même jour', () => {
  const r = [
    ref('Audience à...', '2026-11-07T11:00:00Z'),
    ref('Un regard sur la ville', '2026-11-07T10:00:00Z'),
    ref('Ouverture du procès à la cour d’assises', '2026-11-07T09:00:00Z')
  ];
  assert.deepEqual(hierarchiserPresse(r).map(x=>x.titre),
    ['Ouverture du procès à la cour d’assises','Un regard sur la ville','Audience à...']);
});

test('ne modifie ni les titres ni les dates ni les liens de presse et reste stable', () => {
  const a=ref('Procès du jour', '2026-11-07T10:00:00Z');
  const b=ref('Verdict annoncé', '2026-11-07T11:00:00Z');
  const items=[a,b];
  assert.deepEqual(hierarchiserPresse(items),[a,b]);
  assert.deepEqual(items,[a,b]);
  assert.equal(hierarchiserPresse([]).length,0);
});

test('une décision effectivement rapportée passe devant une simple ouverture le même jour', () => {
  const date='2026-11-20T10:00:00Z';
  const r=[
    ref('Audience devant la cour d’assises',date),
    ref('Un accusé condamné à quinze ans de réclusion',date),
    ref('Le procès s’ouvre demain',date),
  ];
  assert.deepEqual(hierarchiserPresse(r).map(x=>x.titre), [
    'Un accusé condamné à quinze ans de réclusion',
    'Audience devant la cour d’assises',
    'Le procès s’ouvre demain'
  ]);
});

test('ne prend pas une condamnation annoncée ou une peine requise pour une décision acquise', () => {
  const date='2026-11-20T10:00:00Z';
  const r=[
    ref('Audience : une peine requise par l’avocat général',date),
    ref('Condamnation annoncée dans un procès',date),
    ref('Le verdict rendu après trois jours de délibéré',date),
  ];
  assert.equal(hierarchiserPresse(r)[0].titre, 'Le verdict rendu après trois jours de délibéré');
});

test('la chronologie prime toujours sur une décision ancienne, sans modifier les données', () => {
  const r=[
    ref('Un accusé condamné à vingt ans', '2026-11-19T20:00:00Z'),
    ref('Une audience débute', '2026-11-20T08:00:00Z')
  ];
  assert.equal(hierarchiserPresse(r)[0].titre, 'Une audience débute');
  assert.equal(r[0].titre,'Un accusé condamné à vingt ans');
});

test('l’accueil privilégie une décision effective plutôt qu’un titre sans enjeu plus récent', () => {
  const titres = [
    {titre:'Un regard général sur la justice',source:'Journal A',date:'2026-11-20T10:00:00Z'},
    {titre:'Un accusé condamné à quinze ans',source:'Journal B',date:'2026-11-19T18:00:00Z'},
    {titre:'Audience au tribunal...',source:'Journal C',date:'2026-11-20T08:00:00Z'}
  ];
  const selection = selectionnerPresseAccueil(titres, 2);
  assert.equal(selection[0].titre,'Un accusé condamné à quinze ans');
  assert.equal(selection.includes(titres[2]),false);
  assert.equal(titres[0].titre,'Un regard général sur la justice');
});

test('l’accueil varie les médias et ne supprime aucune référence du relevé', () => {
  const liste = [
    ...Array.from({length:4}, (_,i)=>({titre:'Un condamné jugé en appel '+i,source:'Journal A',date:'2026-11-20T10:00:00Z'})),
    {titre:'Audience au tribunal judiciaire',source:'Journal B',date:'2026-11-20T09:00:00Z'},
    {titre:'Début du procès',source:'Journal C',date:'2026-11-20T09:00:00Z'}
  ];
  const selection = selectionnerPresseAccueil(liste,5);
  assert.equal(selection.length,5);
  assert.equal(selection.filter(a=>a.source==='Journal A').length,3);
  assert.equal(selection.some(a=>a.source==='Journal B'),true);
  assert.equal(selection.some(a=>a.source==='Journal C'),true);
  assert.equal(liste.length,6);
  assert.deepEqual(selectionnerPresseAccueil([],5),[]);
});

test('la vitrine écarte les congrès nommés assises et les procès étrangers identifiés', () => {
  assert.equal(pertinentPourAccueilPresse({titre:'Assises de la Protection de l’enfance : une nouvelle convention'}),false);
  assert.equal(pertinentPourAccueilPresse({titre:'Assises de Liège : le jury délibère sur Brandon Mathy'}),false);
  assert.equal(pertinentPourAccueilPresse({titre:'Le verdict à Houffalize'}),false);
  assert.equal(pertinentPourAccueilPresse({titre:'Assises du Haut-Rhin : 22 ans en appel'}),true);
  assert.equal(pertinentPourAccueilPresse({titre:'Au procès de Sarah Sadani, un témoin appelé à la barre'}),true);
});
