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


/**
 * Synthèses rédactionnelles vérifiées manuellement.
 * Ne jamais fabriquer ces récits à partir des titres de la veille.
 * Les sources documentent les faits et sont affichées au lecteur.
 */
export const RECITS_DOSSIERS = Object.freeze({
  'affaire-jubillar': {
    titre: 'De la disparition au procès en appel',
    chapeau: 'Pendant près de six ans, l’affaire Delphine Jubillar a été marquée par l’absence de corps et par les contestations de son mari. Après une première condamnation, les déclarations de Cédric Jubillar et la découverte de restes humains ont profondément modifié les données du procès à venir.',
    sections: [
      {
        titre: 'Une disparition et des années d’enquête',
        texte: 'Dans la nuit du 15 au 16 décembre 2020, Delphine Jubillar disparaît à Cagnac-les-Mines, dans le Tarn. Son mari, Cédric Jubillar, est poursuivi pour son meurtre. Pendant l’enquête et au premier procès, il conteste les faits. L’absence de corps occupe alors une place centrale dans les débats sur les preuves et la reconstitution des événements.'
      },
      {
        titre: 'Un premier verdict, puis un appel',
        texte: 'Le 17 octobre 2025, la cour d’assises du Tarn, réunie à Albi, reconnaît Cédric Jubillar coupable du meurtre de son épouse et le condamne à trente ans de réclusion criminelle. Il fait appel. Ce verdict de première instance n’est donc pas présenté ici comme une décision définitive.'
      },
      {
        titre: 'Les événements de juillet 2026',
        texte: 'En juillet 2026, après des années de dénégations, Cédric Jubillar reconnaît auprès de ses avocats puis des enquêteurs être à l’origine de la mort de Delphine. Le 16 juillet, des restes humains sont retrouvés sur ses indications près de Mailhoc. Ces développements conduisent la cour d’assises de Haute-Garonne à reporter le procès d’appel initialement prévu en septembre, afin de permettre des investigations supplémentaires.'
      },
      {
        titre: 'Les questions du nouveau procès',
        texte: 'Le procès d’appel est annoncé du 30 avril au 14 mai 2027 à Toulouse. La cour devra examiner les faits, les nouvelles déclarations de l’accusé et les résultats des investigations dans le cadre d’un débat contradictoire. La condamnation de première instance demeure susceptible d’être réexaminée en appel. La date annoncée reste un calendrier d’audience, et non la garantie que le procès se tiendra sans changement.'
      }
    ],
    sources: [
      { titre: 'RTL, 9 septembre 2026 : dates du procès en appel', url: 'https://www.rtl.fr/actu/justice-faits-divers/le-proces-en-appel-de-cedric-jubillar-fixe-du-30-avril-au-14-mai-2027-7900670787' },
      { titre: 'TF1 Info, 21 juillet 2026 : report après les aveux', url: 'https://www.tf1info.fr/justice-faits-divers/le-proces-en-appel-de-cedric-jubillar-renvoye-au-premier-semestre-2027-2454292.html' },
      { titre: 'La Dépêche, 9 septembre 2026 : nouveaux éléments et calendrier', url: 'https://www.ladepeche.fr/2026/09/09/affaire-jubillar-le-proces-en-appel-de-cedric-jubillar-se-tiendra-du-30-avril-au-14-mai-2027-13543297.php' }
    ],
    verifieAu: '2026-11-18'
  }
});

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

export function dossiersPourArticle(article) {
  if (article.verificationEnCours === true) return [];
  return dossiersPourRecherche(article.titre);
}

// Liens examinés : comparaisons avec une autre affaire, faits distincts à Mazan,
// ou dossiers pénaux distincts concernant la même personne. Les liens restent
// dans le fonds de veille d'origine ; ils ne sont exclus QUE du dossier Mazan.
const REFERENCES_TRANSVERSALES = new Set([
  "https://www.midilibre.fr/2025/12/28/retrospective-2025-cedric-jubillar-condamne-proces-en-appel-des-viols-de-mazan-les-trois-actualites-incontournables-du-mois-doctobre-13121378.php",
  "https://www.ouest-france.fr/societe/justice/de-face-je-voyais-un-innocent-de-profil-un-coupable-jubillar-pechier-le-doute-profite-t-il-aux-accuses-ec8c0864-dcdc-11f0-84e2-922db77b2982",
  "https://www.francebleu.fr/infos/faits-divers-justice/jubillar-pechier-rio-paris-les-grands-proces-attendus-pour-la-fin-de-l-annee-2025-1919700",
  "https://www.bfmtv.com/police-justice/proces/cedric-jubillar-nicolas-sarkozy-viols-de-mazan-les-grands-proces-a-venir-en-2025_AN-202501010269.html"
]);

