// Le plan du site, écrit à la main plutôt que par un module de plus : il tient
// en trente lignes et liste exactement les pages que le site fabrique.
// Les redirections des anciennes catégories n'y figurent pas — on n'annonce
// pas à Google une adresse qui renvoie ailleurs.
import { RUBRIQUES } from '../lib/rubriques.mjs';
import { tousLesArticles } from '../lib/articles.mjs';

const PAR_PAGE = 30; // même pagination que les pages de rubrique

export async function GET({ site }) {
  const articles = await tousLesArticles();
  const adresses = [{ chemin: '/' }, { chemin: '/archives/' }, { chemin: '/ligne-editoriale/' }];

  for (const r of RUBRIQUES) {
    const n = articles.filter((a) => a.data.rubrique === r.slug).length;
    for (let p = 1; p <= Math.ceil(n / PAR_PAGE); p++) {
      adresses.push({ chemin: p === 1 ? `/rubrique/${r.slug}/` : `/rubrique/${r.slug}/${p}/` });
    }
  }
  for (const an of new Set(articles.map((a) => a.data.date.getFullYear()))) {
    adresses.push({ chemin: `/archives/${an}/` });
  }
  for (const a of articles) {
    adresses.push({ chemin: a.data.chemin, date: a.data.date.toISOString().slice(0, 10) });
  }

  const corps = adresses
    .map(({ chemin, date }) => `<url><loc>${new URL(chemin, site)}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`)
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${corps}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
