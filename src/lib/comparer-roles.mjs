/**
 * Comparaison de deux relevés SAISIS ET VÉRIFIÉS manuellement à partir de rôles officiels.
 * Les résultats sont des écarts documentaires, jamais des décisions de justice,
 * des annulations, des reports ou une confirmation de tenue d'audience.
 *
 * Format de chaque relevé :
 * {
 *   "source": "https://www.cours-appel.justice.fr/...",
 *   "document": "Intitulé exact du rôle",
 *   "version": "date ou identifiant explicitement indiqué sur le document",
 *   "releveLe": "2026-11-07",
 *   "entrees": [{"id":"reference-stable-du-role","debut":"2026-11-23","fin":"2026-11-24","juridiction":"Cour d’assises"}]
 * }
 *
 * Un id doit permettre de reconnaître la même entrée sur les deux documents,
 * sans déduire une identité de personnes ni fabriquer de rapprochement.
 */
const DATE=/^\d{4}-\d{2}-\d{2}$/;
const CHAMPS=['debut','fin','juridiction','libelle'];
const HOTE='www.cours-appel.justice.fr';
function dateCorrecte(v){
  if(typeof v!=='string'||!DATE.test(v))return false;
  const d=new Date(v+'T12:00:00Z');
  return !Number.isNaN(d.valueOf())&&d.toISOString().slice(0,10)===v;
}
export function validerReleve(releve){
  if(!releve||typeof releve!=='object'||Array.isArray(releve))throw Error('Relevé documentaire requis');
  let u;
  try{u=new URL(releve.source);}catch{throw Error('Adresse de source officielle manquante');}
  if(u.protocol!=='https:'||u.hostname!==HOTE||u.username||u.password)throw Error('Source non institutionnelle');
  if(!releve.document?.trim()||!releve.version?.trim())throw Error('Référence et version du document obligatoires');
  if(!dateCorrecte(releve.releveLe))throw Error('Date de relevé invalide');
  if(!Array.isArray(releve.entrees))throw Error('Entrées documentaires requises');
  const ids=new Set();
  for(const e of releve.entrees){
    if(!e||typeof e.id!=='string'||!e.id.trim()||ids.has(e.id))throw Error('Identifiant manquant ou dupliqué');
    ids.add(e.id);
    if(!dateCorrecte(e.debut)||!dateCorrecte(e.fin)||e.debut>e.fin)throw Error('Date documentaire invalide');
    if(typeof e.juridiction!=='string'||!e.juridiction.trim())throw Error('Juridiction manquante');
    if(e.libelle!==undefined&&typeof e.libelle!=='string')throw Error('Libellé invalide');
  }
  return true;
}
export function comparerReleves(avant,apres){
  validerReleve(avant);validerReleve(apres);
  if(new URL(avant.source).pathname!==new URL(apres.source).pathname)throw Error('Les relevés doivent provenir de la même page source');
  const vieux=new Map(avant.entrees.map(x=>[x.id,x]));
  const nouveau=new Map(apres.entrees.map(x=>[x.id,x]));
  const ajouts=apres.entrees.filter(x=>!vieux.has(x.id));
  const absences=avant.entrees.filter(x=>!nouveau.has(x.id));
  const changements=[];
  for(const e of apres.entrees){
    const precedent=vieux.get(e.id);
    if(!precedent)continue;
    const champs=CHAMPS.filter(champ=>(precedent[champ]??'')!==(e[champ]??''))
      .map(champ=>({champ,avant:precedent[champ]??null,apres:e[champ]??null}));
    if(champs.length)changements.push({id:e.id,champs});
  }
  return {
    source:apres.source,
    documents:{avant:avant.document,apres:apres.document},
    versions:{avant:avant.version,apres:apres.version},
    releves:{avant:avant.releveLe,apres:apres.releveLe},
    ajouts,absences,changements,
    note:'Écarts entre relevés documentaires. Une absence ne prouve ni annulation ni report. Un changement de date ne prouve pas la tenue de l’audience. Confirmation humaine auprès du greffe requise.'
  };
}
