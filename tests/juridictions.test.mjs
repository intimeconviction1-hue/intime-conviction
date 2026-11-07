import {test} from 'node:test';import assert from 'node:assert/strict';
import {DOSSIERS} from '../src/lib/dossiers.mjs';
import {JURIDICTIONS,coordonneesPlan,juridictionsPourDossier,validerJuridictions} from '../src/lib/juridictions.mjs';
test('les cinq lieux des quatre dossiers sont documentés',()=>{
 assert.equal(JURIDICTIONS.length,5);
 assert.equal(validerJuridictions(JURIDICTIONS,DOSSIERS),true);
 assert.deepEqual(new Set(JURIDICTIONS.map(j=>j.dossier)),new Set(DOSSIERS.map(d=>d.slug)));
 assert.equal(juridictionsPourDossier('viols-de-mazan').length,2);
 assert.equal(juridictionsPourDossier('affaire-jubillar')[0].ville,'Albi');
});
test('les deux instances du procès de Mazan sont dans des villes distinctes',()=>{
 const lieux=juridictionsPourDossier('viols-de-mazan');
 assert.deepEqual(new Set(lieux.map(j=>j.ville)),new Set(['Avignon','Nîmes']));
 assert.deepEqual(new Set(lieux.map(j=>j.type)),new Set(['Première instance','Appel']));
});
test('les points de ville sont plausibles et la projection déterministe',()=>{
 for(const j of JURIDICTIONS){const a=coordonneesPlan(j.lat,j.lon);assert.ok(a.x>=0&&a.x<=100);assert.ok(a.y>=0&&a.y<=100);assert.deepEqual(coordonneesPlan(j.lat,j.lon),a);}
 assert.throws(()=>coordonneesPlan(NaN,0));
});
test('les sources institutionnelles sont obligatoires et fiables',()=>{
 const a=JURIDICTIONS[0];
 assert.throws(()=>validerJuridictions([{...a,urlInstitutionnelle:'https://fake.example.org'}],DOSSIERS));
 assert.throws(()=>validerJuridictions([{...a,lat:0}],DOSSIERS));
 assert.throws(()=>validerJuridictions([a,a],DOSSIERS));
 assert.deepEqual(juridictionsPourDossier('aucun'),[]);
});