// Hiérarchisation limitée aux informations explicitement présentes dans les titres.
// Ce classement n'atteste ni les faits ni la phase procédurale : seul l'article source
// permet de les vérifier. Ne jamais générer de chapeau factuel à partir de ces indices.
const normaliser = texte => String(texte ?? '')
  .toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[’‘]/g, "'");

const INFORMATION_JUDICIAIRE = /\b(?:verdict|condamn(?:e|ee|ation|ations)|acquitt(?:e|ee|ement)|relax(?:e|ee|e)|peine(?:s)?|cour d'assises|cour criminelle|proces|audience|requisitions?|delibere|appel|cassation|pourvoi)\b/u;
const TITRE_ABREGE = /(?:\.\.\.|…)(?:\s*[—–-]\s*[^—–]+)?\s*$/u;

/**
 * Préserve la chronologie quotidienne : tri editorial seulement entre titres
 * publiés sur une même journée civile (date du relevé, pas date d'audience).
 * Les titres elliptiques reculent derrière les titres informatifs.
 */
export function hierarchiserPresse(references = []) {
  return references.map((reference, index) => ({
    reference, index,
    jour: typeof reference.date === 'string' ? reference.date.slice(0, 10) : '',
    explicite: INFORMATION_JUDICIAIRE.test(normaliser(reference.titre)),
    complet: !TITRE_ABREGE.test(String(reference.titre ?? '')),
  })).sort((a,b) => {
    const jour = b.jour.localeCompare(a.jour);
    if (jour) return jour;
    if (a.complet !== b.complet) return Number(b.complet)-Number(a.complet);
    if (a.explicite !== b.explicite) return Number(b.explicite)-Number(a.explicite);
    return a.index-b.index;
  }).map(x=>x.reference);
}
