import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normaliserVeille, estCouvertParRedaction} from '../src/lib/veille.mjs';
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

// Le filtre s'applique aux sélections publiques, jamais au relevé archivé.
test('écarte les titres sur une affaire déjà traitée, même si le prénom est omis',()=>{
 const sujets=['michel zecler','affaire Zecler','Zecler'];
 assert.equal(estCouvertParRedaction('Procès Zecler : nouvelle journée devant la cour',sujets),true);
 assert.equal(estCouvertParRedaction('Justice : un autre procès devant les assises',sujets),false);
 assert.equal(estCouvertParRedaction('Procès du policier dans une autre affaire',sujets),false);
});

test('les alertes Gmail conservées pour la veille utilisent les liens directs, sans données de boîte mail',()=>{
 const rows=normaliserVeille([
  {...item,titre:'À Roubaix, quatre accusés devant les assises pour tentative de meurtre',source:'La Voix du Nord',lien:'https://www.lavoixdunord.fr/1756458/article/2026-11-19/quatre-accuses-devant-la-cour-d-assises',dateAlerte:'2026-11-20',email_id:'1a1f86e9b51a5992'},
  {...item,titre:'Un autre article judiciaire à Roubaix',source:'La Voix du Nord',lien:'https://www.lavoixdunord.fr/1756458/article/2026-11-19/quatre-accuses-devant-la-cour-d-assises?utm_source=googlealerts',dateAlerte:'2026-11-20'}
 ]);
 assert.equal(rows.length,1);
 assert.equal(rows[0].dateAlerte,'2026-11-20');
 assert.equal(rows[0].lien,'https://www.lavoixdunord.fr/1756458/article/2026-11-19/quatre-accuses-devant-la-cour-d-assises');
 assert.equal('email_id' in rows[0],false);
});
