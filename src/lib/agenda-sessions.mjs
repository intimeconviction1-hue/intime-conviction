// Sessions annoncées sur des pages officielles consultées le 7 novembre 2026.
// Une session n'est ni une audience individuelle, ni une confirmation de
// déroulement. Ne jamais déduire les identités, chefs d'accusation ou verdicts.
export const DATE_CONTROLE_AGENDA = '2026-11-07';
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
  {code:'01',ressort:'Ain',statut:'Rôle de décembre 2026 disponible ; dates exactes à relever dans le document',
    source:'https://www.cours-appel.justice.fr/lyon/la-cour-dassises-de-lain'},
  {code:'33',ressort:'Gironde',statut:'Rôle publié ; dates exactes à relever dans le document',
    source:'https://www.cours-appel.justice.fr/bordeaux/roles-des-cours-dassises'},
  {code:'42',ressort:'Loire',statut:'Rôle publié ; dates exactes à relever dans le document',
    source:'https://www.cours-appel.justice.fr/lyon/la-cour-dassises-de-la-loire'},
  {code:'72',ressort:'Sarthe',statut:'Publication institutionnelle à contrôler après maintenance',
    source:'https://www.cours-appel.justice.fr/angers/la-cour-dassises-de-la-sarthe'}
]);

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
