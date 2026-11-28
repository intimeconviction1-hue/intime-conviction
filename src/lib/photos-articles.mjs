import photoLyon from '../assets/cour-assises-lyon.webp';
import photoMontpellier from '../assets/cour-assises-montpellier.webp';
import croquisCodeRosiers from '../assets/code-procedure-penale-croquis.webp';
import photoCodePenal1810 from '../assets/code-penal-1810.webp';
import croquisDigne from '../assets/assises-landru.webp';
import croquisAudienceSarah from '../assets/croquis-audience-bandeau.webp';
import croquisHeaulme from '../assets/croquis-manchette.webp';
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
  '/paris-arnould-depardieu-renvoi-partiel-deux-dates/11/2026/': { ...illustrationNeutre, image: photoCode, source: photoCode.src, lienLicence: photoCode.src, lieu: 'Code de procédure pénale. Illustration générée pour Intime Conviction.' },
  '/mons-falzone-indemnisation-solidarite-passager/11/2026/': { ...illustrationNeutre, image: croquisAudienceSarah, source: croquisAudienceSarah.src, lienLicence: croquisAudienceSarah.src, lieu: 'Illustration générée pour Intime Conviction. Le dessin ne représente pas l’audience de Mons.' },
  '/roanne-victor-marques-legitime-defense/11/2026/': {
    image: photoCodePenal1810,
    lieu: 'Page de titre du Code pénal de 1810, édition de Bruxelles · Illustration d’archives',
    auteur: 'Gambier, Bruxelles, 1810 · numérisation Google via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Code_p%C3%A9nal_(Gambier,_1810).pdf',
    licence: 'Domaine public',
    lienLicence: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  '/paris-emilie-konig-proces-assises/11/2026/': { ...illustrationNeutre, lieu: 'Illustration générée pour Intime Conviction. Le dessin ne représente pas l’audience à Paris.' },
  '/basse-terre-nathalie-caux-autopsie-percheron/11/2026/': { ...illustrationNeutre, image: croquisCodeRosiers, source: croquisCodeRosiers.src, lienLicence: croquisCodeRosiers.src, lieu: 'Code de procédure pénale. Illustration générée pour Intime Conviction.' },
  '/bruxelles-starzomski-sugar-provocation-verdict/11/2026/': { ...illustrationNeutre, image: croquisHeaulme, source: croquisHeaulme.src, lienLicence: croquisHeaulme.src, lieu: "Illustration judiciaire générée pour Intime Conviction. Elle ne représente pas la salle du procès." },
  '/montpellier-morcillo-acquittement-montasinos/11/2026/': { image: photoMontpellier, lieu: "Fronton du palais de justice historique de Montpellier, rue Foch, siège de la cour d’assises de l’Hérault. Photographie d’archives, redimensionnée.", auteur: "Tony Bowden", source: "https://commons.wikimedia.org/wiki/File:Montpellier,_Palace_of_Justice_(6414118631).jpg", licence: "CC BY-SA 2.0", lienLicence: 'https://creativecommons.org/licenses/by-sa/2.0/' },
  '/reims-raphael-narcisse-verdict-celestin/11/2026/': { ...illustrationNeutre, lieu: 'Illustration judiciaire générée pour Intime Conviction. Elle ne représente pas l’audience de Reims.' },
  '/epinal-papeete-grasse-ce-que-l-aveu-ne-tranche-pas/11/2026/': {
    image: photoCodePenal1810,
    lieu: 'Page de titre du Code pénal de 1810, édition de Bruxelles · Illustration d’archives',
    auteur: 'Gambier, Bruxelles, 1810 · numérisation Google via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Code_p%C3%A9nal_(Gambier,_1810).pdf',
    licence: 'Domaine public',
    lienLicence: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  '/papeete-makemo-jacques-t-audience-coup-mortel/11/2026/': { ...illustrationNeutre, image: croquisAudienceSarah, source: croquisAudienceSarah.src, lienLicence: croquisAudienceSarah.src, lieu: 'Illustration générée pour Intime Conviction. Elle ne représente ni la salle de Papeete ni les personnes citées.' },
  '/bruyeres-gilbert-jacob-proces-jimmy-hariot/11/2026/': { ...illustrationNeutre, image: croquisCodeRosiers, source: croquisCodeRosiers.src, lienLicence: croquisCodeRosiers.src, lieu: "Code de procédure pénale. Illustration générée pour Intime Conviction." },
  '/grasse-nora-mike-furlad-trente-ans-intention-contestee/11/2026/': { ...illustrationNeutre, image: croquisAudienceSarah, source: croquisAudienceSarah.src, lienLicence: croquisAudienceSarah.src, lieu: "Illustration judiciaire générée pour Intime Conviction. Elle ne représente pas la salle du procès." },
  '/bouches-du-rhone-acquittement-assassinat-association-malfaiteurs-indemnisation/11/2026/': {
    ...illustrationNeutre,
    image: photoCode,
    lieu: 'Code de procédure pénale · Illustration générée pour Intime Conviction',
    source: photoCode.src,
    lienLicence: photoCode.src,
  },
  '/colmar-mulhouse-viol-reunion-proces-renvoye/11/2026/': { ...illustrationNeutre, image: photoCode, lieu: 'Code de procédure pénale · Illustration générée pour Intime Conviction', source: photoCode.src, lienLicence: photoCode.src },
  '/charente-assises-romain-runel-ouverture-proces/11/2026/': illustrationNeutre,
  '/guadeloupe-proces-assises-mineurs-mandat-arret/11/2026/': { ...illustrationNeutre, image: croquisCodeRosiers, lieu: 'Code de procédure pénale · Illustration générée pour Intime Conviction', source: croquisCodeRosiers.src, lienLicence: croquisCodeRosiers.src },
  '/puy-en-velay-hotel-tentative-meurtre-verdict/11/2026/': illustrationNeutre,
  '/papeete-derniere-session-assises-dossiers-viol-2026/11/2026/': illustrationNeutre,
  '/orlan-melon-liege-balistique-peine-brandon-mathy/11/2026/': { ...illustrationNeutre, image: croquisHeaulme, lieu: 'Croquis judiciaire d’illustration · Ne représente pas le procès de Liège', source: croquisHeaulme.src, lienLicence: croquisHeaulme.src },
  '/enver-hadri-nivelles-parties-civiles-dossier-draskovic/11/2026/': { ...illustrationNeutre, image: croquisDigne, lieu: 'Croquis judiciaire généré · Ne représente pas le procès de Nivelles', source: croquisDigne.src, lienLicence: croquisDigne.src },
  '/carine-charpentier-aisne-leroux-verdict-perles/11/2026/': { ...illustrationNeutre, lieu: 'Illustration judiciaire générique · Ne représente pas le procès de Laon' },
  '/eleonore-douai-verdict-neuville-saint-remy/11/2026/': { ...illustrationNeutre, image: croquisAudienceSarah, lieu: 'Croquis judiciaire d’illustration · Ne représente pas l’audience de Douai', source: croquisAudienceSarah.src, lienLicence: croquisAudienceSarah.src },
  '/grenoble-henry-duffourd-tentative-meurtre-quatre-condamnations/11/2026/': { ...illustrationNeutre, lieu: 'Illustration judiciaire générique · Ne représente pas le procès de Grenoble' },
  '/roubaix-square-bousquet-tir-mehdi-proces-douai/11/2026/': { ...illustrationNeutre, image: croquisCodeRosiers, source: croquisCodeRosiers.src, lienLicence: croquisCodeRosiers.src, lieu: 'Illustration judiciaire générique · Ne représente pas le procès de Douai' },
  '/samia-mimoun-maurepas-legitime-defense-verdict/11/2026/': {
    image: photoCodePenal1810,
    lieu: 'Page de titre du Code pénal de 1810, édition de Bruxelles · Illustration d’archives',
    auteur: 'Gambier, Bruxelles, 1810 · numérisation Google via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Code_p%C3%A9nal_(Gambier,_1810).pdf',
    licence: 'Domaine public',
    lienLicence: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  '/yordan-arron-basse-terre-desistement-appel/11/2026/': {
    ...illustrationNeutre,
    image: croquisCodeRosiers,
    lieu: 'Code de procédure pénale · Illustration générée pour Intime Conviction',
    source: croquisCodeRosiers.src,
    lienLicence: croquisCodeRosiers.src,
  },
  '/duchere-lyon-enregistrement-audience-paroles-sous-scelles/11/2026/': {
    ...illustrationNeutre,
    image: photoCode,
    lieu: 'Code de procédure pénale · Illustration générée pour Intime Conviction',
    source: photoCode.src,
    lienLicence: photoCode.src,
  },
  '/camille-paul-basse-terre-enregistrement-verdict/11/2026/': { ...illustrationNeutre, lieu: 'Illustration judiciaire générique · Ne représente pas le procès de Basse-Terre' },
  '/duchere-lyon-proces-absence-ben-addi/11/2026/': { image: photoLyon, lieu: "Colonnes du palais de justice historique de Lyon, siège de la cour d’assises du Rhône. Photographie d’archives, redimensionnée.", auteur: "Gonedelyon", source: "https://commons.wikimedia.org/wiki/File:Colonnes_du_Palais_de_justice_de_Lyon.JPG", licence: "CC BY-SA 3.0", lienLicence: 'https://creativecommons.org/licenses/by-sa/3.0/' },
  '/jean-paul-benjamin-bobigny-images-legitime-defense/11/2026/': { ...illustrationNeutre, lieu: 'Illustration judiciaire générique · Ne représente pas le procès de Bobigny' },
  '/nahel-merzouk-versailles-intention-du-tir/11/2026/': { ...illustrationNeutre, lieu: 'Illustration judiciaire générique · Ne représente pas le procès de Versailles' },
  '/rue-des-rosiers-extradition-appel-renvoi/11/2026/': {
    ...illustrationNeutre,
    image: croquisCodeRosiers,
    lieu: 'Code de procédure pénale · Illustration générée',
    source: croquisCodeRosiers.src,
    lienLicence: croquisCodeRosiers.src,
  },
  '/sainte-rose-minorite-quinze-ans/11/2026/': {
    image: photoCodePenal1810,
    lieu: "Page de titre du Code pénal de 1810, édition de Bruxelles · Illustration d’archives. Les dispositions en vigueur sont citées dans l’article.",
    auteur: "Gambier, Bruxelles, 1810 · numérisation Google via Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Code_p%C3%A9nal_(Gambier,_1810).pdf",
    licence: 'Domaine public',
    lienLicence: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  '/chahinez-daoud-boutaa-perigueux-discernement/11/2026/': illustrationNeutre,
  '/evry-meurtre-sabine-appel-au-17/11/2026/': illustrationNeutre,
  '/sarah-sadani-temoin-rescapee-fusillade-proces-aix/11/2026/': {
    ...illustrationNeutre,
    image: croquisAudienceSarah,
    lieu: 'Illustration judiciaire du journal · Ne représente ni le procès de Sarah Sadani ni les personnes citées',
    source: croquisAudienceSarah.src,
    lienLicence: croquisAudienceSarah.src,
  },
  '/karen-baldi-proces-chambery-protection-premeditation/11/2026/': {
    ...illustrationNeutre,
    image: photoCode,
    source: photoCode.src,
    lienLicence: photoCode.src,
    lieu: 'Code de procédure pénale · Illustration graphique sans lien documentaire avec le procès de Chambéry',
  },
  '/luca-toulouse-soiree-amis-premeditation-verdict/11/2026/': {
    ...illustrationNeutre,
    lieu: 'Illustration judiciaire générée · Ne représente ni le procès de Luca ni les personnes citées',
  },

  '/caro-coups-au-telephone-version-defense/11/2026/': {
    image: photoVannes,
    lieu: 'Palais de justice de Vannes · Photographie du lieu, non prise pendant ce procès',
    auteur: 'Quoique',
    source: 'https://commons.wikimedia.org/wiki/File:Palais-Justice-Vannes.jpg',
    licence: 'CC BY-SA 3.0',
    lienLicence: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  '/manosque-deux-chocs-intention-contestee-digne/11/2026/': {
    ...illustrationNeutre, image: croquisDigne,
    lieu: 'Illustration judiciaire générée · Ne représente ni cette audience ni les personnes citées',
    source: croquisDigne.src, lienLicence: croquisDigne.src,
  },
  '/jean-joseph-clement-heaulme-aveux-renvoi-conteste/11/2026/': {
    ...illustrationNeutre, image: croquisHeaulme,
    lieu: 'Illustration judiciaire générée · Ne représente ni l’audience ni les personnes citées',
    source: croquisHeaulme.src, lienLicence: croquisHeaulme.src,
  },
  '/question-nouvelle-zecler-lourdes-droits-defense/11/2026/': {
    image: photoCode, croquis: true,
    lieu: 'Code de procédure pénale · Illustration générée',
    auteur: 'Illustration générée pour Intime Conviction',
    source: photoCode.src, licence: 'Visuel créé pour Intime Conviction', lienLicence: photoCode.src,
  },
  '/tour-des-cours-fevrier-2015/03/2015/': photoAssisesParis,

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
    // Vue distincte pour éviter deux couvertures identiques dans la sélection récente.
    image: {
      src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Parvis_Tribunal_Paris_-_Paris_XVII_%28FR75%29_-_2021-08-20_-_1.jpg/960px-Parvis_Tribunal_Paris_-_Paris_XVII_%28FR75%29_-_2021-08-20_-_1.jpg',
      width: 960, height: 720,
    },
    // Même photographie, version originale, pour préserver l'attribution si le CDN miniature échoue.
    fallbackImage: { src: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Parvis_Tribunal_Paris_-_Paris_XVII_%28FR75%29_-_2021-08-20_-_1.jpg' },
    lieu: 'Photo d’illustration · Parvis du tribunal de Paris en 2021, hors audience',
    auteur: 'Chabe01',
    source: 'https://commons.wikimedia.org/wiki/File:Parvis_Tribunal_Paris_-_Paris_XVII_(FR75)_-_2021-08-20_-_1.jpg',
    licence: 'CC BY-SA 4.0', lienLicence: 'https://creativecommons.org/licenses/by-sa/4.0/',
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
    // Identifié dans IMAGES.zip / les +belles ; provenance recoupée avec Wikimedia Commons.
    image: {
      src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Abraham_Solomon_%28British_-_Waiting_for_the_Verdict_-_Google_Art_Project.jpg/960px-Abraham_Solomon_%28British_-_Waiting_for_the_Verdict_-_Google_Art_Project.jpg',
      width: 960, height: 793,
    },
    lieu: 'L’Attente du verdict, Abraham Solomon, 1859 · Tableau historique illustratif, sans lien avec une audience contemporaine',
    auteur: 'Abraham Solomon · J. Paul Getty Museum / Google Art Project',
    source: 'https://commons.wikimedia.org/wiki/File:Abraham_Solomon_(British_-_Waiting_for_the_Verdict_-_Google_Art_Project.jpg',
    licence: 'Domaine public',
    lienLicence: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  '/assises-quand-un-temoin-cite-manque/11/2026/': {
    image: croquisDelibere,
    croquis: true,
    lieu: 'Dossier judiciaire fermé sur un code',
    auteur: 'Illustration générée pour Intime Conviction',
    source: croquisDelibere.src,
    licence: 'Visuel créé pour Intime Conviction',
    lienLicence: croquisDelibere.src,
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

/**
 * Choix éditoriaux du dépôt privé, générés au build :
 * une seule photo choisie pour chaque article, jamais l'ensemble du ZIP.
 * Sans catalogue privé, conserver les illustrations déjà en service.
 */
try {
  const { readFileSync, existsSync } = await import('node:fs');
  const chemin = '.cache/photos-publiees.json';
  if (existsSync(chemin)) {
    const attributions = JSON.parse(readFileSync(chemin, 'utf8'));
    Object.assign(photosArticles, attributions);
  }
} catch (erreur) {
  throw new Error('Attributions photographiques invalides : ' + erreur.message);
}

// Les photographies attribuées à un article restent réservées à celui-ci.
// Le repli générique ne doit pas réutiliser une photographie éditoriale.
const illustrationsArticle = [
  {
    image: photoCodePenal1810,
    lieu: 'Page de titre du Code pénal de 1810, édition de Bruxelles · Illustration d’archives',
    auteur: 'Gambier · Numérisation Google via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Code_p%C3%A9nal_(Gambier,_1810).pdf',
    licence: 'Domaine public',
    lienLicence: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  ...[photoCode, croquisCodeRosiers, croquisDelibere, croquisAudienceSarah, croquisHeaulme].map(image => ({
    ...illustrationNeutre, image, source: image.src, lienLicence: image.src,
    lieu: image === photoCode || image === croquisCodeRosiers
      ? 'Code de procédure pénale · Illustration générée pour Intime Conviction'
      : illustrationNeutre.lieu,
  })),
];

export function photoPourArticle(data, imagesDejaVues = new Set()) {
  const photo = photosArticles[data.chemin];
  if (photo && (!photo.croquis || !imagesDejaVues.has(photo.image.src))) return photo;
  const index = Array.from(data.chemin).reduce((total, caractere) => total + caractere.codePointAt(0), 0)
    % illustrationsArticle.length;
  const choix = [...illustrationsArticle.slice(index), ...illustrationsArticle.slice(0, index)];
  return choix.find(illustration => !imagesDejaVues.has(illustration.image.src)) ?? photo ?? choix[0];
}
