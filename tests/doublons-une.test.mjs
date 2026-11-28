import test from 'node:test';
import assert from 'node:assert/strict';
import { presseSansRedite } from '../src/lib/doublons-une.mjs';

const une = [{data:{titre:'Mort d’Olivio Gomes : le procès en appel',sujetsPresse:['olivio gomes','olivio']}}];
const refs = [
  {titre:'Le procès en appel du policier qui a tué Olivio Gomes'},
  {titre:'Mort d’OLIVIO : la cour d’assises doit rejuger un policier'},
  {titre:'Le procès en appel du dossier X s’ouvre lundi'},
  {titre:'Une analyse du droit pénal et de la légitime défense'}
];

test('retire seulement les références identifiées comme déjà traitées en une',()=>{
  assert.deepEqual(presseSansRedite(refs,une),refs.slice(2));
});

test('conserve les références quand le dernier article ne déclare aucun sujet',()=>{
  assert.deepEqual(presseSansRedite(refs,[{data:{titre:'Procès'}}]),refs);
  assert.deepEqual(presseSansRedite(refs,[]),refs);
});

test('ne modifie ni archives ni liste de départ',()=>{
  const original=[...refs];
  presseSansRedite(refs,une);
  assert.deepEqual(refs,original);
});

test('identifie le sujet de l’article Mediapart même sans nom de la victime dans le titre',()=>{
  const sujet = 'Un policier condamné à dix ans de prison joue sa dernière chance en appel';
  const article = {data:{sujetsPresse:['olivio gomes', sujet]}};
  const references = [{titre:sujet,source:'Mediapart'}, {titre:'Un autre procès en appel devant les assises',source:'Autre média'}];
  assert.deepEqual(presseSansRedite(references,[article]),references.slice(1));
});

// Régression : un verdict couvert sort de la revue, pas les dossiers indépendants.
test('la revue de presse retire les verdicts de Daubon, Sarah Sadani et du pasteur de Reims après publication',()=>{
  const references = [
    {titre:'Cour d’assises de Pau : 30 ans de réclusion confirmés en appel pour l’empoisonnement d’Enea'},
    {titre:'Victime collatérale d’une fusillade à Marseille : trois jeunes écopent de 20 ans de réclusion'},
    {titre:'Un prédicateur évangélique condamné à 12 ans de réclusion pour les viols de trois femmes'},
    {titre:'À Pau, une autre affaire de violences devant la cour'},
    {titre:'À Reims, un autre procès pour viol'},
    {titre:'À Marseille, un procès distinct après une fusillade'}
  ];
  const publications = [
    {data:{sujetsPresse:['empoisonnement d Enéa']}},
    {data:{sujetsPresse:['Victime collatérale d une fusillade à Marseille trois jeunes écopent de 20 ans de réclusion']}},
    {data:{sujetsPresse:['prédicateur évangélique condamné à 12 ans de réclusion pour les viols de trois femmes']}}
  ];
  assert.deepEqual(presseSansRedite(references,publications),references.slice(3));
  assert.deepEqual(presseSansRedite(references,publications.slice(0,2)),references.slice(2));
});
