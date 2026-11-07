// Provenances vérifiées individuellement. Ne pas déduire une attribution à partir
// d'une mention d'agence ou d'une signature WordPress générique.
// Toute entrée doit être étayée par une publication primaire identifiable.
const PROVENANCES = new Map([
  ['/12-hommes-en-colere-theatre-hebertot-jusquau-7-janvier-2018/11/2017/', {
    media:'Dalloz Actualité',
    auteur:'Thibault de Ravel d’Esclapon',
    publieLe:'2017-11-03',
    url:'https://www.dalloz-actualite.fr/flash/12-hommes-en-colere-theatre-hebertot-jusqu-au-7-janvier-2018',
  }],
]);

export function provenanceVerifiee(chemin) {
  return PROVENANCES.get(chemin) ?? null;
}
