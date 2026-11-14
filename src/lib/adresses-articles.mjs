// Les liens et le sitemap gardent le chemin WordPress. Astro attend le slug
// décodé pour écrire le dossier que GitHub Pages cherchera sur le disque.
export function routesArticles(articles) {
  const routes = new Map();
  const redirections = new Map();

  for (const article of articles) {
    const { chemin } = article.data;
    const [, slugEncode, mois, annee] = chemin.split('/');
    const slug = decodeURIComponent(slugEncode);
    if (!slug || /[/%\\?#]/u.test(slug) || slug === '.' || slug === '..') {
      throw new Error(`Slug d’article incompatible avec la publication : ${chemin}`);
    }

    const cheminGenere = `/${slug.normalize()}/${mois}/${annee}/`;
    if (routes.has(cheminGenere)) {
      throw new Error(`Collision d’adresses d’articles : ${routes.get(cheminGenere).article.data.chemin} et ${chemin}`);
    }
    routes.set(cheminGenere, { params: { slug, mois, annee }, article });

    // Les anciens dossiers au slug littéral ont été accessibles en encodant
    // les signes % une seconde fois. Garder ces entrées comme redirections.
    if (slugEncode !== slug && slugEncode.includes('%')) {
      redirections.set(chemin, { params: { slug: slugEncode, mois, annee }, redirection: chemin });
    }
  }

  return [...routes.values(), ...redirections.values()];
}
