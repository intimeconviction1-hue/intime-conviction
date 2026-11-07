import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DATE_CONTROLE_AGENDA,SESSIONS_AGENDA,sessionsAvenir,verifierSessions,dateLocaleAgenda} from '../src/lib/agenda-sessions.mjs';

test('les périodes publiées ont une source institutionnelle et des dates cohérentes',()=>{
  assert.equal(verifierSessions(),true);
  assert.equal(DATE_CONTROLE_AGENDA,'2026-11-07');
  assert.ok(SESSIONS_AGENDA.length>=5);
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
