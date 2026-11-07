// Repères judiciaires sélectionnés APRÈS consultation d'articles publics.
// Ils ne proviennent pas de la date des alertes Gmail. Ils sont volontairement
// distincts de la liste des liens de presse collectés automatiquement.
// Toute nouvelle date doit porter une source consultable et être relue avant publication.

export const TYPES_REPERE = Object.freeze({
  ouverture: 'Ouverture des audiences',
  audience: 'Déroulement de l’audience',
  decision: 'Décision de justice',
  recours: 'Recours / appel',
});

export const PHASES_REPERE = Object.freeze({
  premiere_instance: 'Première instance',
  appel: 'Appel',
});

export const VERIFICATION_AU = '2026-11-07';

// Dates : événement / publication de l'article / date de vérification.
// Une date de publication ne doit JAMAIS être substituée à la date de l'événement.
export const REPERES_JUDICIAIRES = Object.freeze([
  {
    id: 'jubillar-ouverture-2025',
    dossier: 'affaire-jubillar',
    dateEvenement: '2025-09-22',
    type: 'ouverture',
    phase: 'premiere_instance',
    titre: 'Ouverture du procès de Cédric Jubillar à Albi',
    description: 'Début des débats devant la cour d’assises du Tarn dans le dossier de la disparition de Delphine Jubillar.',
    juridiction: 'Cour d’assises du Tarn, Albi',
    source: 'Le Monde',
    urlSource: 'https://www.lemonde.fr/proces-jubillar/',
    dateSource: '2025-09-23',
  },
  {
    id: 'jubillar-verdict-2025',
    dossier: 'affaire-jubillar',
    dateEvenement: '2025-10-17',
    type: 'decision',
    phase: 'premiere_instance',
    titre: 'Condamnation en première instance',
    description: 'La cour d’assises du Tarn condamne Cédric Jubillar à trente ans de réclusion criminelle. Ses avocats annoncent leur intention de faire appel : ce verdict ne doit pas être présenté comme définitif.',
    juridiction: 'Cour d’assises du Tarn, Albi',
    source: 'TF1 Info / AFP',
    urlSource: 'https://www.tf1info.fr/justice-faits-divers/proces-cedric-jubillar-condamne-a-30-ans-de-prison-pour-le-meurtre-de-sa-femme-delphine-2401237.html',
    dateSource: '2025-10-17',
  },
  {
    id: 'pechier-ouverture-2025',
    dossier: 'affaire-pechier',
    dateEvenement: '2025-09-08',
    type: 'ouverture',
    phase: 'premiere_instance',
    titre: 'Ouverture du procès de Frédéric Péchier',
    description: 'Début des audiences devant la cour d’assises du Doubs dans l’affaire des empoisonnements de patients.',
    juridiction: 'Cour d’assises du Doubs, Besançon',
    source: 'TF1 Info / AFP',
    urlSource: 'https://www.tf1info.fr/justice-faits-divers/proces-frederic-pechier-l-ex-anesthesiste-condamne-a-la-reclusion-a-perpetuite-pour-30-empoisonnements-2413392.html',
    dateSource: '2025-12-18',
  },
  {
    id: 'pechier-verdict-2025',
    dossier: 'affaire-pechier',
    dateEvenement: '2025-12-18',
    type: 'decision',
    phase: 'premiere_instance',
    titre: 'Condamnation en première instance',
    description: 'La cour d’assises du Doubs prononce une peine de réclusion criminelle à perpétuité. La présente chronologie ne présume pas du sort des recours éventuels.',
    juridiction: 'Cour d’assises du Doubs, Besançon',
    source: 'TF1 Info / AFP',
    urlSource: 'https://www.tf1info.fr/justice-faits-divers/proces-frederic-pechier-l-ex-anesthesiste-condamne-a-la-reclusion-a-perpetuite-pour-30-empoisonnements-2413392.html',
    dateSource: '2025-12-18',
  },
  {
    id: 'mazan-ouverture-2024',
    dossier: 'viols-de-mazan',
    dateEvenement: '2024-09-02',
    type: 'ouverture',
    phase: 'premiere_instance',
    titre: 'Ouverture du procès des viols de Mazan à Avignon',
    description: 'Cinquante et un accusés comparaissent devant la cour criminelle du Vaucluse. Cette date désigne le début du procès de première instance.',
    juridiction: 'Cour criminelle départementale du Vaucluse, Avignon',
    source: 'Le Monde',
    urlSource: 'https://www.lemonde.fr/societe/article/2024/09/02/dominique-p-et-cinquante-hommes-devant-la-justice-pour-les-viols-en-serie-commis-sur-son-epouse_6301682_3224.html',
    dateSource: '2024-09-02',
  },
  {
    id: 'mazan-verdict-2024',
    dossier: 'viols-de-mazan',
    dateEvenement: '2024-12-19',
    type: 'decision',
    phase: 'premiere_instance',
    titre: 'Verdicts du procès de première instance à Avignon',
    description: 'Les cinquante et un accusés sont déclarés coupables par la juridiction criminelle du Vaucluse, avec des peines individualisées. Des recours ont ensuite concerné certains condamnés.',
    juridiction: 'Cour criminelle départementale du Vaucluse, Avignon',
    source: 'Le Monde',
    urlSource: 'https://www.lemonde.fr/societe/article/2024/12/19/le-proces-des-viols-de-mazan-d-un-combat-personnel-a-une-prise-de-conscience-collective_6457546_3224.html',
    dateSource: '2024-12-19',
  },
  {
    id: 'mazan-appel-ouverture-2025',
    dossier: 'viols-de-mazan',
    dateEvenement: '2025-10-06',
    type: 'ouverture',
    phase: 'appel',
    titre: 'Ouverture du procès en appel à Nîmes',
    description: 'Un seul condamné de la première instance maintient son appel : Husamettin Dogan. Il est rejugé devant la cour d’assises d’appel du Gard.',
    juridiction: 'Cour d’assises d’appel du Gard, Nîmes',
    source: 'Le Monde',
    urlSource: 'https://www.lemonde.fr/societe/article/2025/10/05/viols-de-mazan-le-proces-en-appel-s-ouvre-a-nimes-pour-un-seul-accuse_6644565_3224.html',
    dateSource: '2025-10-05',
  },
  {
    id: 'mazan-appel-verdict-2025',
    dossier: 'viols-de-mazan',
    dateEvenement: '2025-10-09',
    type: 'decision',
    phase: 'appel',
    titre: 'Décision de la cour d’assises d’appel du Gard',
    description: 'Husamettin Dogan est condamné à dix ans de réclusion criminelle en appel, contre neuf ans en première instance. Cette décision ne constitue pas un nouveau jugement de tous les accusés.',
    juridiction: 'Cour d’assises d’appel du Gard, Nîmes',
    source: 'Le Monde',
    urlSource: 'https://www.lemonde.fr/societe/article/2025/10/10/viols-de-mazan-le-prix-du-deni-et-la-fin-d-une-epreuve-au-bout-d-un-proces-en-appel-presque-ordinaire_6645561_3224.html',
    dateSource: '2025-10-10',
  },
  {
    id: 'inass-proces-ouverture-2026',
    dossier: 'martyre-de-a10',
    dateEvenement: '2026-11-02',
    type: 'ouverture',
    phase: 'premiere_instance',
    titre: 'Ouverture du procès des parents d’Inass Touloub',
    description: 'Les parents d’Inass Touloub comparaissent devant la cour d’assises du Loir-et-Cher. L’ouverture des débats est rapportée par la source citée. Aucun verdict n’est inscrit dans cette sélection au 7 novembre 2026.',
    juridiction: 'Cour d’assises du Loir-et-Cher, Blois',
    source: 'Le Monde',
    urlSource: 'https://www.lemonde.fr/societe/article/2026/11/01/l-inconnue-de-l-a10-de-l-abandon-d-une-enfant-suppliciee-au-proces-de-ses-parents-trois-decennies-de-secret-de-famille_6804513_3224.html',
    dateSource: '2026-11-01',
  },
  {
    id: 'inass-suspension-2026',
    dossier: 'martyre-de-a10',
    dateEvenement: '2026-11-04',
    type: 'audience',
    phase: 'premiere_instance',
    titre: 'Audience suspendue après un malaise',
    description: 'La séance est interrompue après le malaise de la mère d’Inass Touloub au cours des débats. Cet événement n’est pas un verdict.',
    juridiction: 'Cour d’assises du Loir-et-Cher, Blois',
    source: 'Le Monde',
    urlSource: 'https://www.lemonde.fr/societe/article/2026/11/04/proces-de-l-inconnue-de-l-a10-la-mere-d-inass-touloub-s-effondre-apres-la-diffusion-des-photos-de-l-autopsie-de-sa-fille_6806428_3224.html',
    dateSource: '2026-11-04',
  },
]);

