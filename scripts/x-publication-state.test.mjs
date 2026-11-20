import test from 'node:test';
import assert from 'node:assert/strict';
import { articleKey, contentFingerprint, publicationCandidates, markQueued } from './x-publication-state.mjs';
const now = Date.parse('2026-11-20T10:00:00Z');
const article = (changes = {}) => {
  const a = { url: 'https://www.intimeconviction.fr/caro/11/2026/', title: 'Caro : le verdict', excerpt: 'Douze ans, décision susceptible d’appel.', time: Date.parse('2026-11-19T17:00:00Z'), updatedTime: Date.parse('2026-11-20T08:00:00Z'), html: '<p>Le verdict vérifié.</p>', ...changes };
  a.fingerprint = contentFingerprint(a); return a;
};
const oldState = a => ({ version: 2, initializedAt: '2026-11-18T23:00:00Z', seen: { [articleKey(a.url)]: { bufferPostId: 'old', queuedAt: '2026-11-19T17:01:00Z' } } });

test('Rattrape Caro sans republier deux fois la même mise à jour', () => {
  const a = article(), state = oldState(a);
  const pending = publicationCandidates([a], state, now);
  assert.equal(pending.length, 1); assert.equal(pending[0].isUpdate, true);
  markQueued(state, pending[0], 'buffer-confirmed', now);
  assert.equal(publicationCandidates([a], state, now + 1000).length, 0);
  assert.equal(state.seen[articleKey(a.url)].bufferPostId, 'buffer-confirmed');
});

test('Un échec ne fait pas perdre la mise à jour en attente', () => {
  const a = article(), state = oldState(a);
  publicationCandidates([a], state, now);
  const restored = JSON.parse(JSON.stringify(state));
  assert.equal(publicationCandidates([a], restored, now).length, 1);
  assert.equal(restored.seen[articleKey(a.url)].bufferPostId, 'old');
});

test('Ignore une date seule ou les changements de sources et accepte un nouvel apport daté', () => {
  const a = article(), state = oldState(a);
  markQueued(state, a, 'confirmed', now);
  const timestampOnly = article({ updatedTime: now + 2000 });
  assert.equal(publicationCandidates([timestampOnly], state, now + 3000).length, 0);
  const sourcesOnly = article({ updatedTime: now + 2000, html: '<p>Le verdict vérifié.</p><h2>Sources</h2><ul><li>Nouveau lien</li></ul>' });
  assert.equal(publicationCandidates([sourcesOnly], state, now + 3000).length, 0);
  const substantive = article({ updatedTime: now + 2000, html: '<p>Un appel est désormais confirmé.</p>' });
  assert.equal(publicationCandidates([substantive], state, now + 3000)[0].isUpdate, true);
});

test('Ne rattrape pas les anciennes mises à jour ni les dates futures', () => {
  const old = article({ updatedTime: Date.parse('2026-11-19T19:00:00Z') });
  assert.equal(publicationCandidates([old], oldState(old), now).length, 0);
  const future = article({ updatedTime: now + 1000 });
  assert.equal(publicationCandidates([future], oldState(future), now).length, 0);
});

test('Conserve la diffusion des nouveaux articles et le silence pour les archives', () => {
  const a = article(), state = { version: 2, initializedAt: new Date(now).toISOString(), seen: {} };
  assert.equal(publicationCandidates([a], state, now)[0].isUpdate, false);
  assert.equal(publicationCandidates([article({ time: now - 15 * 86400000 })], state, now).length, 0);
});

test('Chaîne complète : attendre la version publique, conserver un échec, puis envoyer une seule fois', async () => {
  const { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { spawnSync } = await import('node:child_process');
  const dir = mkdtempSync(join(tmpdir(), 'ic-x-update-'));
  try {
    const root = join(dir, 'articles'); mkdirSync(root);
    const statePath = join(dir, 'state.json'), callsPath = join(dir, 'calls.jsonl');
    const update = new Date(Date.now() - 60000).toISOString();
    const publication = new Date(Date.now() - 86400000).toISOString();
    const url = 'https://www.intimeconviction.fr/caro/11/2026/';
    writeFileSync(join(root, 'caro.json'), JSON.stringify({ auteur: 'Rédaction d’Intime Conviction', titre: 'Caro : douze ans de réclusion', extrait: 'Une décision susceptible d’appel.', chemin: '/caro/11/2026/', date: publication, dateMiseAJour: update, html: '<p>Le verdict vérifié.</p>' }));
    writeFileSync(statePath, JSON.stringify({ version: 2, initializedAt: publication, seen: { [articleKey(url)]: { bufferPostId: 'previous', queuedAt: publication } } }));
    const mockPath = join(dir, 'mock.mjs');
    writeFileSync(mockPath, `import fs from 'node:fs';
      globalThis.fetch = async (url, options) => {
        if (String(url) === 'https://api.buffer.com') {
          fs.appendFileSync(process.env.CALLS, options.body + '\\n');
          return process.env.MODE === 'failure'
            ? new Response('Unavailable', { status: 503 })
            : Response.json({ data: { createPost: { post: { id: 'confirmed-update' } } } });
        }
        const date = process.env.MODE === 'stale' ? '2020-01-01T00:00:00Z' : process.env.UPDATE;
        return new Response('<html><meta property="article:modified_time" content="' + date + '"></html>');
      };`);
    const run = mode => spawnSync(process.execPath, ['--import', mockPath, new URL('./diffuser-x.mjs', import.meta.url).pathname], { encoding: 'utf8', env: { ...process.env, IC_ARTICLES: root, X_PUBLICATION_STATE: statePath, BUFFER_API_KEY: 'test-only', BUFFER_CHANNEL_ID: 'test-only', UPDATE: update, CALLS: callsPath, MODE: mode } });
    assert.equal(run('stale').status, 0);
    assert.equal(JSON.parse(readFileSync(statePath)).seen[articleKey(url)].bufferPostId, 'previous');
    assert.equal(run('failure').status, 1);
    assert.equal(JSON.parse(readFileSync(statePath)).seen[articleKey(url)].bufferPostId, 'previous');
    assert.equal(run('success').status, 0);
    const saved = JSON.parse(readFileSync(statePath)).seen[articleKey(url)];
    assert.equal(saved.bufferPostId, 'confirmed-update');
    assert.equal(saved.updatedAt, update);
    assert.equal(run('success').status, 0);
    const calls = readFileSync(callsPath, 'utf8').trim().split('\n').map(JSON.parse);
    assert.equal(calls.length, 2); // Un échec, un succès, aucune republication.
    assert.match(calls[1].variables.input.text, /^Mise à jour · Caro/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
