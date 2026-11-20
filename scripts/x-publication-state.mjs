import { createHash } from 'node:crypto';

export const articleKey = url => createHash('sha256').update(url).digest('hex');
export function contentFingerprint(article) {
  const text = String(article.html || '').split(/<h2\b[^>]*>\s*Sources\s*<\/h2>/i)[0]
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return articleKey(JSON.stringify([article.title, article.excerpt, text]));
}

export function publicationCandidates(articles, state, now = Date.now()) {
  // Activation explicite : ne pas rediffuser les anciennes mises à jour.
  state.updatesSince ??= '2026-11-20T00:00:00+01:00';
  const candidates = [];
  for (const article of articles) {
    const previous = state.seen[articleKey(article.url)];
    if (!previous) {
      if (article.time >= now - 14 * 86400000) candidates.push({ ...article, isUpdate: false });
      continue;
    }
    const updated = article.updatedTime;
    const afterLastPost = updated > Date.parse(previous.updatedAt || previous.queuedAt || state.initializedAt);
    if (Number.isFinite(updated) && updated <= now && updated >= article.time &&
        updated >= Date.parse(state.updatesSince) && afterLastPost &&
        previous.fingerprint !== article.fingerprint) {
      candidates.push({ ...article, isUpdate: true });
    } else if (!previous.fingerprint && (!Number.isFinite(updated) || updated < Date.parse(state.updatesSince) || !afterLastPost)) {
      // Mémoriser l'existant sans le republier. Une erreur d'envoi reste réessayable.
      previous.fingerprint = article.fingerprint;
    }
  }
  return candidates.sort((a, b) => (a.isUpdate ? a.updatedTime : a.time) - (b.isUpdate ? b.updatedTime : b.time) || a.url.localeCompare(b.url));
}

export function markQueued(state, article, id, now = Date.now()) {
  state.seen[articleKey(article.url)] = {
    bufferPostId: id, queuedAt: new Date(now).toISOString(), fingerprint: article.fingerprint,
    ...(Number.isFinite(article.updatedTime) ? { updatedAt: new Date(article.updatedTime).toISOString() } : {}),
  };
}
