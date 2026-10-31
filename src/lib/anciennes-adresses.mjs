// Les adresses de catégorie de l'ancien WordPress (/category/…/), et la page
// où elles mènent désormais. Google les connaît : sans redirection, chacune
// serait une page 404 à la place d'une rubrique.
//
// Relevé dans l'export du 29/07/2026 : 28 catégories, dont 23 portées par des
// articles. La rubrique d'arrivée vient de `ANCIENNES_CATEGORIES` (la
// correspondance validée), par le NOM — jamais recopiée ici.

import { ANCIENNES_CATEGORIES } from './rubriques.mjs';

// [identifiant WordPress, catégorie parente, nom affiché]
const CATEGORIES_WORDPRESS = [
  ['cours-de-france', '', 'Cours de France'],
  ['justice-repressive', '', 'Cours du Jour'],
  ['la-cour-expliquee', '', 'La Cour expliquée'],
  ['non-classe', '', 'Non classé'],
  ['regards', '', 'Regards'],
  ['rouages-de-la-cour', 'la-cour-expliquee', 'Les Rouages de la Cour'],
  ['messieurs-les-jures', 'la-cour-expliquee', 'Messieurs Les Jurés'],
  ['presomption-dinnocence-decryptages', 'la-cour-expliquee', 'Présomption d’innocence'],
  ['procedure', 'la-cour-expliquee', 'Procédure'],
  ['acteurs-de-la-cour', 'la-cour-expliquee', 'Acteurs'],
  ['meurtres-assises-du-jour', 'justice-repressive', 'Meurtres'],
  ['proces-attendus-assises-du-jour', 'justice-repressive', 'Procès attendus'],
  ['terrorisme', 'justice-repressive', 'Terrorisme'],
  ['viols', 'justice-repressive', 'viols'],
  ['assises-du-jour', 'justice-repressive', 'Assises du jour'],
  ['assises-speciales', 'justice-repressive', 'Assises spéciales'],
  ['braquages-assises-du-jour', 'justice-repressive', 'Braquages'],
  ['assises-tour-de-france', 'cours-de-france', 'Tour de France'],
  ['104-cours-dassises', 'cours-de-france', "104 Cours d'assises"],
  ['scenes-de-cour', 'regards', 'Scènes de Cour'],
  ['videos-judiciaires', 'regards', 'VIDEOS JUDICIAIRES'],
  ['chronique', 'regards', 'Chronique'],
  ['cours-dhistoire', 'regards', "Cours d'Histoire"],
  ['regards-culturels-historiques-et-sociaux-sur-le-crime-et-la-justice-analyses-recits-references-et-mises-en-perspective-pour-comprendre-comment-la-cour-dassises-traverse-la-societe-les-me', 'regards', 'Cours de culture'],
  ['justice-etrangere', 'regards', 'Crimes étrangers'],
  ['focus-mediatique', 'regards', 'Focus médiatique'],
  ['prison', 'regards', 'Prison'],
  ['reflexions-opinions', 'regards', 'Réflexions & Opinions'],
];

// Les cinq catégories sans article n'entrent pas dans la correspondance
// validée : leur destination est posée ici, par leur contenu.
const SANS_ARTICLE = {
  'Cours de France': 'cours-du-jour',
  'La Cour expliquée': 'le-banc-des-jures', // ses enfants vont presque tous au Banc des Jurés
  'Regards': null, // mélange culture, chroniques et opinions : l'accueil
  'Scènes de Cour': 'la-cour-se-leve',
  'Réflexions & Opinions': 'delibere',
};

function destination(nom) {
  const rubrique = ANCIENNES_CATEGORIES[nom] ?? SANS_ARTICLE[nom];
  return rubrique ? `/rubrique/${rubrique}/` : '/';
}

// WordPress servait les deux formes : /category/enfant/ et
// /category/parent/enfant/. Les deux circulent, les deux sont redirigées.
export function redirectionsDesCategories() {
  const redirections = {};
  for (const [id, parent, nom] of CATEGORIES_WORDPRESS) {
    if (!(nom in ANCIENNES_CATEGORIES) && !(nom in SANS_ARTICLE)) {
      throw new Error(`Catégorie sans destination : ${nom}`);
    }
    redirections[`/category/${id}/`] = destination(nom);
    if (parent) redirections[`/category/${parent}/${id}/`] = destination(nom);
  }
  return redirections;
}
