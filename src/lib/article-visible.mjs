// Même règle pour les pages, index et sélections éditoriales.
// Une date future n'autorise pas la publication, même sous URL directe.
export function datePublicationAtteinte(data, maintenant = Date.now()) {
  const date = data?.date;
  return date instanceof Date
    && Number.isFinite(date.getTime())
    && date.getTime() <= maintenant;
}

// Ne retire PAS les archives historiques en cours de vérification : elles
// conservent leur URL historique et leur traitement noindex existant.
// En revanche aucun article programmé n'entre dans les pages construites.
export function articlesNonProgrammes(articles, maintenant = Date.now()) {
  return articles.filter(({ data }) => datePublicationAtteinte(data, maintenant));
}

// Les sélections éditoriales excluent aussi les textes à vérifier.
export function articleVisible(data, maintenant = Date.now()) {
  return data?.verificationEnCours !== true
    && datePublicationAtteinte(data, maintenant);
}
