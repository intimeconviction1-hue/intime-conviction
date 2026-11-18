import photoTribunalParis from '../assets/tribunal-paris.webp';
import photoLimoges from '../assets/palais-limoges.webp';
import photoTulle from '../assets/palais-tulle.webp';
import photoVannes from '../assets/palais-vannes.webp';
import photoBordeaux from '../assets/assises-bordeaux.webp';
import photoSalleVoltaire from '../assets/salle-voltaire.webp';
import photoCode from '../assets/code-procedure-penale.webp';
import croquisDelibere from '../assets/dossier-delibere-croquis.webp';
import photoAix from '../assets/palais-verdun-aix.webp';
import photoBlois from '../assets/blois.webp';
import photoParis from '../assets/rue-de-la-paix.webp';
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
export const illustrationAssises = {
  image: photoBordeaux,
  lieu: 'Photo d’illustration · Salle de la cour d’assises, palais Thiac, Bordeaux',
  auteur: 'Tiraden',
  source: 'https://commons.wikimedia.org/wiki/File:Palais_Thiac,_Salle_d%27audience_de_la_cour_d%27assises.jpg',
  licence: 'CC BY-SA 4.0',
  lienLicence: 'https://creativecommons.org/licenses/by-sa/4.0/',
};
// Repli neutre : ne pas faire passer la salle de Bordeaux pour le lieu d'une affaire.
export const illustrationNeutre = {
  image: croquisDelibere,
  croquis: true,
  lieu: 'Illustration judiciaire générique · Ne représente pas une audience réelle',
  auteur: 'Illustration générée pour Intime Conviction',
  source: croquisDelibere.src,
  licence: 'Visuel créé pour Intime Conviction',
  lienLicence: croquisDelibere.src,
};

const photoAssisesParis = {
  image: photoSalleVoltaire,
  lieu: 'Photo d’illustration · Salle Voltaire de la cour d’assises, Paris',
  auteur: 'Tiraden',
  source: 'https://commons.wikimedia.org/wiki/File:Palais_de_justice_de_Paris_-_salle_Voltaire_(cour_d%27assises).jpg',
  licence: 'CC BY-SA 4.0',
  lienLicence: 'https://creativecommons.org/licenses/by-sa/4.0/',
};

