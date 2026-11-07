import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lireFil } from '../src/lib/fil-actualites.mjs';

test('un relevé identifié est lu sans altérer son titre ni sa date', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ic-releve-'));
  try {
    const chemin = join(dir, 'actualites.json');
    await writeFile(chemin, JSON.stringify({
      releveLe: '2026-11-07T10:00:00.000Z',
      articles: [{
        titre: 'Ouverture du procès devant la cour d’assises', source: 'Journal Exemple',
        date: '2026-11-07T09:00:00.000Z',
        lien: 'https://news.google.com/rss/articles/exemple'
      }]
    }), 'utf8');
    const r = await lireFil(chemin);
    assert.equal(r.releveLe, '2026-11-07T10:00:00.000Z');
    assert.equal(r.articles[0].titre, 'Ouverture du procès devant la cour d’assises');
    assert.equal(r.articles[0].rubrique, 'cours-du-jour');
  } finally { await rm(dir, { recursive:true, force:true }); }
});

test('un relevé invalide ou un lien dangereux ne sont jamais publiés', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ic-releve-'));
  try {
    const chemin = join(dir, 'actualites.json');
    await writeFile(chemin, JSON.stringify({
      releveLe: '2026-11-07T10:00:00.000Z',
      articles: [{
        titre:'Lien dangereux', source:'Journal Exemple',
        date:'2026-11-07T09:00:00.000Z', lien:'javascript:alert(1)'
      }]
    }), 'utf8');
    assert.equal(await lireFil(chemin), null);
    await writeFile(chemin, '{}', 'utf8');
    assert.equal(await lireFil(chemin), null);
  } finally { await rm(dir, { recursive:true, force:true }); }
});
