import test from 'node:test';
import assert from 'node:assert/strict';
import {bilanEditorial} from '../scripts/auditer-production.mjs';
const reference=new Date('2026-11-20T17:00:00Z');
const article=(titre,date,extra={})=>({titre,date,auteur:'Rédaction d’Intime Conviction',chemin:'/'+titre+'/',...extra});
test('compte les articles par date de Paris, sans compter les titres de presse',()=>{
  const r=bilanEditorial([
    article('article-a','2026-11-19T23:30:00Z'),
    article('article-b','2026-11-20T10:00:00Z'),
    {titre:'presse',date:'2026-11-20T10:00:00Z',auteur:'Un quotidien',chemin:'/presse/'}
  ],{jours:2,dateReference:reference});
  assert.equal(r.jours[0].nombre,2);
  assert.equal(r.jours[1].nombre,0);
  assert.equal(r.jours[0].manque,3);
});
test('écarte les contenus futurs ou en vérification',()=>{
  const r=bilanEditorial([
    article('demain','2026-11-21T11:00:00Z'),
    article('verification','2026-11-20T10:00:00Z',{verificationEnCours:true})
  ],{jours:1,dateReference:reference});
  assert.equal(r.jours[0].nombre,0);
});
test('ne compte pas deux fois le même chemin',()=>{
  const r=bilanEditorial([article('titre','2026-11-20T09:00:00Z'),article('titre','2026-11-20T09:00:00Z')],{jours:1,dateReference:reference});
  assert.equal(r.jours[0].nombre,1);
  assert.ok(r.anomalies.some(x=>x.code==='identifiant_absent_ou_duplique'));
});
