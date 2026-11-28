import {test} from 'node:test';
import assert from 'node:assert/strict';
import {candidatsTextuels,articlesParImplantation} from '../src/lib/articles-geographiques.mjs';
const article=(titre,html='',extra={})=>({data:{chemin:'/test/',titre,html,...extra}});
test('une mention explicite reste une candidature non validée',()=>{
 const r=candidatsTextuels([article("La cour d’assises de Lyon examine le dossier")]);
 assert.equal(r.length,1);
 assert.deepEqual(r[0].implantations,['lyon']);
 assert.equal(r[0].statut,'a-verifier');
 assert.equal(articlesParImplantation([article('Test')],r).size,0);
});
test('une ville sans juridiction ne suffit pas',()=>{
 assert.deepEqual(candidatsTextuels([article('Les faits se sont déroulés à Lyon')]),[]);
});
test('plusieurs juridictions restent distinctes',()=>{
 const r=candidatsTextuels([article("Cour d’assises de Lyon",'<p>La cour d’assises de Paris est également citée.</p>')]);
 assert.deepEqual(new Set(r[0].implantations),new Set(['lyon','paris']));
});
test('les articles en cours de vérification sont exclus',()=>{
 assert.deepEqual(candidatsTextuels([article("Cour d’assises de Lyon",'',{verificationEnCours:true})]),[]);
});
test('les balises script ne constituent pas une preuve',()=>{
 assert.deepEqual(candidatsTextuels([article('Un dossier','<script>cour d’assises de Lyon</script>')]),[]);
});
