// Publication des nouveaux articles de la rédaction via Buffer → X.
// Aucune clé API n'est stockée dans le dépôt. Les archives sont initialisées
// sans publication au premier lancement. Voir .github/workflows/diffuser-x.yml.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { composeXPost } from './x-copy.mjs';

const root = process.env.IC_ARTICLES || 'articles-prives/articles';
const statePath = process.env.X_PUBLICATION_STATE || '.x-publications.json';
const channelId = process.env.BUFFER_CHANNEL_ID;
const apiKey = process.env.BUFFER_API_KEY;
const dryRun = process.env.X_DRY_RUN === 'true';
const maxPerRun = Number(process.env.X_MAX_PER_RUN || 5);
const site = 'https://www.intimeconviction.fr';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const articleKey = url => createHash('sha256').update(url).digest('hex');

function collect(dir) {
  if (!fs.existsSync(dir)) throw new Error('Dossier des articles introuvable : ' + dir);
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) return collect(file);
    if (!item.isFile() || !item.name.endsWith('.json')) return [];
    try {
      const a = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (!/^Rédaction d.Intime Conviction/i.test(a.auteur || '')) return [];
      if (!a.titre || !a.date || !/^\/[^?#]+\/$/.test(a.chemin || '')) return [];
      const time = Date.parse(a.date);
      if (!Number.isFinite(time) || time > Date.now() + 300000) return [];
      return [{ url: new URL(a.chemin, site).href, title: a.titre.trim(), excerpt: (a.extrait || '').trim(), time }];
    } catch (error) {
      throw new Error('Article illisible ' + file + ' : ' + error.message);
    }
  });
}


async function pageIsPublic(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(18000), headers: { 'User-Agent': 'IntimeConviction-X-Publisher/1.0' } });
    if (!res.ok) return false;
    const html = await res.text();
    return /<html[\s>]/i.test(html) && !/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);
  } catch { return false; }
}

async function schedule(a, n) {
  const dueAt = new Date(Date.now() + (n + 1) * 8 * 60_000).toISOString();
  const query = `mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess { post { id text dueAt } }
      ... on MutationError { message }
    }
  }`;
  const response = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
    body: JSON.stringify({ query, variables: { input: {
      text: composeXPost(a), channelId, schedulingType: 'automatic',
      mode: 'customScheduled', dueAt,
    } } }),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('Buffer HTTP ' + response.status);
  const result = await response.json();
  if (result.errors?.length) throw new Error('Buffer GraphQL : ' + result.errors.map(e => e.message).join('; '));
  const outcome = result.data?.createPost;
  if (!outcome?.post?.id) throw new Error('Buffer : ' + (outcome?.message || 'création non confirmée'));
  return outcome.post.id;
}

async function main() {
  const articles = collect(root).sort((a, b) => a.time - b.time || a.url.localeCompare(b.url));
  if (!fs.existsSync(statePath)) {
    fs.writeFileSync(statePath, JSON.stringify({ version: 2, initializedAt: new Date().toISOString(),
      seen: Object.fromEntries(articles.map(a => [articleKey(a.url), { baseline: true }])) }, null, 2) + '\n');
    console.log('Initialisation : ' + articles.length + ' articles existants exclus de X.');
    return;
  }
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  if (state.version !== 2 || !state.seen || typeof state.seen !== 'object')
    throw new Error('État X invalide : arrêt par sécurité.');
  const candidates = articles.filter(a => !(articleKey(a.url) in state.seen) && a.time >= Date.now() - 14 * 86400000);
  if (candidates.length && !dryRun && (!apiKey || !channelId))
    throw new Error('BUFFER_API_KEY ou BUFFER_CHANNEL_ID manquant.');
  let count = 0;
  for (const a of candidates.slice(0, maxPerRun)) {
    if (!(await pageIsPublic(a.url))) {
      console.log('Page non accessible, report : ' + a.url);
      continue;
    }
    if (dryRun) { console.log('Simulation : ' + a.url); continue; }
    try {
      const id = await schedule(a, count);
      state.seen[articleKey(a.url)] = { bufferPostId: id, queuedAt: new Date().toISOString() };
      fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n');
      console.log('Programmé : ' + a.url + ' ; Buffer post ' + id);
      count++;
      await sleep(300);
    } catch (error) {
      console.error('Échec de publication de ' + a.url + ' : ' + error.message);
      process.exitCode = 1;
      // Ne pas marquer comme publié : la prochaine exécution réessaiera.
      break;
    }
  }
  console.log('Bilan : ' + count + ' publication(s) programmée(s), ' + candidates.length + ' nouvel(le)(s) article(s) détecté(s).');
}
await main();
