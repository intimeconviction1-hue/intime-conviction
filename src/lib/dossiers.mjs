// Références regroupées par mention explicite du sujet dans leur TITRE.
// Ce n'est ni une reconstitution de faits, ni une attribution de responsabilité.
// Les intitulés et règles sont éditorialement déclarés, jamais inférés par une IA.

export const DOSSIERS = Object.freeze([
  {
    slug: 'affaire-jubillar',
    titre: 'Affaire Jubillar',
    repere: 'LE DOSSIER JUBILLAR',
    presentation: 'Les références de presse dont le titre mentionne le nom Jubillar, classées dans l’ordre des alertes.',
  },
  {
    slug: 'affaire-pechier',
    titre: 'Affaire Péchier',
    repere: 'LE DOSSIER PÉCHIER',
    presentation: 'Le suivi de presse des publications mentionnant le nom Péchier. Plusieurs étapes judiciaires peuvent apparaître.',
  },
  {
    slug: 'viols-de-mazan',
    titre: 'Procès des viols de Mazan',
    repere: 'MAZAN / PELICOT',
    presentation: 'Les titres citant Mazan ou Pelicot, y compris des publications évoquant l’affaire sans porter nécessairement sur le même procès.',
  },
  {
    slug: 'martyre-de-a10',
    titre: 'Petite martyre de l’A10',
    repere: 'INASS TOULOUB',
    presentation: 'Les références mentionnant Inass, le nom Touloub ou l’expression « martyre de l’A10 ».',
  },
]);

// Délibérément strict : pas de rapprochement sur des termes génériques comme
// « meurtre », « procès », « infirmier », « tribunal » ou « accusé ».
const REGLES = {
  'affaire-jubillar': /\bjubillar\b/u,
  'affaire-pechier': /\bpechier\b/u,
  'viols-de-mazan': /\b(?:mazan|pelicot)\b/u,
  'martyre-de-a10': /\b(?:inass|touloub)\b|\bmartyre\b.{0,50}\ba\s?10\b/u,
};

export function normaliserTitre(texte = '') {
  return String(texte)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function dossiersPourRecherche(requete) {
  const texte = normaliserTitre(requete);
  return DOSSIERS.filter(dossier => REGLES[dossier.slug].test(texte));
}

export function referencesPourDossier(dossier, references = []) {
  const regle = REGLES[dossier?.slug];
  if (!regle || !Array.isArray(references)) return [];
  const uniques = new Map();
  for (const r of references) {
    if (!r || typeof r.titre !== 'string' || !regle.test(normaliserTitre(r.titre))) continue;
    if (typeof r.lien !== 'string' || !/^https?:\/\//i.test(r.lien)) continue;
    if (typeof r.source !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(r.dateAlerte ?? '')) continue;
    // Ne jamais recopier les corps, identifiants ou métadonnées Gmail.
    const reference = { titre: r.titre, source: r.source, lien: r.lien, dateAlerte: r.dateAlerte };
    const ancienne = uniques.get(reference.lien);
    if (!ancienne || reference.dateAlerte < ancienne.dateAlerte) uniques.set(reference.lien, reference);
  }
  return [...uniques.values()].sort((a, b) =>
    b.dateAlerte.localeCompare(a.dateAlerte) || a.titre.localeCompare(b.titre, 'fr')
  );
}

export function statistiquesDossier(references = []) {
  const annees = new Map();
  for (const reference of references) {
    const annee = reference.dateAlerte.slice(0, 4);
    annees.set(annee, (annees.get(annee) ?? 0) + 1);
  }
  return {
    total: references.length,
    medias: new Set(references.map(a => a.source.toLocaleLowerCase('fr'))).size,
    debut: references.at(-1)?.dateAlerte ?? null,
    fin: references.at(0)?.dateAlerte ?? null,
    annees: [...annees].sort((a, b) => Number(b[0]) - Number(a[0])),
  };
}
