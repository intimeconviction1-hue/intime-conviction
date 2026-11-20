// Tri exclusivement fondé sur les informations présentes dans le titre source.
// Ne pas conclure à un verdict, une condamnation ou une décision si le titre
// ne dit qu'ils sont attendus, annoncés ou débattus.
const normaliser = texte => String(texte ?? '')
  .toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[’‘]/g, "'");

const INFORMATION_JUDICIAIRE = /\b(?:verdict|condamn(?:e|ee|ation|ations)|acquitt(?:e|ee|ement)|relax(?:e|ee|e)|peine(?:s)?|cour d'assises|cour criminelle|proces|audience|requisitions?|delibere|appel|cassation|pourvoi)\b/u;
const TITRE_ABREGE = /(?:\.\.\.|…)(?:\s*[—–-]\s*[^—–]+)?\s*$/u;

// Une décision effective passe devant une annonce et un compte rendu d'audience,
// mais uniquement à date égale et si le titre est complet.
function rangJudiciaire(titre) {
  const t = normaliser(titre);
  const annonce = /\b(?:attendu|attendue|attendus|attendues|annonce|annoncee|prevu|prevue|pourrait|devrait|requisitions?|peine requise|reclame|demande|risque)\b/u.test(t);
  if (!annonce && /\b(?:condamne|condamnee|condamnes|condamnees|acquitte|acquittee|acquittes|acquittees|relaxe|relaxee|casse|annule|annulee|verdict rendu|decision rendue)\b/u.test(t))
    return 3;
  if (/\b(?:ouverture du proces|debut du proces|proces s'ouvre|renvoye aux assises|renvoyee aux assises|requisitions?|delibere|audience)\b/u.test(t))
    return 2;
  return INFORMATION_JUDICIAIRE.test(t) ? 1 : 0;
}

/**
 * Préserver le jour de collecte en priorité, sans présenter cette date
 * comme la date réelle des faits ou de l'audience. À jour égal, les titres
 * complets priment, puis les décisions effectivement décrites, puis les
 * développements d'audience, puis les références générales.
 */
export function hierarchiserPresse(references = []) {
  return references.map((reference, index) => ({
    reference, index,
    jour: typeof reference.date === 'string' ? reference.date.slice(0, 10) : '',
    rang: rangJudiciaire(reference.titre),
    complet: !TITRE_ABREGE.test(String(reference.titre ?? '')),
  })).sort((a,b) => {
    const jour = b.jour.localeCompare(a.jour);
    if (jour) return jour;
    if (a.complet !== b.complet) return Number(b.complet)-Number(a.complet);
    if (a.rang !== b.rang) return b.rang-a.rang;
    return a.index-b.index;
  }).map(x=>x.reference);
}
