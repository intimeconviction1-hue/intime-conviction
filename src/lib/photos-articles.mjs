import photoBordeaux from '../assets/assises-bordeaux.webp';
import photoSalleVoltaire from '../assets/salle-voltaire.webp';
import photoCode from '../assets/code-procedure-penale.webp';
import croquisDelibere from '../assets/dossier-delibere-croquis.webp';
import photoAix from '../assets/palais-verdun-aix.webp';
import photoBlois from '../assets/blois.webp';
import photoParis from '../assets/rue-de-la-paix.webp';
import photoPoissy from '../assets/poissy.webp';
import photoSaintBrieuc from '../assets/saint-brieuc-tribunal.webp';

const photoPalaisAix = {
  image: photoAix,
  lieu: 'Palais Verdun, Aix-en-Provence',
  auteur: 'Lsmpascal',
  source: 'https://commons.wikimedia.org/wiki/File:Palais_de_justice_Aix-en-Provence.jpg',
  licence: 'CC BY-SA 3.0',
  lienLicence: 'https://creativecommons.org/licenses/by-sa/3.0/',
};

const photoPalaisBlois = {
  image: photoBlois, lieu: 'Palais de justice de Blois', auteur: 'Chabe01',
  source: 'https://commons.wikimedia.org/wiki/File:Palais_Justice_-_Blois_(FR41)_-_2022-07-16_-_1.jpg',
  licence: 'CC BY-SA 4.0', lienLicence: 'https://creativecommons.org/licenses/by-sa/4.0/',
};
// Lier les photos au lieu évoqué dans l’article, indépendamment de sa position.
export const photosArticles = {
  '/assises-entendre-un-proche-sans-serment/11/2026/': {
    image: photoBordeaux,
    lieu: 'Photo d’illustration · Salle de la cour d’assises, palais Thiac, Bordeaux',
    auteur: 'Tiraden',
    source: 'https://commons.wikimedia.org/wiki/File:Palais_Thiac,_Salle_d%27audience_de_la_cour_d%27assises.jpg',
    licence: 'CC BY-SA 4.0',
    lienLicence: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  '/assises-qui-parle-en-dernier/11/2026/': {
    image: photoSalleVoltaire,
    lieu: 'Photo d’illustration · Salle Voltaire de la cour d’assises, Paris',
    auteur: 'Tiraden',
    source: 'https://commons.wikimedia.org/wiki/File:Palais_de_justice_de_Paris_-_salle_Voltaire_(cour_d%27assises).jpg',
    licence: 'CC BY-SA 4.0',
    lienLicence: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  '/assises-que-dit-la-feuille-de-motivation/11/2026/': {
    image: photoCode,
    lieu: 'Code de procédure pénale',
    auteur: 'Illustration générée pour Intime Conviction',
    source: photoCode.src,
    licence: 'Texte officiel',
    lienLicence: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000006071154/',
  },
  '/assises-premier-recit-charge-decharge/11/2026/': {
    image: photoCode,
    lieu: 'Code de procédure pénale',
    auteur: 'Illustration générée pour Intime Conviction',
    source: photoCode.src,
    licence: 'Texte officiel',
    lienLicence: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000006071154/',
  },
  '/assises-bulletin-blanc-vote-culpabilite/11/2026/': {
    image: photoCode,
    lieu: 'Code de procédure pénale',
    auteur: 'Illustration générée pour Intime Conviction',
    source: photoCode.src,
    licence: 'Texte officiel',
    lienLicence: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000006071154/',
  },
  '/assises-quand-le-dossier-revient-au-delibere/11/2026/': {
    image: croquisDelibere,
    croquis: true,
    lieu: 'Dossier judiciaire fermé sur un code',
    auteur: 'Illustration générée pour Intime Conviction',
    source: croquisDelibere.src,
    licence: 'Texte officiel',
    lienLicence: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000006071154/',
  },
  '/assises-quand-un-temoin-cite-manque/11/2026/': {
    image: croquisDelibere,
    croquis: true,
    lieu: 'Dossier judiciaire fermé sur un code',
    auteur: 'Illustration générée pour Intime Conviction',
    source: croquisDelibere.src,
    licence: 'Texte officiel',
    lienLicence: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000006071154/',
  },
  '/chateauneuf-les-martigues-ce-que-reconnait-un-accuse/11/2026/': photoPalaisAix,
  '/proces-sollacaro-et-tout-recommence-aux-assises/11/2026/': photoPalaisAix,
  '/inass-touloub-a-blois-le-poids-des-trente-neuf-annees/11/2026/': photoPalaisBlois,
  '/piaget-le-braqueur-au-borsalino-revient-devant-les-assises/11/2026/': {
    image: photoParis, lieu: 'Rue de la Paix, Paris', auteur: 'Mustang Joe',
    source: 'https://commons.wikimedia.org/wiki/File:Rue_de_la_Paix_(5999837542).jpg',
    licence: 'CC0', lienLicence: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  '/mort-dolivio-gomes-le-proces-en-appel-du-policier-souvre-a-nanterre/11/2026/': {
    image: photoPoissy, lieu: 'Hôtel de ville de Poissy', auteur: 'Chabe01',
    source: 'https://commons.wikimedia.org/wiki/File:Hôtel_Ville_-_Poissy_(FR78)_-_2025-07-12_-_3.jpg',
    licence: 'CC BY-SA 4.0', lienLicence: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  '/affaire-ferreira-ce-que-les-aveux-permettent-de-verifier/11/2026/': {
    image: photoSaintBrieuc,
    lieu: 'Palais de justice de Saint-Brieuc',
    auteur: 'Presko',
    source: 'https://commons.wikimedia.org/wiki/File:Saint-Brieuc-tribunal.JPG',
    licence: 'CC BY-SA 4.0',
    lienLicence: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
};
