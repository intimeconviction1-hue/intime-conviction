import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DATE_CONTROLE_AGENDA,SESSIONS_AGENDA,SOURCES_A_COMPLETER,AUDIENCES_A_RECONFIRMER,PROVENANCE_AGENDA,provenancePeriode,sessionsAvenir,verifierSessions,dateLocaleAgenda} from '../src/lib/agenda-sessions.mjs';

test('les périodes publiées ont une source institutionnelle et des dates cohérentes',()=>{
  assert.equal(verifierSessions(),true);
  assert.equal(DATE_CONTROLE_AGENDA,'2026-11-07');
  assert.ok(SESSIONS_AGENDA.length>=7);
});
test('une date passée ne suffit pas à créer une audience fictive',()=>{
  assert.equal(sessionsAvenir(SESSIONS_AGENDA,'2027-01-01').length,0);
  assert.equal(sessionsAvenir(SESSIONS_AGENDA,'2026-11-07').length,SESSIONS_AGENDA.length);
});
test('doublon, période impossible et source tierce sont refusés',()=>{
  const exemple=SESSIONS_AGENDA[0];
  assert.throws(()=>verifierSessions([exemple,exemple]),/dupliquée/);
  assert.throws(()=>verifierSessions([{...exemple,debut:'2026-12-20',fin:'2026-12-01'}]),/invalide/);
  assert.throws(()=>verifierSessions([{...exemple,source:'https://example.com/role'}]),/institutionnelle/);
});

test('le filtrage suit la date civile française et expire les sessions terminées',()=>{
  assert.equal(dateLocaleAgenda(new Date('2026-11-07T23:30:00Z')),'2026-11-08');
  assert.ok(sessionsAvenir(SESSIONS_AGENDA,'2026-12-10').every(s=>s.fin>='2026-12-10'));
  assert.equal(sessionsAvenir(SESSIONS_AGENDA,'2026-12-19').length,0);
});

test('les sources sans date vérifiée restent hors de l’agenda daté',()=>{
 const ids=new Set(SESSIONS_AGENDA.map(s=>s.departement));
 for(const s of SOURCES_A_COMPLETER){
  assert.ok(s.ressort && s.statut && s.source);
  assert.equal(new URL(s.source).hostname,'www.cours-appel.justice.fr');
  assert.ok(!('debut' in s)&&!('fin' in s));
 }
 assert.equal(new Set(SOURCES_A_COMPLETER.map(s=>s.code)).size,SOURCES_A_COMPLETER.length);
});

test('session du Doubs : dates officielles conservées sans audience individuelle inventée',()=>{
 const session=SESSIONS_AGENDA.find(s=>s.id==='besancon-ccd-2026-12-07');
 assert.ok(session);
 assert.equal(session.debut,'2026-12-07');
 assert.equal(session.fin,'2026-12-18');
 assert.equal(session.juridiction,'Cour criminelle départementale du Doubs');
 assert.equal(session.source,'https://www.cours-appel.justice.fr/besancon/prochaines-sessions');
});

test('Savoie : session annoncée du 16 au 27 novembre 2026',()=>{
 const session=SESSIONS_AGENDA.find(s=>s.id==='chambery-assises-2026-11-16');
 assert.ok(session);
 assert.equal(session.debut,'2026-11-16');
 assert.equal(session.fin,'2026-11-27');
 assert.equal(session.source,'https://www.cours-appel.justice.fr/chambery/la-cour-dassises-de-la-savoie');
});
test('Sarthe : un rôle modificatif sans dates vérifiées reste une source non datée',()=>{
 const source=SOURCES_A_COMPLETER.find(s=>s.code==='72');
 assert.ok(source);
 assert.match(source.statut,/dates non confirmées/);
 assert.equal('debut' in source,false);
 assert.equal('fin' in source,false);
});

test('Finistère : seules les audiences non-mineurs sont consignées comme dates à reconfirmer',()=>{
 assert.equal(AUDIENCES_A_RECONFIRMER.length,7);
 assert.equal(new Set(AUDIENCES_A_RECONFIRMER.map(a=>a.id)).size,7);
 assert.ok(AUDIENCES_A_RECONFIRMER.every(a=>a.ville==='Quimper'||a.ville==='Rennes'));
 assert.ok(AUDIENCES_A_RECONFIRMER.every(a=>!a.juridiction.toLowerCase().includes('mineurs')));
 assert.ok(AUDIENCES_A_RECONFIRMER.every(a=>a.debut<=a.fin));
 assert.ok(AUDIENCES_A_RECONFIRMER.every(a=>new URL(a.source).hostname==='www.cours-appel.justice.fr'));
 assert.ok(sessionsAvenir(AUDIENCES_A_RECONFIRMER,'2027-01-01').length===0);
});

test('Ille-et-Vilaine : trois dates institutionnelles non reconfirmées, sans assises des mineurs',()=>{
 const rows=AUDIENCES_A_RECONFIRMER.filter(a=>a.departement==='Ille-et-Vilaine');
 assert.deepEqual(rows.map(a=>[a.debut,a.fin]),[
  ['2026-11-24','2026-11-26'],['2026-11-27','2026-11-30'],['2026-12-01','2026-12-04']
 ]);
 assert.deepEqual(rows.map(a=>a.juridiction),[
  'Cour criminelle départementale','Cour d’assises','Cour d’assises'
 ]);
 assert.ok(rows.every(a=>a.ville==='Rennes'));
 assert.ok(rows.every(a=>!a.juridiction.includes('mineurs')));
 assert.ok(rows.every(a=>a.source==='https://www.cours-appel.justice.fr/rennes/cour-dassises-et-la-cour-criminelle-departementale-dille-et-vilaine'));
});

test('la provenance distingue publication source, examen éditorial et confirmation',()=>{
 assert.equal(PROVENANCE_AGENDA.dateExamen,'2026-11-07');
 const session=provenancePeriode(SESSIONS_AGENDA[0]);
 assert.equal(session.publicationSource,null);
 assert.match(session.niveau,/Période de session/);
 const finistere=provenancePeriode(AUDIENCES_A_RECONFIRMER.find(a=>a.departement==='Finistère'));
 assert.equal(finistere.publicationSource,'2026-06-08');
 assert.match(finistere.niveau,/non reconfirmé/);
 const illeEtVilaine=provenancePeriode(AUDIENCES_A_RECONFIRMER.find(a=>a.departement==='Ille-et-Vilaine'));
 assert.equal(illeEtVilaine.publicationSource,'2026-09-16');
 assert.throws(()=>provenancePeriode({id:'inconnu',departement:'Inconnu'}),/Provenance inconnue/);
});

test('Limoges : les rôles initial et modificatif restent sans audience déduite',()=>{
  const source=SOURCES_A_COMPLETER.find(s=>s.code==='19-23-87');
  assert.ok(source);
  assert.match(source.statut,/initial et modificatif/);
  assert.match(source.statut,/PDF non lus/);
  assert.equal('debut' in source,false);
  assert.equal('fin' in source,false);
  assert.ok(!SESSIONS_AGENDA.some(s=>s.id.startsWith('limoges')));
});
