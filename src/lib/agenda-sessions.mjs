// Sessions annoncées sur des pages officielles consultées le 7 novembre 2026.
// Une session n'est ni une audience individuelle, ni une confirmation de
// déroulement. Ne jamais déduire les identités, chefs d'accusation ou verdicts.
export const DATE_CONTROLE_AGENDA = '2026-11-07';
// « verifieLe » = date de consultation éditoriale du signalement,
// et NON confirmation de tenue d'une audience individuelle.
// « publieLe » = date de mise à jour affichée par la source, lorsqu'elle est connue.
export const SESSIONS_AGENDA = Object.freeze([
  {
    id:'toulouse-2026-11-09',ville:'Toulouse',departement:'Haute-Garonne',
    juridiction:'Cour d’assises et cour criminelle départementale',
    debut:'2026-11-09',fin:'2026-11-19',
    libelle:'Session 17, assises et cour criminelle départementale',
    source:'https://www.cours-appel.justice.fr/toulouse/roles-des-cours-dassises-et-de-la-cour-criminelle-departementale-de-la-haute-garonne'
  },
  {
    id:'toulouse-2026-11-23',ville:'Toulouse',departement:'Haute-Garonne',
    juridiction:'Cour d’assises',debut:'2026-11-23',fin:'2026-12-04',
    libelle:'Session 18, cour d’assises',
    source:'https://www.cours-appel.justice.fr/toulouse/roles-des-cours-dassises-et-de-la-cour-criminelle-departementale-de-la-haute-garonne'
  },
  {
    id:'toulouse-2026-12-07',ville:'Toulouse',departement:'Haute-Garonne',
    juridiction:'Cour d’assises et cour criminelle départementale',
    debut:'2026-12-07',fin:'2026-12-18',
    libelle:'Session 19, assises et cour criminelle départementale',
    source:'https://www.cours-appel.justice.fr/toulouse/roles-des-cours-dassises-et-de-la-cour-criminelle-departementale-de-la-haute-garonne'
  },
  {
    id:'chambery-assises-2026-11-16',
    ville:'Chambéry',departement:'Savoie',
    juridiction:'Cour d’assises de la Savoie',
    debut:'2026-11-16',fin:'2026-11-27',
    libelle:'Session d’assises du 16 au 27 novembre 2026, annoncée sur la page de la juridiction',
    source:'https://www.cours-appel.justice.fr/chambery/la-cour-dassises-de-la-savoie'
  },
  {
    id:'besancon-ccd-2026-12-07',ville:'Besançon',departement:'Doubs',
    juridiction:'Cour criminelle départementale du Doubs',
    debut:'2026-12-07',fin:'2026-12-18',
    libelle:'Session de la cour criminelle départementale, dates affichées par la cour d’appel de Besançon',
    source:'https://www.cours-appel.justice.fr/besancon/prochaines-sessions'
  },
  {
    id:'lyon-2026-11-23',ville:'Lyon',departement:'Rhône',
    juridiction:'Cour d’assises et cour criminelle départementale',
    debut:'2026-11-23',fin:'2026-12-18',
    libelle:'Session d’assises et de cour criminelle, période indiquée au rôle',
    source:'https://www.cours-appel.justice.fr/lyon/la-cour-dassises-du-rhone'
  },
  {
    id:'lyon-2026-12-07',ville:'Lyon',departement:'Rhône',
    juridiction:'Cour d’assises et cour criminelle départementale',
    debut:'2026-12-07',fin:'2026-12-18',
    libelle:'11e session d’assises et de cour criminelle',
    source:'https://www.cours-appel.justice.fr/lyon/la-cour-dassises-du-rhone'
  }
]);

// Date civile dans le fuseau où se trouvent les juridictions métropolitaines.
// Calculée à la construction de la page, indépendamment de la date de contrôle des sources.
export function dateLocaleAgenda(instant=new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Europe/Paris'
  }).format(instant);
}

