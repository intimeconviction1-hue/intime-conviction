import test from 'node:test';
import assert from 'node:assert/strict';
import { composeXPost } from './x-copy.mjs';

test('Accroche journalistique, lien mesurable et aucune invention', () => {
  const article = {
    title:'À Caro, les coups entendus au téléphone face à la version d’un geste de défense',
    excerpt:'À Vannes, Arsène Marchand reconnaît des violences contre son voisin, mort en septembre 2021, mais conteste avoir voulu le tuer. Témoignages et traces matérielles interrogent son récit d’une défense.',
    url:'https://www.intimeconviction.fr/caro-coups-au-telephone-version-defense/11/2026/'
  };
  const texte=composeXPost(article);
  assert.match(texte,/À Caro,/);
  assert.match(texte,/À Vannes,/);
  assert.match(texte,/utm_source=x/);
  assert.match(texte,/utm_medium=social/);
  assert.match(texte,/utm_campaign=articles_redaction/);
  assert.ok(!texte.includes('incroyable'));
  assert.ok(texte.replace(/https?:\/\/[^\s]+/g,'x'.repeat(23)).length<=280);
});

test('Ne répète pas exactement le titre en guise de contexte',()=>{
  const texte=composeXPost({title:'Un article',excerpt:'Un article',url:'https://www.intimeconviction.fr/test/11/2026/'});
  assert.equal(texte.split('\n\n').length,2);
});

test('Résiste aux titres longs et rejette les URL externes',()=>{
  const texte=composeXPost({title:'Titre '.repeat(70),excerpt:'Résumé '.repeat(50),url:'https://www.intimeconviction.fr/test/11/2026/'});
  assert.ok(texte.replace(/https?:\/\/[^\s]+/g,'x'.repeat(23)).length<=280);
  assert.throws(()=>composeXPost({title:'Faux',url:'https://example.com/article'}),/hors du domaine/);
});

test('Identifie une mise à jour sans inventer ni dépasser le format X', () => {
  const texte = composeXPost({ title: 'Titre '.repeat(70), excerpt: 'Contexte '.repeat(50), url: 'https://www.intimeconviction.fr/test/11/2026/', isUpdate: true });
  assert.match(texte, /^Mise à jour · /);
  assert.ok(texte.replace(/https?:\/\/[^\s]+/g, 'x'.repeat(23)).length <= 280);
});
