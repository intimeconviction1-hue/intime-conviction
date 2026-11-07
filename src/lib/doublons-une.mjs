// Les mots-clés sont établis par la rédaction, dans les métadonnées de
// l'article original. Pas de rapprochement automatique par simple vocabulaire.
const normaliser = s => String(s ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('fr').replace(/[’‘]/g, "'")
  .replace(/[^a-z0-9]+/g, ' ').trim();

export function presseSansRedite(references, articlesEnUne) {
  const sujets = [...new Set(articlesEnUne.flatMap(article =>
    Array.isArray(article?.data?.sujetsPresse) ? article.data.sujetsPresse : []
  ).map(normaliser).filter(s => s.length >= 5))];
  if (!sujets.length) return references;
  return references.filter(reference => {
    const titre = ' ' + normaliser(reference.titre) + ' ';
    return !sujets.some(sujet => titre.includes(' ' + sujet + ' '));
  });
}