// Lier les photos au lieu évoqué dans l’article, indépendamment de sa position.
export const photosArticles = {
  '/semaine-18-novembre-ce-que-les-preuves-laissent-a-juger/11/2026/': {
    image: croquisDelibere, croquis: true,
    lieu: 'Dossier judiciaire fermé sur un code · Illustration générée',
    auteur: 'Illustration générée pour Intime Conviction',
    source: croquisDelibere.src, licence: 'Visuel créé pour Intime Conviction',
    lienLicence: croquisDelibere.src,
  },

  '/madjaliwa-safari-presence-barriere-role-conteste/11/2026/': {
    image: photoTribunalParis,
    lieu: 'Photo d’illustration · Tribunal de Paris vu du parc des Batignolles',
    auteur: 'Coppertarzan',
    source: 'https://commons.wikimedia.org/wiki/File:Tribunal_de_Paris_seen_from_Batignolles_park.jpg',
    licence: 'CC0', lienLicence: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  '/michel-zecler-les-excuses-face-aux-images/11/2026/': {
    image: photoTribunalParis,
    lieu: 'Photo d’illustration · Tribunal de Paris vu du parc des Batignolles',
    auteur: 'Coppertarzan',
    source: 'https://commons.wikimedia.org/wiki/File:Tribunal_de_Paris_seen_from_Batignolles_park.jpg',
    licence: 'CC0', lienLicence: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  '/maylis-daubon-pau-personnalite-et-preuve/11/2026/': {
    image: { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Paupalaisdejustice.jpg/1024px-Paupalaisdejustice.jpg', width: 1024, height: 768 },
    fallbackImage: croquisDelibere,
    lieu: 'Palais de justice de Pau · Photographie de 2007, non prise pendant le procès',
    auteur: 'Florent Pécassou',
    source: 'https://commons.wikimedia.org/wiki/File:Paupalaisdejustice.jpg',
    licence: 'CC BY-SA 3.0', lienLicence: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  '/lourdes-pourquoi-le-verdict-a-ete-annule/11/2026/': {
    image: croquisDelibere, croquis: true,
    lieu: 'Illustration judiciaire générique · Ne représente pas le procès de Lourdes',
    auteur: 'Illustration générée pour Intime Conviction',
    source: croquisDelibere.src,
    licence: 'Visuel créé pour Intime Conviction', lienLicence: croquisDelibere.src,
  },
  '/saint-junien-verdict-coups-et-menaces/11/2026/': {
    image: photoLimoges,
    lieu: 'Palais de justice de Limoges, place d’Aine',
    auteur: 'Olybrius',
    source: 'https://commons.wikimedia.org/wiki/File:Limoges_-_Cour_d%27appel_-_20150517_(1).jpg',
    licence: 'CC BY-SA 4.0',
    lienLicence: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  '/tour-des-cours-9-au-13-mars-2020/03/2020/': photoAssisesParis,
  '/mort-lyanna-tulle-proces-ajourne/11/2026/': {
    image: photoTulle,
    lieu: 'Palais de justice de Tulle',
    auteur: 'Blood Destructor',
    source: 'https://commons.wikimedia.org/wiki/File:Palais_de_justice_de_Tulle.jpg',
    licence: 'CC BY-SA 3.0',
    lienLicence: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  '/vannes-verdict-inceste-en-appel/11/2026/': {
    image: photoVannes,
    lieu: 'Palais de justice de Vannes',
    auteur: 'Quoique',
    source: 'https://commons.wikimedia.org/wiki/File:Palais-Justice-Vannes.jpg',
    licence: 'CC BY-SA 3.0',
    lienLicence: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  '/dettes-cupidite-et-jalousie-le-proces-de-lassassinat-de-la-milliardaire-helene-pastor/09/2018/': photoPalaisAix,
  '/viol-du-36/01/2019/': photoAssisesParis,
  '/yvan-colonna-acte-iii/11/2015/': photoAssisesParis,
  '/dominique-cottrez/07/2015/': illustrationNeutre,
  '/le-bebe-dans-le-coffre/11/2018/': illustrationNeutre,
  '/assises-entendre-un-proche-sans-serment/11/2026/': illustrationNeutre,
  '/assises-qui-parle-en-dernier/11/2026/': photoAssisesParis,
  '/assises-piece-a-conviction-a-la-barre/11/2026/': {
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
    licence: 'Visuel créé pour Intime Conviction',
    lienLicence: photoCode.src,
  },
  '/crepol-ce-que-grenoble-reexamine/11/2026/': {
    image: photoCode,
    lieu: 'Code de procédure pénale',
    auteur: 'Illustration générée pour Intime Conviction',
    source: photoCode.src,
    licence: 'Visuel créé pour Intime Conviction',
    lienLicence: photoCode.src,
  },
  '/assises-premier-recit-charge-decharge/11/2026/': {
    image: photoCode,
    lieu: 'Code de procédure pénale',
    auteur: 'Illustration générée pour Intime Conviction',
    source: photoCode.src,
    licence: 'Visuel créé pour Intime Conviction',
    lienLicence: photoCode.src,
  },
  '/assises-bulletin-blanc-vote-culpabilite/11/2026/': {
    image: photoCode,
    lieu: 'Code de procédure pénale',
    auteur: 'Illustration générée pour Intime Conviction',
    source: photoCode.src,
    licence: 'Visuel créé pour Intime Conviction',
    lienLicence: photoCode.src,
  },
  '/assises-quand-le-dossier-revient-au-delibere/11/2026/': {
    image: croquisDelibere,
    croquis: true,
    lieu: 'Dossier judiciaire fermé sur un code',
    auteur: 'Illustration générée pour Intime Conviction',
    source: croquisDelibere.src,
    licence: 'Visuel créé pour Intime Conviction',
    lienLicence: photoCode.src,
  },
  '/assises-quand-un-temoin-cite-manque/11/2026/': {
    image: croquisDelibere,
    croquis: true,
    lieu: 'Dossier judiciaire fermé sur un code',
    auteur: 'Illustration générée pour Intime Conviction',
    source: croquisDelibere.src,
    licence: 'Visuel créé pour Intime Conviction',
    lienLicence: photoCode.src,
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
    ...illustrationNeutre,
    lieu: 'Illustration judiciaire générique · Ni le lieu des faits à Poissy, ni la cour d’assises de Nanterre',
  },
  '/affaire-ferreira-ce-que-les-aveux-permettent-de-verifier/11/2026/': {
    image: photoSaintBrieuc,
    lieu: 'Palais de justice de Saint-Brieuc',
    auteur: 'Presko',
    source: 'https://commons.wikimedia.org/wiki/File:Saint-Brieuc-tribunal.JPG',
    licence: 'CC BY-SA 4.0',
    lienLicence: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  '/ferreira-sollacaro-deux-manieres-deprouver-un-recit/11/2026/': {
    image: photoSaintBrieuc,
    lieu: 'Procès Ferreira · Palais de justice de Saint-Brieuc',
    auteur: 'Presko',
    source: 'https://commons.wikimedia.org/wiki/File:Saint-Brieuc-tribunal.JPG',
    licence: 'CC BY-SA 4.0',
    lienLicence: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
};
