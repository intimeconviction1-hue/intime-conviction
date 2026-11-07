// Annuaire d'ORIENTATION des départements et des villes-sièges habituelles des assises.
// Données factuelles géographiques (non reprises comme texte, carte ou base propriétaire).
// Les adresses et dates d'audience doivent être confirmées auprès du Ministère de la justice.
// 70 et 90 dépendent de la même cour, située à Vesoul.
const TABLE = `
01|Ain|Bourg-en-Bresse
02|Aisne|Laon
03|Allier|Moulins
04|Alpes-de-Haute-Provence|Digne-les-Bains
05|Hautes-Alpes|Gap
06|Alpes-Maritimes|Nice
07|Ardèche|Privas
08|Ardennes|Charleville-Mézières
09|Ariège|Foix
10|Aube|Troyes
11|Aude|Carcassonne
12|Aveyron|Rodez
13|Bouches-du-Rhône|Aix-en-Provence
14|Calvados|Caen
15|Cantal|Aurillac
16|Charente|Angoulême
17|Charente-Maritime|Saintes
18|Cher|Bourges
19|Corrèze|Tulle
2A|Corse-du-Sud|Ajaccio
2B|Haute-Corse|Bastia
21|Côte-d’Or|Dijon
22|Côtes-d’Armor|Saint-Brieuc
23|Creuse|Guéret
24|Dordogne|Périgueux
25|Doubs|Besançon
26|Drôme|Valence
27|Eure|Évreux
28|Eure-et-Loir|Chartres
29|Finistère|Quimper
30|Gard|Nîmes
31|Haute-Garonne|Toulouse
32|Gers|Auch
33|Gironde|Bordeaux
34|Hérault|Montpellier
35|Ille-et-Vilaine|Rennes
36|Indre|Châteauroux
37|Indre-et-Loire|Tours
38|Isère|Grenoble
39|Jura|Lons-le-Saunier
40|Landes|Mont-de-Marsan
41|Loir-et-Cher|Blois
42|Loire|Saint-Étienne
43|Haute-Loire|Le Puy-en-Velay
44|Loire-Atlantique|Nantes
45|Loiret|Orléans
46|Lot|Cahors
47|Lot-et-Garonne|Agen
48|Lozère|Mende
49|Maine-et-Loire|Angers
50|Manche|Coutances
51|Marne|Reims
52|Haute-Marne|Chaumont
53|Mayenne|Laval
54|Meurthe-et-Moselle|Nancy
55|Meuse|Bar-le-Duc
56|Morbihan|Vannes
57|Moselle|Metz
58|Nièvre|Nevers
59|Nord|Douai
60|Oise|Beauvais
61|Orne|Alençon
62|Pas-de-Calais|Saint-Omer
63|Puy-de-Dôme|Riom
64|Pyrénées-Atlantiques|Pau
65|Hautes-Pyrénées|Tarbes
66|Pyrénées-Orientales|Perpignan
67|Bas-Rhin|Strasbourg
68|Haut-Rhin|Colmar
69|Rhône|Lyon
70|Haute-Saône|Vesoul
71|Saône-et-Loire|Chalon-sur-Saône
72|Sarthe|Le Mans
73|Savoie|Chambéry
74|Haute-Savoie|Annecy
75|Paris|Paris
76|Seine-Maritime|Rouen
77|Seine-et-Marne|Melun
78|Yvelines|Versailles
79|Deux-Sèvres|Niort
80|Somme|Amiens
81|Tarn|Albi
82|Tarn-et-Garonne|Montauban
83|Var|Draguignan
84|Vaucluse|Avignon
85|Vendée|La Roche-sur-Yon
86|Vienne|Poitiers
87|Haute-Vienne|Limoges
88|Vosges|Épinal
89|Yonne|Auxerre
90|Territoire de Belfort|Vesoul
91|Essonne|Évry-Courcouronnes
92|Hauts-de-Seine|Nanterre
93|Seine-Saint-Denis|Bobigny
94|Val-de-Marne|Créteil
95|Val-d’Oise|Pontoise
971|Guadeloupe|Basse-Terre
972|Martinique|Fort-de-France
973|Guyane|Cayenne
974|La Réunion|Saint-Denis
976|Mayotte|Mamoudzou`.trim();