// Sources pertinentes dont les dates précises ne sont PAS publiables dans l'agenda
// tant que le rôle modificatif ou le PDF n'a pas été effectivement contrôlé.
export const SOURCES_A_COMPLETER = Object.freeze([
  {code:'19-23-87',ressort:'Ressort de Limoges (Corrèze, Creuse, Haute-Vienne)',statut:'Deux rôles d’assises d’octobre 2026, initial et modificatif, référencés. PDF non lus : différences et dates d’audience non établies.',
    source:'https://www.cours-appel.justice.fr/limoges/activite-des-cours-dassises-et-des-cours-criminelles-departementales'},
  {code:'01',ressort:'Ain',statut:'Rôle de décembre 2026 disponible ; dates exactes à relever dans le document',
    source:'https://www.cours-appel.justice.fr/lyon/la-cour-dassises-de-lain'},
  {code:'33',ressort:'Gironde',statut:'Rôle publié ; dates exactes à relever dans le document',
    source:'https://www.cours-appel.justice.fr/bordeaux/roles-des-cours-dassises'},
  {code:'42',ressort:'Loire',statut:'Rôle publié ; dates exactes à relever dans le document',
    source:'https://www.cours-appel.justice.fr/lyon/la-cour-dassises-de-la-loire'},
  {code:'72',ressort:'Sarthe',statut:'Rôle modificatif d’assises (novembre-décembre 2026) et rôle de cour criminelle (1re session 2027) référencés. Documents non consultés : dates non confirmées.',
    source:'https://www.cours-appel.justice.fr/angers/la-cour-dassises-de-la-sarthe'}
]);

// Dates d'affaires mentionnées dans le calendrier HTML de la cour d'appel de Rennes
// (Finistère, MAJ indiquée 08/06/2026 ; Ille-et-Vilaine, 16/09/2026).
// Au contrôle du 07/11/2026, les pages directes renvoient une maintenance :
// NE PAS présenter ces audiences comme reconfirmées auprès du greffe.
// Sélection excluant les audiences de la cour d'assises des mineurs.
export const AUDIENCES_A_RECONFIRMER = Object.freeze([
  {id:'finistere-2026-11-12',debut:'2026-11-12',fin:'2026-11-13',
    ville:'Quimper',departement:'Finistère',juridiction:'Cour d’assises',
    objet:'Viol commis par une personne étant ou ayant été conjoint, concubin ou partenaire',
    source:'https://www.cours-appel.justice.fr/rennes/cour-dassises-et-cour-criminelle-departementale-du-finistere'},
  {id:'finistere-2026-11-23',debut:'2026-11-23',fin:'2026-11-24',
    ville:'Quimper',departement:'Finistère',juridiction:'Cour criminelle départementale',
    objet:'Non-dénonciation de crime ; viol incestueux commis sur un mineur par un ascendant majeur',
    source:'https://www.cours-appel.justice.fr/rennes/cour-dassises-et-cour-criminelle-departementale-du-finistere'},
  {id:'finistere-2026-12-14',debut:'2026-12-14',fin:'2026-12-16',
    ville:'Quimper',departement:'Finistère',juridiction:'Cour statuant en appel',
    objet:'Viol commis par une personne étant ou ayant été conjoint, concubin ou partenaire',
    source:'https://www.cours-appel.justice.fr/rennes/cour-dassises-et-cour-criminelle-departementale-du-finistere'},
  {id:'ille-et-vilaine-2026-11-24',debut:'2026-11-24',fin:'2026-11-26',
    ville:'Rennes',departement:'Ille-et-Vilaine',juridiction:'Cour criminelle départementale',
    objet:'Viol incestueux commis sur mineur de 15 ans par un ascendant majeur',
    source:'https://www.cours-appel.justice.fr/rennes/cour-dassises-et-la-cour-criminelle-departementale-dille-et-vilaine'},
  {id:'ille-et-vilaine-2026-11-27',debut:'2026-11-27',fin:'2026-11-30',
    ville:'Rennes',departement:'Ille-et-Vilaine',juridiction:'Cour d’assises',
    objet:'Viol incestueux commis sur mineur de 15 ans par un ascendant ou une personne ayant autorité',
    source:'https://www.cours-appel.justice.fr/rennes/cour-dassises-et-la-cour-criminelle-departementale-dille-et-vilaine'},
  {id:'ille-et-vilaine-2026-12-01',debut:'2026-12-01',fin:'2026-12-04',
    ville:'Rennes',departement:'Ille-et-Vilaine',juridiction:'Cour d’assises',
    objet:'Viol commis sur mineur de 15 ans par un ascendant',
    source:'https://www.cours-appel.justice.fr/rennes/cour-dassises-et-la-cour-criminelle-departementale-dille-et-vilaine'},
  {id:'finistere-2026-12-17',debut:'2026-12-17',fin:'2026-12-18',
    ville:'Quimper',departement:'Finistère',juridiction:'Cour statuant en appel',
    objet:'Viol commis sur un mineur de 15 ans et corruption de mineur',
    source:'https://www.cours-appel.justice.fr/rennes/cour-dassises-et-cour-criminelle-departementale-du-finistere'}
]);

