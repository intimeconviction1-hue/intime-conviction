import {test} from 'node:test';
import assert from 'node:assert/strict';
import {comparerReleves,validerReleve} from '../src/lib/comparer-roles.mjs';

const source='https://www.cours-appel.justice.fr/angers/la-cour-dassises-de-la-sarthe';
const avant={
 source,document:'Rôle initial (exemple fictif pour test)',version:'v1',releveLe:'2026-11-07',
 entrees:[
  {id:'ref-a',debut:'2026-11-23',fin:'2026-11-24',juridiction:'Cour d’assises'},
  {id:'ref-b',debut:'2026-11-25',fin:'2026-11-26',juridiction:'Cour d’assises'},
  {id:'ref-c',debut:'2026-12-01',fin:'2026-12-02',juridiction:'Cour criminelle'}
 ]};
const apres={
 ...avant,document:'Rôle modificatif (exemple fictif pour test)',version:'v2',releveLe:'2026-11-08',
 entrees:[
  {id:'ref-a',debut:'2026-11-24',fin:'2026-11-25',juridiction:'Cour d’assises'},
  {id:'ref-c',debut:'2026-12-01',fin:'2026-12-02',juridiction:'Cour criminelle'},
  {id:'ref-d',debut:'2026-12-03',fin:'2026-12-04',juridiction:'Cour d’assises'}
 ]};

test('écarts documentaires par identifiant stable : ajout, absence, date modifiée',()=>{
 const d=comparerReleves(avant,apres);
 assert.deepEqual(d.ajouts.map(x=>x.id),['ref-d']);
 assert.deepEqual(d.absences.map(x=>x.id),['ref-b']);
 assert.equal(d.changements.length,1);
 assert.equal(d.changements[0].id,'ref-a');
 assert.deepEqual(d.changements[0].champs.map(x=>x.champ),['debut','fin']);
 assert.match(d.note,/ne prouve ni annulation ni report/);
 assert.equal(d.versions.apres,'v2');
});
test('ordre différent ne crée aucun faux changement',()=>{
 const d=comparerReleves(avant,{...avant,entrees:[...avant.entrees].reverse()});
 assert.equal(d.ajouts.length+d.absences.length+d.changements.length,0);
});
test('sources, versions, dates et identifiants manquants sont rejetés',()=>{
 assert.throws(()=>validerReleve({...avant,source:'https://example.org/role'}),/institutionnelle/);
 assert.throws(()=>validerReleve({...avant,version:''}),/version/);
 assert.throws(()=>validerReleve({...avant,releveLe:'2026-02-30'}),/Date de relevé/);
 assert.throws(()=>validerReleve({...avant,entrees:[avant.entrees[0],avant.entrees[0]]}),/dupliqué/);
 assert.throws(()=>validerReleve({...avant,entrees:[{...avant.entrees[0],debut:'2026-11-29',fin:'2026-11-20'}]}),/Date documentaire/);
 assert.throws(()=>comparerReleves(avant,{...apres,source:'https://www.cours-appel.justice.fr/lyon/la-cour-dassises-du-rhone'}),/même page source/);
});