export const ANNUAIRE_OFFICIEL = 'https://www.justice.gouv.fr/annuaire/juridictions-judiciaires';
export const NOTICE_DATE = '2026-11-07';

export const DEPARTEMENTS_ASSISES = Object.freeze(TABLE.split('\n').map(line => {
  const [code, departement, ville] = line.split('|');
  return Object.freeze({
    code, departement, ville,
    courPartagee: code === '70' || code === '90',
    outreMer: /^97/.test(code),
  });
}));

export const ETAPES_ASSISES = Object.freeze([
  { titre: 'Le renvoi devant une juridiction criminelle', texte: 'Après l’instruction, une décision de mise en accusation peut renvoyer la personne devant la juridiction compétente. Cette étape ne préjuge pas de sa culpabilité.' },
  { titre: 'La préparation du procès', texte: 'La juridiction organise les débats, la comparution des parties, des témoins et des experts. Une réunion préparatoire peut servir à fixer le programme.' },
  { titre: 'Le tirage au sort des jurés', texte: 'Devant les assises de droit commun, le jury est constitué en audience. Certaines personnes peuvent être récusées selon les règles de procédure.' },
  { titre: 'L’ouverture et la présentation des accusations', texte: 'Les faits reprochés et les éléments du dossier sont exposés contradictoirement. L’accusé bénéficie de la présomption d’innocence.' },
  { titre: 'La parole de l’accusé', texte: 'Le président interroge l’accusé, qui peut répondre, donner sa version et exercer son droit au silence.' },
  { titre: 'Les témoins et les experts', texte: 'Les témoignages, constatations et analyses sont discutés à l’audience. Les parties peuvent faire préciser ou contester les éléments présentés.' },
  { titre: 'Les parties civiles', texte: 'Les victimes constituées parties civiles peuvent exposer leur préjudice et faire valoir leurs demandes dans le cadre prévu par la loi.' },
  { titre: 'Les plaidoiries et les réquisitions', texte: 'Les avocats des parties civiles présentent leurs demandes, le ministère public prononce ses réquisitions, puis la défense plaide. Les modalités précises dépendent de l’audience.' },
  { titre: 'Le dernier mot', texte: 'Avant la clôture des débats, la parole est donnée une dernière fois à l’accusé.' },
  { titre: 'Le délibéré', texte: 'La cour se retire pour délibérer. Le contenu des échanges et des votes est couvert par le secret.' },
  { titre: 'Le verdict et la motivation', texte: 'La décision est annoncée publiquement. Elle précise notamment la culpabilité ou l’acquittement et, le cas échéant, la peine et les motifs prévus par le droit.' },
  { titre: 'L’appel et les autres recours', texte: 'Une décision de première instance peut être contestée dans les délais applicables. L’appel et le pourvoi en cassation n’ont pas la même fonction.' },
]);

export const ACTEURS_ASSISES = Object.freeze([
  {nom:'Le président', fonction:'Dirige les débats, veille au respect de la procédure et permet la confrontation des versions.'},
  {nom:'Les assesseurs', fonction:'Deux magistrats professionnels siègent avec le président de la cour d’assises de droit commun.'},
  {nom:'Les jurés', fonction:'Citoyens tirés au sort qui entendent les débats et participent aux décisions avec les magistrats.'},
  {nom:'L’avocat général', fonction:'Représente le ministère public et soutient ses réquisitions. Il ne représente pas les victimes.'},
  {nom:'Le greffier', fonction:'Garantit la régularité des actes de greffe et leur traçabilité pendant l’audience.'},
  {nom:'L’accusé et son avocat', fonction:'La personne jugée bénéficie de la présomption d’innocence, de droits de la défense et de l’assistance d’un avocat.'},
  {nom:'La partie civile', fonction:'Une victime ou un ayant droit peut faire valoir ses intérêts et demander réparation, avec ou sans avocat selon le cadre applicable.'},
  {nom:'Les témoins et experts', fonction:'Apportent des éléments de connaissance soumis aux questions et à la discussion des parties.'},
]);

