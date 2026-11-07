import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DEPARTEMENTS_ASSISES} from '../src/lib/guide-assises.mjs';
import {ROLES_OFFICIELS,VERIFIE_LE,MODES_ROLES,roleParDepartement,dossiersParDepartement,validerRoles} from '../src/lib/roles-officiels.mjs';
import {DOSSIERS} from '../src/lib/dossiers.mjs';

test('les rôles vérifiés concernent de vrais départements sans doublons ni domaines tiers',()=>{
 assert.equal(validerRoles(DEPARTEMENTS_ASSISES),true);
 assert.equal(VERIFIE_LE,'2026-11-07');
 assert.ok(ROLES_OFFICIELS.length>=17);
 assert.equal(new Set(ROLES_OFFICIELS.map(x=>x.code)).size,ROLES_OFFICIELS.length);
 for(const r of ROLES_OFFICIELS){
  assert.ok(r.mode in MODES_ROLES);
  assert.equal(new URL(r.url).hostname,'www.cours-appel.justice.fr');
  assert.ok(r.note.length>25);
 }
});
test('les rôles de Bordeaux, Toulouse et Rhône sont des liens publics institutionnels',()=>{
 for(const code of ['31','33','42','69','72']){
  const r=roleParDepartement(code);
  assert.equal(r.mode,'publication');
  assert.ok(r.url.startsWith('https://www.cours-appel.justice.fr/'));
 }
});
test('la consultation journalistique sur place ne devient jamais un rôle librement accessible',()=>{
 for(const code of ['27','76']){
  const r=roleParDepartement(code);
  assert.equal(r.mode,'sur-place');
  assert.ok(/sur place|sur-place/.test(r.note));
 }
});
test('ressort partagé, information de ressort et absence de calendrier sont distingués',()=>{
 for(const code of ['70','90','19','23','87','39']){
  assert.equal(roleParDepartement(code).mode,'ressort');
 }
 assert.equal(roleParDepartement('14').mode,'information');
 assert.equal(roleParDepartement('81'),null);
 assert.equal(roleParDepartement('XXX'),null);
});
test('les liens locaux des dossiers ne sont proposés que dans les départements identifiés',()=>{
 const slugs=new Set(DOSSIERS.map(x=>x.slug));
 const correspondances={'25':'affaire-pechier','30':'viols-de-mazan','41':'martyre-de-a10','81':'affaire-jubillar','84':'viols-de-mazan'};
 for(const [code,slug] of Object.entries(correspondances)){
   assert.equal(dossiersParDepartement(code)[0].slug,slug);
   assert.ok(slugs.has(slug));
 }
 assert.deepEqual(dossiersParDepartement('75'),[]);
 assert.deepEqual(dossiersParDepartement('inconnu'),[]);
});
