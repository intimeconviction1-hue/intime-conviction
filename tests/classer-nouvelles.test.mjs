import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { classerNouvelle } from '../src/lib/classer-nouvelles.mjs';
import { lireFil } from '../src/lib/fil-actualites.mjs';
import { RUBRIQUES } from '../src/lib/rubriques.mjs';

const cas = [
  ['Un homme condamné aux assises','cours-du-jour'],
  ['Les conseils pratiques sur le rôle délicat des jurés au procès','le-banc-des-jures'],
  ['Les coulisses d’une sélection des jurés à Blois','le-banc-des-jures'],
  ['Comment assister un procès aux assises ?','le-banc-des-jures'],
  ['Chronique d’audience : les silences du prétoire','la-cour-se-leve'],
  ['Tribune : pourquoi réformer les cours d’assises','delibere'],
  ['Décryptage : les chiffres de la justice criminelle','l-expose'],
  ['Cinéma : un film sur les assises','le-greffe'],
  ['Un nouveau roman sur la justice','le-greffe'],
  ['Un juré condamné pour violences','cours-du-jour'],
  ['Un réalisateur jugé aux assises','cours-du-jour'],
  ['Roman Dupont jugé pour meurtre','cours-du-jour'],
  ['L’accusé dénonce un acharnement au procès','cours-du-jour'],
  ['Un coup de théâtre au procès du cambrioleur','cours-du-jour'],
];
for (const [titre,attendu] of cas) {
  test(`classement : ${titre}`,()=>{
    const slug=classerNouvelle(titre);
    assert.equal(slug,attendu);
    assert.ok(RUBRIQUES.some(r=>r.slug===slug));
  });
}

test('reclasse aussi un cache antérieur, même si sa rubrique est absente ou périmée', async()=>{
  const dir=await mkdtemp(join(tmpdir(),'ic-classement-'));
  try {
    const chemin=join(dir,'fil.json');
    const a={titre:'La sélection des jurés expliquée',source:'Journal Exemple',date:'2026-11-01T10:00:00Z',lien:'https://news.google.com/rss/articles/exemple',rubrique:'cours-du-jour'};
    await writeFile(chemin,JSON.stringify({releveLe:'2026-11-01T12:00:00Z',articles:[a]}));
    const f=await lireFil(chemin);
    assert.equal(f.articles[0].rubrique,'le-banc-des-jures');
    assert.equal(f.releveLe,'2026-11-01T12:00:00Z');
    assert.equal(JSON.parse(await readFile(chemin,'utf8')).articles[0].rubrique,'cours-du-jour');
  } finally { await rm(dir,{recursive:true,force:true}); }
});
