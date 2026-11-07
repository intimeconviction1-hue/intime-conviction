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
