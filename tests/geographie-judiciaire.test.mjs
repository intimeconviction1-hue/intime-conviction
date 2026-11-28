import {test} from 'node:test';
import assert from 'node:assert/strict';
import {IMPLANTATIONS,TERRITOIRES,validerGeographie,associationsVerifiees} from '../src/lib/geographie-judiciaire.mjs';
test('couverture des 101 départements et 18 régions',()=>{
 assert.equal(validerGeographie(),true);
 assert.equal(new Set(TERRITOIRES.filter(t=>!t.collectivite).map(t=>t.region)).size,18);
 assert.equal(IMPLANTATIONS.length,104);
 assert.equal(TERRITOIRES.filter(t=>!t.collectivite).length,101);
 assert.equal(TERRITOIRES.filter(t=>t.collectivite).length,4);
 assert.deepEqual(TERRITOIRES.filter(t=>t.collectivite).map(t=>t.code),['975','986','987','988']);
});
test('Vesoul est une implantation unique pour deux départements',()=>{
 assert.deepEqual(IMPLANTATIONS.find(i=>i.id==='vesoul').departements,['70','90']);
});
test('aucune association implicite ou non vérifiée',()=>{
 const article={chemin:'/test/',titre:'Procès à Lyon'};
 const a={chemin:'/test/',implantation:'lyon',codeDepartement:'69',statut:'verifie',source:'https://example.org/source',nature:'assises',instance:'appel'};
 assert.deepEqual(associationsVerifiees(article),[]);
 assert.deepEqual(associationsVerifiees(article,[{...a,statut:'incertain'}]),[]);
 assert.deepEqual(associationsVerifiees(article,[{...a,codeDepartement:'75'}]),[]);
 assert.deepEqual(associationsVerifiees({...article,verificationEnCours:true},[a]),[]);
 assert.deepEqual(associationsVerifiees(article,[a]),[a]);
});
test('les cinq implantations documentées restent accessibles',()=>{
 assert.equal(IMPLANTATIONS.flatMap(i=>i.jalons).length,5);
});
