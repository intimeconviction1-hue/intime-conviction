// Implantations connues des juridictions associées aux jalons éditoriaux.
// Coordonnées = centres des VILLES (et non point GPS du palais ou salle d'audience).
// Sources officielles : Ministère de la Justice / cours-appel.justice.fr.
// Ne jamais déduire le lieu des faits des coordonnées de la juridiction.

export const JURIDICTIONS = Object.freeze([
  {
    id: 'albi',
    ville: 'Albi',
    departement: 'Tarn (81)',
    region: 'Occitanie',
    lat: 43.93, lon: 2.15,
    adresse: 'Place Lapérouse, 81000 Albi, France',
    juridiction: 'Cour d’assises du Tarn',
    type: 'Première instance',
    dossier: 'affaire-jubillar',
    sourceInstitutionnelle: 'Cour d’appel de Toulouse',
    urlInstitutionnelle: 'https://lannuaire.service-public.gouv.fr/occitanie/tarn/1d58f07e-fc35-42b3-a961-18693dd9f901',
  },
  {
    id: 'besancon',
    ville: 'Besançon',
    departement: 'Doubs (25)',
    region: 'Bourgogne-Franche-Comté',
    lat: 47.24, lon: 6.02,
    adresse: '1 rue Mégevand, 25000 Besançon, France',
    juridiction: 'Cour d’assises du Doubs',
    type: 'Première instance',
    dossier: 'affaire-pechier',
    sourceInstitutionnelle: 'Cour d’appel de Besançon',
    urlInstitutionnelle: 'https://www.cours-appel.justice.fr/besancon/les-juridictions-criminelles',
  },
  {
    id: 'avignon',
    ville: 'Avignon',
    departement: 'Vaucluse (84)',
    region: 'Provence-Alpes-Côte d’Azur',
    lat: 43.95, lon: 4.81,
    adresse: '2 boulevard Limbert, 84000 Avignon, France',
    juridiction: 'Cour criminelle départementale du Vaucluse',
    type: 'Première instance',
    dossier: 'viols-de-mazan',
    sourceInstitutionnelle: 'Cour d’appel de Nîmes',
    urlInstitutionnelle: 'https://lannuaire.service-public.gouv.fr/provence-alpes-cote-d-azur/vaucluse/f77e3eba-44a4-4288-9523-d9563e37aecc',
  },
  {
    id: 'nimes',
    ville: 'Nîmes',
    departement: 'Gard (30)',
    region: 'Occitanie',
    lat: 43.84, lon: 4.36,
    adresse: 'Boulevard des Arènes, 30000 Nîmes, France',
    juridiction: 'Cour d’assises d’appel du Gard',
    type: 'Appel',
    dossier: 'viols-de-mazan',
    sourceInstitutionnelle: 'Ministère de la Justice',
    urlInstitutionnelle: 'https://lannuaire.service-public.gouv.fr/occitanie/gard/7b730ff9-3944-464e-9707-fdf7ce2d6ec4',
  },
  {
    id: 'blois',
    ville: 'Blois',
    departement: 'Loir-et-Cher (41)',
    region: 'Centre-Val de Loire',
    lat: 47.59, lon: 1.33,
    adresse: '1 place de la République, 41000 Blois, France',
    juridiction: 'Cour d’assises du Loir-et-Cher',
    type: 'Première instance',
    dossier: 'martyre-de-a10',
    sourceInstitutionnelle: 'Cour d’appel d’Orléans',
    urlInstitutionnelle: 'https://lannuaire.service-public.gouv.fr/centre-val-de-loire/loir-et-cher/5adebf71-25bf-412e-8af4-8d474a03dcb2',
  },
]);

// Projection linéaire pensée pour une carte éditoriale schématique,
// ni outil de navigation ni plan cadastral.
export function coordonneesPlan(lat, lon) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new TypeError('Coordonnées géographiques invalides');
  return {
    x: Math.round((12 + (lon + 5.5) / 14.3 * 76) * 100) / 100,
    y: Math.round((12 + (51.2 - lat) / 9.0 * 76) * 100) / 100,
  };
}

export function juridictionsPourDossier(slug, donnees = JURIDICTIONS) {
  return donnees.filter(j => j.dossier === slug);
}

export function validerJuridictions(donnees, dossiers) {
  const slugs = new Set(dossiers.map(d => d.slug));
  const ids = new Set();
  for (const j of donnees) {
    if (!j.id || ids.has(j.id) || !slugs.has(j.dossier)) throw new Error('Implantation sans identifiant ou dossier valide');
    ids.add(j.id);
    if (!(j.lat >= 41 && j.lat <= 51.5 && j.lon >= -6 && j.lon <= 10)) throw new Error('Coordonnées hors de France métropolitaine');
    if (!['Première instance', 'Appel'].includes(j.type)) throw new Error('Type de procédure inconnu');
    if (!j.ville || !j.adresse || !j.juridiction || !j.region || !j.departement) throw new Error('Informations institutionnelles manquantes');
    let url;
    try { url = new URL(j.urlInstitutionnelle); } catch { throw new Error('Source institutionnelle invalide'); }
    if (url.protocol !== 'https:' || !['www.cours-appel.justice.fr','www.justice.fr','lannuaire.service-public.gouv.fr'].includes(url.hostname)) throw new Error('Source institutionnelle non officielle');
  }
  return true;
}
