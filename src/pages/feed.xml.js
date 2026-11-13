import { articlesADiffuser, xml } from '../lib/diffusion.mjs';
import { rubrique } from '../lib/rubriques.mjs';

export async function GET({ site }) {
  const articles = (await articlesADiffuser()).slice(0, 30);
  const items = articles.map(article => {
    const url = xml(new URL(article.chemin, site).href);
    return `<item>
      <title>${xml(article.titre)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xml(article.extrait)}</description>
      <pubDate>${article.date.toUTCString()}</pubDate>
      <category>${xml(rubrique(article.rubrique).libelle)}</category>
    </item>`;
  });

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Intime Conviction</title>
    <link>${xml(site.href)}</link>
    <description>Les derniers articles du journal des cours d’assises.</description>
    <language>fr-FR</language>
    <atom:link href="${xml(new URL('/feed.xml', site).href)}" rel="self" type="application/rss+xml" />
    ${items.join('\n')}
  </channel>
</rss>
`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