export function dateCalendrierValide(s) {
  return typeof s === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(s)
    && !Number.isNaN(Date.parse(s))
    && new Date(s).toISOString().slice(0, 10) === s;
}

export function validerReperes(reperes, dossiers) {
  const slugs = new Set(dossiers.map(d => d.slug));
  const ids = new Set();
  for (const r of reperes) {
    if (!r || !r.id || ids.has(r.id) || !slugs.has(r.dossier)) throw new Error('Chronologie : identifiant ou dossier invalide.');
    ids.add(r.id);
    if (!dateCalendrierValide(r.dateEvenement) || !dateCalendrierValide(r.dateSource)) throw new Error('Chronologie : date invalide.');
    if (!(r.type in TYPES_REPERE) || !(r.phase in PHASES_REPERE)) throw new Error('Chronologie : type ou instance inconnu.');
    for (const k of ['titre', 'description', 'juridiction', 'source']) if (typeof r[k] !== 'string' || r[k].trim().length < 8) throw new Error('Chronologie : donnée requise absente.');
    let url;
    try { url = new URL(r.urlSource); } catch { throw new Error('Chronologie : URL source invalide.'); }
    if (url.protocol !== 'https:' || url.username || url.password || url.port || !url.hostname.includes('.')) throw new Error('Chronologie : source non admissible.');
    if (!/^(www\.)?(lemonde\.fr|tf1info\.fr)$/.test(url.hostname)) throw new Error('Chronologie : domaine non contrôlé.');
  }
  return true;
}

export function reperesPourDossier(slug, reperes = REPERES_JUDICIAIRES) {
  return reperes
    .filter(r => r.dossier === slug)
    .sort((a, b) => a.dateEvenement.localeCompare(b.dateEvenement) || a.id.localeCompare(b.id));
}

export function tousLesReperes(reperes = REPERES_JUDICIAIRES) {
  return [...reperes].sort((a, b) => b.dateEvenement.localeCompare(a.dateEvenement) || a.id.localeCompare(b.id));
}

export function couvertureParMois(references = []) {
  const parMois = new Map();
  for (const reference of references) {
    if (!dateCalendrierValide(reference.dateAlerte)) continue;
    const mois = reference.dateAlerte.slice(0, 7);
    parMois.set(mois, (parMois.get(mois) ?? 0) + 1);
  }
  return [...parMois].sort((a, b) => b[0].localeCompare(a[0])).map(([mois, nombre]) => ({ mois, nombre }));
}