const REFERENCES_HORS_DOSSIER = Object.freeze({
  'affaire-jubillar': new Set([
    "https://www.dna.fr/faits-divers-justice/2025/12/27/de-sarkozy-a-jubillar-retour-sur-une-annee-de-proces-tres-mediatiques",
    "https://www.slate.fr/monde/missiles-francais-bacteries-mortelles-proces-jubillar-best-of-articles-2025-guerre-ukraine-recherche-cancer-decouverte-mystere-sciences"
]),
  'viols-de-mazan': new Set([
    "https://rmc.bfmtv.com/actualites/police-justice/faits-divers/vouloir-en-decoudre-ce-n-est-pas-vouloir-tuer-au-proces-du-meurtre-d-aramburu-le-priol-et-bouvier-refutent-la-premeditation_AV-202609250240.html",
    "https://www.lemonde.fr/societe/article/2026/06/13/a-lyon-au-proces-d-un-alter-ego-de-dominique-pelicot-la-mecanique-perverse-de-la-domination-masculine_6701426_3224.html",
    "https://www.20minutes.fr/justice/4224088-20260518-air-proces-pelicot-laetitia-r-violee-torturee-prostituee-refuse-huis-clos-grand-dam-defense",
    "https://www.laprovence.com/article/faits-divers-justice/4014453826746614/meurtre-de-jesse-vivaldi-a-mazan-son-ami-d-enfance-condamne-a-20-ans-de-reclusion-criminelle-par-la-cour-d-assises",
    "https://www.midilibre.fr/2025/12/28/retrospective-2025-cedric-jubillar-condamne-proces-en-appel-des-viols-de-mazan-les-trois-actualites-incontournables-du-mois-doctobre-13121378.php",
    "https://www.letemps.ch/societe/cedric-jubillar-condamne-le-mystere-qui-aura-prive-le-feminicide-de-son-proces-pelicot",
    "https://www.lepoint.fr/societe/les-rates-affligeants-de-la-justice-face-a-dominique-pelicot-03-05-2025-2588760_23.php",
    "https://www.bfmtv.com/police-justice/une-traque-morbide-pelicot-le-scouarnec-ces-auteurs-d-abus-sexuels-collectionneurs-des-preuves-de-leurs-agressions_AN-202504250045.html",
    "https://www.midilibre.fr/2025/04/17/cold-case-dominique-pelicot-veut-faire-exhumer-le-corps-dune-jeune-femme-quil-nie-avoir-tuee-en-1991-12642405.php",
    "https://www.midilibre.fr/2025/01/06/la-mort-atroce-damandine-dans-lherault-laffaire-jubillar-et-les-viols-de-mazan-rejuges-a-nimes-tous-les-proces-de-2025-12423294.php",
    "https://www.bfmtv.com/police-justice/proces/cedric-jubillar-nicolas-sarkozy-viols-de-mazan-les-grands-proces-a-venir-en-2025_AN-202501010269.html",
    "https://actu.fr/societe/un-deuxieme-viol-comme-gisele-pelicot-ces-victimes-accusees-d-etre-coupables-au-proces_61683030.html"
])
});

export function referencesPourDossier(dossier, references = []) {
  const regle = REGLES[dossier?.slug];
  if (!regle || !Array.isArray(references)) return [];
  const uniques = new Map();
  for (const r of references) {
    if (!r || typeof r.titre !== 'string' || !regle.test(normaliserTitre(r.titre))) continue;
    if (typeof r.lien !== 'string' || !/^https?:\/\//i.test(r.lien)) continue;
    if (REFERENCES_TRANSVERSALES.has(r.lien) || REFERENCES_HORS_DOSSIER[dossier.slug]?.has(r.lien)) continue;
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