// Traçabilité prudente : ne pas fabriquer de date de publication d'un rôle.
// Les périodes de session proviennent d'annonces institutionnelles examinées
// le 7 novembre 2026 ; l'audience elle-même n'est pas reconfirmée.
export const PROVENANCE_AGENDA = Object.freeze({
  dateExamen:'2026-11-07',
  sessions:{niveau:'Période de session annoncée',publicationSource:null},
  finistere:{niveau:'Audience inscrite à un calendrier ancien, maintien non reconfirmé',publicationSource:'2026-06-08'},
  illeEtVilaine:{niveau:'Audience inscrite à un calendrier ancien, maintien non reconfirmé',publicationSource:'2026-09-16'}
});
export function provenancePeriode(entree){
  if(SESSIONS_AGENDA.some(s=>s.id===entree.id))return PROVENANCE_AGENDA.sessions;
  if(entree.departement==='Finistère')return PROVENANCE_AGENDA.finistere;
  if(entree.departement==='Ille-et-Vilaine')return PROVENANCE_AGENDA.illeEtVilaine;
  throw Error('Provenance inconnue pour cette période');
}

// Les URL des rôles restent dans les données pour documenter les dates publiées.
// Les liens destinés aux lecteurs utilisent les fiches de contact de Service Public.
const CONTACTS_COURS_APPEL = {
  angers:'pays-de-la-loire/maine-et-loire/f945ac4e-ef2f-4cb3-bd14-f91b95bf8446',
  besancon:'bourgogne-franche-comte/doubs/4b2d9b23-2a84-4cbe-8afe-5f6fd0fcc014',
  bordeaux:'nouvelle-aquitaine/gironde/5c978bd4-b1be-451e-aaaf-a7633dc91c3d',
  caen:'normandie/calvados/25087a2e-60f8-4d39-b999-de1388b483f5',
  chambery:'auvergne-rhone-alpes/savoie/64ef305a-8548-4c63-8800-38e83c807df9',
  limoges:'nouvelle-aquitaine/haute-vienne/3741a011-59c3-460a-8d80-578a6075a0d5',
  lyon:'auvergne-rhone-alpes/rhone/6614b495-76b5-401d-8937-0c6e804279fd',
  rennes:'bretagne/ille-et-vilaine/88acf439-b5b6-4233-8d26-284651bf49ba',
  rouen:'normandie/seine-maritime/e5dbae83-ffca-4003-9781-0ae3c464514d',
  'saint-denis':'la-reunion/reunion/8114c644-9f2c-4144-9aba-cf473e1c7433',
  toulouse:'occitanie/haute-garonne/1963e2c7-037d-4d78-808c-43dcc493bad3'
};

export function contactCourAppel(source) {
  const cour = new URL(source).pathname.split('/')[1];
  const fiche = CONTACTS_COURS_APPEL[cour];
  return fiche ? `https://lannuaire.service-public.gouv.fr/${fiche}` : '/annuaire/';
}

export function sessionsAvenir(sessions, dateISO) {
  return [...sessions].filter(s=>s.fin>=dateISO).sort((a,b)=>a.debut.localeCompare(b.debut)||a.ville.localeCompare(b.ville,'fr'));
}
export function verifierSessions(sessions=SESSIONS_AGENDA) {
  const ids=new Set();
  for(const s of sessions) {
    if(ids.has(s.id))throw Error('Session dupliquée');
    ids.add(s.id);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(s.debut)||!/^\d{4}-\d{2}-\d{2}$/.test(s.fin)||s.debut>s.fin)throw Error('Période de session invalide');
    const u=new URL(s.source);
    if(u.protocol!=='https:'||u.hostname!=='www.cours-appel.justice.fr')throw Error('Source non institutionnelle');
    if(!s.ville||!s.departement||!s.libelle||!s.juridiction)throw Error('Session incomplète');
  }
  return true;
}
