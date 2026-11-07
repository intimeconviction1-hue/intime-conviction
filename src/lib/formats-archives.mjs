// Qualification éditoriale documentée, sans modification des archives privées.
// Ne pas inférer le format d'un article à partir de sa longueur ou de son titre.
const FORMATS = new Map([
  ['/13329-2/02/2017/', {
    nom:'Sélection de presse',
    explication:'Cette archive rassemble des liens vers des articles publiés par plusieurs médias. Les titres et les informations correspondantes restent attribués à leurs sources.'
  }],
  ['/13366-2/02/2017/', {
    nom:'Sélection de presse',
    explication:'Cette archive rassemble des liens vers des articles publiés par plusieurs médias. Les titres et les informations correspondantes restent attribués à leurs sources.'
  }],
  ['/cours-du-jour-6-janvier-2025/01/2025/', {
    nom:'Revue de presse',
    explication:'Cette archive réunit plusieurs affaires judiciaires et des références à des médias extérieurs. Elle conserve sa date de publication historique ; les suites mentionnées dans le texte ne constituent pas un suivi actualisé en continu.'
  }],
  ['/cours-du-jour-17-janvier-2025/01/2025/', {
    nom:'Revue de presse',
    explication:'Cette archive réunit plusieurs brèves relatives à des affaires judiciaires distinctes. Les informations rapportées sont celles de la sélection historique et ne constituent pas une mise à jour des procédures.'
  }]
]);

export function formatArchiveVerifie(chemin) {
  return FORMATS.get(chemin) ?? null;
}
