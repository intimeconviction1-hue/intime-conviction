// Les six rubriques d'Intime Conviction, et la correspondance depuis les
// 23 catégories de l'ancien WordPress.
//
// Les six NOMS sont une décision éditoriale prise (brief du 29/07/2026) : ils ne
// se renomment pas ici. La CORRESPONDANCE a été proposée le 31/10/2026 en
// lisant des titres au hasard dans chaque catégorie — aucun document du
// dossier ne la donnait — et VALIDÉE par la rédaction le même jour, y compris
// les trois lignes qui étaient incertaines. C'est elle qui décide où tombent
// les articles : la changer ici est une décision éditoriale, puis relancer
// `npm run import`.
//
// Ce module est importé par le script d'import ET par le site, pour qu'il n'y
// ait jamais deux listes des rubriques qui divergent.

export const CORRESPONDANCE_VALIDEE = true;

export const RUBRIQUES = [
  { slug: 'cours-du-jour', libelle: 'Actualité des procès', nom: 'Cours du Jour', sousTitre: "Suivi d'audience" },
  { slug: 'le-banc-des-jures', libelle: 'Comprendre le procès', nom: 'Le Banc des Jurés', sousTitre: 'Les règles du procès' },
  { slug: 'la-cour-se-leve', libelle: 'Chroniques d’audience', nom: 'La Cour se Lève', sousTitre: 'Chroniques & ambiances' },
  { slug: 'delibere', libelle: 'Opinions et débats', nom: 'Délibéré', sousTitre: 'Réflexions & opinions' },
  { slug: 'l-expose', libelle: 'Analyses et dossiers', nom: "L'Exposé", sousTitre: 'Analyses & décryptages' },
  { slug: 'le-greffe', libelle: 'Livres, films et histoire', nom: 'Le Greffe', sousTitre: 'Culture criminelle' },
];

// Ancienne catégorie → rubrique. Les trois lignes marquées « TRANCHÉ » pèsent à
// elles seules 1 814 articles : elles étaient incertaines et ont été validées
// telles quelles le 31/10/2026.
export const ANCIENNES_CATEGORIES = {
  'Cours du Jour': 'cours-du-jour',
  'Assises du jour': 'cours-du-jour',
  'Tour de France': 'cours-du-jour',
  'Meurtres': 'cours-du-jour',
  'viols': 'cours-du-jour',
  'Braquages': 'cours-du-jour',
  'Prison': 'cours-du-jour',
  'Terrorisme': 'cours-du-jour',
  'Assises spéciales': 'cours-du-jour',
  'Non classé': 'cours-du-jour',
  'Crimes étrangers': 'cours-du-jour', // TRANCHÉ — 972 articles, surtout des procès à l'étranger

  'Les Rouages de la Cour': 'le-banc-des-jures',
  'Procédure': 'le-banc-des-jures',
  'Messieurs Les Jurés': 'le-banc-des-jures',
  'Présomption d’innocence': 'le-banc-des-jures',

  'Chronique': 'la-cour-se-leve',

  'Acteurs': 'delibere', // TRANCHÉ — 286 articles sur les gardes des Sceaux, avocats, magistrats

  "104 Cours d'assises": 'l-expose', // TRANCHÉ — 556 articles, revues de la semaine et dossiers de société
  'Focus médiatique': 'l-expose',
  'Procès attendus': 'l-expose',

  'Cours de culture': 'le-greffe',
  "Cours d'Histoire": 'le-greffe',
  'VIDEOS JUDICIAIRES': 'le-greffe',
};

// Un article ancien porte souvent plusieurs catégories (179 des 187 du « Tour
// de France »). On garde la rubrique la plus SPÉCIFIQUE : Cours du Jour est le
// fourre-tout, il ne l'emporte que s'il n'y a rien d'autre.
const PRIORITE = ['le-greffe', 'le-banc-des-jures', 'la-cour-se-leve', 'l-expose', 'delibere', 'cours-du-jour'];

export function rubriqueDe(categories) {
  const candidates = new Set(categories.map((c) => ANCIENNES_CATEGORIES[c]).filter(Boolean));
  return PRIORITE.find((r) => candidates.has(r)) ?? 'cours-du-jour';
}

export function rubrique(slug) {
  return RUBRIQUES.find((r) => r.slug === slug);
}
