// Les mots-clés sont établis par la rédaction, dans les métadonnées de
// l'article original. Pas de rapprochement automatique par simple vocabulaire.
const normaliser = s => String(s ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('fr').replace(/[’‘]/g, "'")
  .replace(/[^a-z0-9]+/g, ' ').trim();

const referencesParArticle = {
  '/camille-paul-basse-terre-enregistrement-verdict/11/2026/': [
    '/meurtre-d-une-strasbourgeoise-en-2024-30-ans-de-reclusion',
    '/Pascal-Velayoudom-reconnu-coupable-du-viol-et-du-meurtre-de-Camille-Paul',
  ],
  '/duchere-lyon-proces-absence-ben-addi/11/2026/': [
    '65053768.html', '/article/154937/',
    'CBMixgFBVV95cUxPZHhBVFhTblNNWFlDYWw3QlFpdTAxeFVjMTg4Mm55',
    'CBMiygJBVV95cUxOQTJhckc0NjhaYldWWF8ycm5fMzdidWdPU0g3TFFM',
    'CBMiyAFBVV95cUxNbVJ0bWJLU0U2RFZUcFZYWXNqSFhwWTlBVkZGZm9q',
  ],
  '/jean-paul-benjamin-bobigny-images-legitime-defense/11/2026/': [
    'W4ZBVATMNNB5ROGARNH62RUAAU',
    '65UFEFWRAJBM3FZOS23TFSTTPU',
    'E2T22M2CDVFENHCL3WTSCAROVA',
    'afa1165b1b31a30482433d932af75f3b',
  ],
  '/evry-meurtre-sabine-appel-au-17/11/2026/': ['8745284e-e4e9-11f1-b9ed-164c427aef07'],
  '/nahel-merzouk-versailles-intention-du-tir/11/2026/': [
    'justice-se-prononcera-mardi-10766331',
    '225080659812914/mort-de-nahel',
    'renvoi-du-policier-pour-meurtre-13665529.php',
  ],
};

export function presseSansRedite(references, articlesEnUne) {
  const sujets = [...new Set(articlesEnUne.flatMap(article =>
    Array.isArray(article?.data?.sujetsPresse) ? article.data.sujetsPresse : []
  ).map(normaliser).filter(s => s.length >= 5))];
  const identifiants = articlesEnUne.flatMap(article => referencesParArticle[article?.data?.chemin] ?? []);
  if (!sujets.length && !identifiants.length) return references;
  return references.filter(reference => {
    if (identifiants.some(id => String(reference.lien ?? '').includes(id))) return false;
    const titre = ' ' + normaliser(reference.titre) + ' ';
    return !sujets.some(sujet => titre.includes(' ' + sujet + ' '));
  });
}
