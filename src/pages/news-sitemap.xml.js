import { articlesADiffuser, xml } from '../lib/diffusion.mjs';

const DEUX_JOURS = 48 * 60 * 60 * 1000;

export async function GET({ site }) {
  const limite = Date.now() - DEUX_JOURS;
  const articles = (await articlesADiffuser())
    .filter(article => article.date.getTime() >= limite)
    .slice(0, 1000);
  const urls = articles.map(article => `<url>
    <loc>${xml(new URL(article.chemin, site).href)}</loc>
    <news:news>
      <news:publication><news:name>Intime Conviction</news:name><news:language>fr</news:language></news:publication>
      <news:publication_date>${article.date.toISOString()}</news:publication_date>
      <news:title>${xml(article.titre)}</news:title>
    </news:news>
  </url>`);

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${urls.join('\n')}
</urlset>
`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
