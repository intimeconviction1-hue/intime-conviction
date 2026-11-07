// Pages OFFICIELLES constatées le 7 novembre 2026.
// Ne pas copier les PDF, leurs données personnelles ni les transformer en audience confirmée.
// Les rôles évoluent ; ce registre donne un accès à l'éditeur institutionnel uniquement.
// Codes par département, pas un scraping automatique des audiences.

export const VERIFIE_LE = '2026-11-07';
const LIENS = [
  { codes:['01'],mode:'publication',ressort:'Ain',titre:'Sessions de la cour d’assises de l’Ain',url:'https://www.cours-appel.justice.fr/lyon/la-cour-dassises-de-lain',note:'Rôles 2026 en pièces jointes ; horaires à reconfirmer.' },
  { codes:['14'],mode:'information',ressort:'Calvados',titre:'Cour d’assises et cour criminelle du Calvados',url:'https://www.cours-appel.justice.fr/caen/la-cour-dassises-et-la-cour-criminelle-du-calvados',note:'Page pratique mentionnant les rôles, sans calendrier récent confirmé lors du relevé.' },
  { codes:['19','23','87'],mode:'ressort',ressort:'Corrèze, Creuse et Haute-Vienne',titre:'Activité des assises du ressort de Limoges',url:'https://www.cours-appel.justice.fr/limoges/activite-des-cours-dassises-et-des-cours-criminelles-departementales',note:'Page de ressort : rôles et sessions 2026, à vérifier pour chaque département.' },
  { codes:['25'],mode:'publication',ressort:'Doubs',titre:'Sessions criminelles du Doubs',url:'https://www.cours-appel.justice.fr/besancon/prochaines-sessions',note:'Rôle des assises de novembre 2026 annoncé dans la page institutionnelle.' },
  { codes:['39'],mode:'ressort',ressort:'Jura',titre:'Sessions du ressort de Besançon',url:'https://www.cours-appel.justice.fr/besancon/prochaines-sessions',note:'La page du ressort mentionne le Jura ; aucun rôle récent des assises du Jura confirmé lors du relevé.' },
  { codes:['70','90'],mode:'ressort',ressort:'Haute-Saône et Territoire de Belfort',titre:'Sessions de la cour commune à Vesoul',url:'https://www.cours-appel.justice.fr/besancon/prochaines-sessions',note:'La page présente des documents de 2026, sans garantie d’une session future.' },
  { codes:['27','76'],mode:'sur-place',ressort:'Eure et Seine-Maritime',titre:'Consultation des rôles au greffe / sur place',url:'https://www.cours-appel.justice.fr/rouen/roles-des-cours-dassises-et-des-cours-criminelles-departementales',note:'La cour indique une consultation sur place par les journalistes munis de leur carte de presse ; pas de mise en ligne publique du rôle.' },
  { codes:['31'],mode:'publication',ressort:'Haute-Garonne',titre:'Rôles des assises et de la cour criminelle de Haute-Garonne',url:'https://www.cours-appel.justice.fr/toulouse/roles-des-cours-dassises-et-de-la-cour-criminelle-departementale-de-la-haute-garonne',note:'Rôles anonymisés annoncés pour des sessions jusqu’en décembre 2026.' },
  { codes:['33'],mode:'publication',ressort:'Gironde',titre:'Rôles des cours d’assises de Gironde',url:'https://www.cours-appel.justice.fr/bordeaux/roles-des-cours-dassises',note:'Rôles anonymisés des assises et de la cour criminelle affichés sur la page officielle.' },
  { codes:['42'],mode:'publication',ressort:'Loire',titre:'Sessions de la cour d’assises de la Loire',url:'https://www.cours-appel.justice.fr/lyon/la-cour-dassises-de-la-loire',note:'Documents de sessions 2026, dont novembre et décembre, en pièces jointes.' },
  { codes:['69'],mode:'publication',ressort:'Rhône',titre:'Sessions de la cour d’assises du Rhône',url:'https://www.cours-appel.justice.fr/lyon/la-cour-dassises-du-rhone',note:'Documents de sessions 2026, dont novembre et décembre, en pièces jointes.' },
  { codes:['72'],mode:'publication',ressort:'Sarthe',titre:'Sessions de la cour d’assises de la Sarthe',url:'https://www.cours-appel.justice.fr/angers/la-cour-dassises-de-la-sarthe',note:'Rôle modificatif novembre/décembre 2026 ; vérifier les modifications ultérieures.' },
  { codes:['974'],mode:'publication',ressort:'La Réunion',titre:'Sessions de la cour d’assises de La Réunion',url:'https://www.cours-appel.justice.fr/saint-denis/cour-dassises-de-la-reunion',note:'Plusieurs rôles 2026 sont en pièces jointes ; sessions futures non garanties.' },
];

export const ROLES_OFFICIELS = Object.freeze(LIENS.flatMap(({codes,...r})=>codes.map(code=>Object.freeze({code,...r}))));
export const MODES_ROLES = Object.freeze({
 publication: 'Rôles publiés en ligne',
 ressort: 'Informations à l’échelle du ressort',
 information: 'Informations pratiques',
 'sur-place': 'Consultation sur place (journalistes)',
});

const index = new Map(ROLES_OFFICIELS.map(r => [r.code,r]));
export const roleParDepartement = code => index.get(String(code)) ?? null;
export const dossiersParDepartement = code => ({
 '25':[{slug:'affaire-pechier',titre:'Affaire Péchier'}],
 '30':[{slug:'viols-de-mazan',titre:'Procès des viols de Mazan : appel à Nîmes'}],
 '41':[{slug:'martyre-de-a10',titre:'Inass Touloub'}],
 '81':[{slug:'affaire-jubillar',titre:'Affaire Jubillar'}],
 '84':[{slug:'viols-de-mazan',titre:'Procès des viols de Mazan : première instance'}],
}[String(code)]??[]);

export function validerRoles(departements) {
  const codes = new Set(departements.map(d=>d.code));
  const vus = new Set();
  for(const r of ROLES_OFFICIELS){
    if(!codes.has(r.code)||vus.has(r.code))throw new Error('Département invalide ou répété');
    vus.add(r.code);
    if(!(r.mode in MODES_ROLES)||!r.note||!r.titre||!r.ressort)throw new Error('Métadonnées du rôle manquantes');
    let u;try{u=new URL(r.url);}catch{throw new Error('URL du rôle invalide');}
    if(u.protocol!=='https:'||u.hostname!=='www.cours-appel.justice.fr'||u.username||u.password||u.port||!u.pathname.startsWith('/'))throw new Error('Source officielle obligatoire');
  }
  for(const d of departements){for(const x of dossiersParDepartement(d.code)){if(!x.slug||!x.titre)throw new Error('Dossier associé incomplet');}}
  return true;
}