export const LEXIQUE_ASSISES = Object.freeze([
  ['Accusé','Personne renvoyée devant une juridiction criminelle pour être jugée. Sa culpabilité n’est pas établie du seul fait du renvoi.'],
  ['Acquittement','Décision qui ne retient pas la culpabilité de l’accusé pour les faits jugés.'],
  ['Appel','Recours permettant un nouvel examen de l’affaire dans les conditions prévues par la loi.'],
  ['Assesseur','Magistrat qui siège aux côtés du président de la juridiction.'],
  ['Cour criminelle départementale','Juridiction composée de magistrats professionnels et compétente pour certains crimes dans les conditions prévues par la loi.'],
  ['Délibéré','Phase de discussion et de vote précédant la décision, protégée par le secret.'],
  ['Feuille de motivation','Document exposant les principaux éléments ayant fondé la décision de la cour.'],
  ['Greffe','Service qui assure le suivi des actes, documents et formalités de la juridiction.'],
  ['Huis clos','Audience dont le public est exclu par application de règles légales précises.'],
  ['Intime conviction','Principe selon lequel les juges et jurés apprécient les éléments débattus sans barème de preuve prédéterminé, dans le cadre de la loi.'],
  ['Juré','Citoyen tiré au sort qui participe au jugement aux côtés des magistrats.'],
  ['Mise en accusation','Décision renvoyant une personne devant une juridiction criminelle pour qu’elle soit jugée.'],
  ['Partie civile','Personne qui demande réparation d’un préjudice lié à l’infraction poursuivie.'],
  ['Plaidoirie','Intervention de l’avocat qui présente les arguments d’une partie.'],
  ['Pourvoi en cassation','Recours portant principalement sur la conformité de la décision au droit, et non sur un troisième jugement complet des faits.'],
  ['Présomption d’innocence','Toute personne poursuivie reste présumée innocente tant que sa culpabilité n’a pas été légalement établie.'],
  ['Récusation','Possibilité d’écarter certains jurés tirés au sort dans les limites fixées par la procédure.'],
  ['Réquisitions','Position et demandes du ministère public à l’audience.'],
  ['Rôle d’audience','Liste des affaires dont l’examen est programmé devant une juridiction.'],
  ['Verdict','Décision prononcée à l’issue des débats et du délibéré.'],
]);

export function normaliserRecherche(s = '') {
  return String(s).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function trouverDepartements(recherche = '') {
  const q = normaliserRecherche(recherche).trim();
  return DEPARTEMENTS_ASSISES.filter(d =>
    [d.code,d.departement,d.ville].some(v => normaliserRecherche(v).includes(q))
  );
}

export function validerAnnuaire() {
  const codes = new Set(DEPARTEMENTS_ASSISES.map(d => d.code));
  if (codes.size !== DEPARTEMENTS_ASSISES.length || codes.size !== 101) throw new Error('Annuaire: 101 départements attendus.');
  if (DEPARTEMENTS_ASSISES.filter(d=>d.courPartagee).map(d=>d.code).join(',') !== '70,90') throw new Error('Cour commune 70/90 à vérifier');
  if (DEPARTEMENTS_ASSISES.find(d=>d.code==='70').ville!==DEPARTEMENTS_ASSISES.find(d=>d.code==='90').ville) throw new Error('La cour 70/90 ne coïncide pas.');
  if (ETAPES_ASSISES.length !== 12 || LEXIQUE_ASSISES.length < 18) throw new Error('Données pédagogiques incomplètes.');
  return true;
}
