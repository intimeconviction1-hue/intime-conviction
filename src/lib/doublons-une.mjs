// Les mots-clés sont établis par la rédaction, dans les métadonnées de
// l'article original. Pas de rapprochement automatique par simple vocabulaire.
const normaliser = s => String(s ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('fr').replace(/[’‘]/g, "'")
  .replace(/[^a-z0-9]+/g, ' ').trim();

const referencesParArticle = {
  '/evry-meurtre-sabine-appel-au-17/11/2026/': '8745284e-e4e9-11f1-b9ed-164c427aef07',
};

export function presseSansRedite(references, articlesEnUne) {
  const sujets = [...new Set(articlesEnUne.flatMap(article =>
    Array.isArray(article?.data?.sujetsPresse) ? article.data.sujetsPresse : []
  ).map(normaliser).filter(s => s.length >= 5))];
  const identifiants = articlesEnUne.map(article => referencesParArticle[article?.data?.chemin]).filter(Boolean);
  if (!sujets.length && !identifiants.length) return references;
  return references.filter(reference => {
    if (identifiants.some(id => String(reference.lien ?? '').includes(id))) return false;
    const titre = ' ' + normaliser(reference.titre) + ' ';
    return !sujets.some(sujet => titre.includes(' ' + sujet + ' '));
  });
}
