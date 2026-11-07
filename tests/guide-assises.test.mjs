import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEPARTEMENTS_ASSISES, ETAPES_ASSISES, ACTEURS_ASSISES, LEXIQUE_ASSISES,
  trouverDepartements, validerAnnuaire, ANNUAIRE_OFFICIEL
} from '../src/lib/guide-assises.mjs';

test('les 101 départements sont uniques et tous consultables', () => {
  assert.equal(validerAnnuaire(),true);
  assert.equal(DEPARTEMENTS_ASSISES.length,101);
  assert.equal(new Set(DEPARTEMENTS_ASSISES.map(x=>x.code)).size,101);
  assert.equal(DEPARTEMENTS_ASSISES.filter(x=>x.outreMer).length,5);
  assert.ok(DEPARTEMENTS_ASSISES.every(x=>x.code&&x.departement&&x.ville));
});

test('l’annuaire tient compte de la cour commune Haute-Saône / Territoire de Belfort',()=>{
  const a=DEPARTEMENTS_ASSISES.find(x=>x.code==='70');
  const b=DEPARTEMENTS_ASSISES.find(x=>x.code==='90');
  assert.equal(a.ville,'Vesoul'); assert.equal(b.ville,'Vesoul');
  assert.equal(a.courPartagee,true); assert.equal(b.courPartagee,true);
  assert.equal(DEPARTEMENTS_ASSISES.filter(x=>x.courPartagee).length,2);
});

test('les villes-sièges dérogatoires identifiées dans le code de procédure pénale sont conservées',()=>{
  const valeurs=new Map(DEPARTEMENTS_ASSISES.map(x=>[x.code,x.ville]));
  assert.equal(valeurs.get('17'),'Saintes');
  assert.equal(valeurs.get('50'),'Coutances');
  assert.equal(valeurs.get('62'),'Saint-Omer');
  assert.equal(valeurs.get('71'),'Chalon-sur-Saône');
  assert.equal(valeurs.get('83'),'Draguignan');
});

test('recherche insensible aux accents et aux codes, sans ajouter de lieu inventé',()=>{
  assert.equal(trouverDepartements('ÉVRY').length,1);
  assert.equal(trouverDepartements('rEunION')[0].code,'974');
  assert.equal(trouverDepartements('vesoul').length,2);
  assert.equal(trouverDepartements('2B')[0].ville,'Bastia');
  assert.equal(trouverDepartements('973')[0].ville,'Cayenne');
  assert.equal(trouverDepartements('juridiction inventée').length,0);
});

test('le guide reste original, traçable et ne propose pas de rôles inventés',()=>{
  assert.equal(ETAPES_ASSISES.length,12);
  assert.equal(ACTEURS_ASSISES.length,8);
  assert.ok(LEXIQUE_ASSISES.length>=20);
  assert.equal(new Set(LEXIQUE_ASSISES.map(x=>x[0])).size,LEXIQUE_ASSISES.length);
  assert.ok(ETAPES_ASSISES.every(x=>x.titre.length>10&&x.texte.length>50));
  assert.ok(ANNUAIRE_OFFICIEL.startsWith('https://www.justice.gouv.fr/annuaire/'));
});
