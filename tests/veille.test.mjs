import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normaliserVeille} from '../src/lib/veille.mjs';
const item={titre:'Un procès devant les assises',source:'Le Journal',lien:'https://journal.fr/affaire',dateAlerte:'2025-03-01'};
test('la veille garde uniquement les références publiques autorisées et aucune métadonnée du mail',()=>{
 const result=normaliserVeille([{...item,email:'prive@example.com',body:'texte privé',id:'secret'}]);
 assert.deepEqual(Object.keys(result[0]).sort(),['titre','source','lien','dateAlerte','rubrique'].sort());
 for(const lien of ['javascript:alert(1)','https://127.0.0.1/a','http://10.0.0.1/a','https://example.local/a','https://user:pass@journal.fr/a','https://www.google.fr/alerts?token=secret'])assert.equal(normaliserVeille([{...item,lien}]).length,0);
});
test('une référence répétée conserve la première date d’alerte, sans la rajeunir',()=>{
 const rows=normaliserVeille([{...item,dateAlerte:'2026-11-03'},{...item,lien:item.lien+'?utm_source=mail',dateAlerte:'2021-07-22'}]);
 assert.equal(rows.length,1);assert.equal(rows[0].dateAlerte,'2021-07-22');assert.equal(rows[0].lien,item.lien);
});
test('les titres sont classés par genre et les entrées invalides sont écartées',()=>{
 assert.equal(normaliserVeille([{...item,titre:'Cinéma : un film sur les assises'}])[0].rubrique,'le-greffe');
 assert.equal(normaliserVeille([{...item,dateAlerte:'inconnue'},{...item,lien:'/local'}]).length,0);
});
