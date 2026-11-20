#!/usr/bin/env node
// Rapport interne non destructif sur les articles originaux de la rédaction.
// Compte les dates de publication déclarées, pas les commits ni les retouches.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Indicateurs de relecture, non automates de réécriture : ils signalent, sans trancher, les textes à revoir.
export function alertesEcriture(article) {
  const a=article.data ?? article;
  if (!/^rédaction d[’']intime conviction$/iu.test(String(a.auteur??'').trim())) return [];
  const html=String(a.html??'');
  const prose=html.replace(/<h2[^>]*>Sources(?: et vérification)?<\/h2>[\s\S]*$/i,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  const avis=[];
  const date=new Date(a.date);
  if (!Number.isFinite(date.getTime()) || date.getFullYear()<2026) return [];
  const titre=String(a.titre??'').trim();
  if (titre.length<28 || titre.length>115) avis.push('titre_a_revoir');
  if (!String(a.extrait??'').trim()) avis.push('chapo_absent');
  const media=(prose.match(/(?:selon (?:le |la |les |un |une )?|rapporte(?:nt)? |d'après |nos confrères|le quotidien|le journal indique)/gi)||[]).length;
  const mots=prose.split(/\s+/).filter(Boolean).length;
  if (mots>250 && media>=5 && media/mots>0.006) avis.push('attributions_medias_envahissantes');
  const successions=(html.match(/<h2[^>]*>(?:Mise à jour|Actualisation|\d{1,2} novembre 2026)/gi)||[]).length;
  if (successions>=3) avis.push('empilement_actualisations');
  if (/(?:verdict attendu|doit désormais (?:juger|statuer)|aucun verdict n'a été prononcé)/i.test(prose) && /(?:verdict du |condamn(?:é|ée|és|ées) à |a acquitté)/i.test(prose)) avis.push('chronologie_a_relire');
  if (!/<h2[^>]*>Sources(?: et vérification)?<\/h2>|<h2[^>]*>Source<\/h2>/i.test(html)) avis.push('sources_a_verifier');
  return avis;
}

export function bilanEditorial(articles, { jours = 7, dateReference = new Date() } = {}) {
  if (!Number.isInteger(jours) || jours < 1 || jours > 366) throw Error('Nombre de jours invalide');
  const dateParis = new Intl.DateTimeFormat('en-CA', {
    timeZone:'Europe/Paris', year:'numeric', month:'2-digit', day:'2-digit'
  });
  const borne = dateParis.format(dateReference);
  const parJour = new Map();
  for(let i=0;i<jours;i++) {
    const d=new Date(borne+'T12:00:00Z');
    d.setUTCDate(d.getUTCDate()-i);
    parJour.set(d.toISOString().slice(0,10),[]);
  }
  const anomalies = [];
  const identifiants = new Set();
  const titresParJour = new Map();
  for(const a of articles) {
    const data=a.data ?? a;
    if (!/^rédaction d[’']intime conviction$/iu.test(String(data.auteur ?? '').trim())) continue;
    const date = new Date(data.date);
    if (!Number.isFinite(date.getTime())) { anomalies.push({code:'date_invalide'});continue; }
    if (date > dateReference || data.verificationEnCours === true) continue;
    const jour = dateParis.format(date);
    if (!parJour.has(jour)) continue;
    const id=String(data.chemin ?? data.slug ?? a.fichier ?? '').trim();
    if (!id || identifiants.has(id)) { anomalies.push({code:'identifiant_absent_ou_duplique',jour});continue; }
    identifiants.add(id);
    const titre=String(data.titre??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
    const cle=jour+'|'+titre;
    if (!titre || titresParJour.has(cle)) {
      anomalies.push({code:'titre_absent_ou_identique',jour});
      continue;
    }
    titresParJour.set(cle,id);
    parJour.get(jour).push(true);
  }
  const alertesStylistiques=articles.flatMap(a=>alertesEcriture(a).map(code=>({code, fichier:a.fichier??a.data?.slug??a.slug??'inconnu'})));
  return {
    objectifQuotidien:5,
    alertesStylistiques,
    jours:[...parJour].map(([date,publications])=>({
      date, nombre:publications.length, jourEnCours:date===borne,
      manque:date===borne ? null : Math.max(0,5-publications.length)
    })),
    anomalies,
    note:'Comptage basé sur la date déclarée des articles signés par la rédaction. Ne prouve pas la date effective de mise en ligne ni l’originalité du texte. Les actualisations d’un fichier existant ne deviennent pas de nouveaux articles. Les alertes stylistiques demandent une relecture humaine et ne prouvent pas une erreur.'
  };
}

async function collecter(racine) {
  const fichiers=[];
  async function parcourir(dir){
    for(const e of await readdir(dir,{withFileTypes:true})){
      const p=join(dir,e.name);
      if(e.isDirectory()) await parcourir(p);
      else if(e.isFile()&&p.endsWith('.json')) fichiers.push(p);
    }
  }
  await parcourir(racine);
  const articles=[];
  for(const fichier of fichiers) {
    try {articles.push({data:JSON.parse(await readFile(fichier,'utf8')),fichier});}
    catch(e){articles.push({data:{auteur:'Rédaction d’Intime Conviction',date:'invalid'},fichier});}
  }
  return articles;
}

if(process.argv[1] && fileURLToPath(import.meta.url)===process.argv[1]) {
  const racine=process.env.IC_ARTICLES??'articles-prives/articles';
  const jours=Number(process.env.IC_AUDIT_JOURS??7);
  try {
    const resultat=bilanEditorial(await collecter(racine),{jours});
    const sortie=process.env.IC_AUDIT_PRODUCTION_OUTPUT;
    if(sortie){await mkdir(dirname(sortie),{recursive:true});await writeFile(sortie,JSON.stringify(resultat,null,2)+'\n');}
    console.log(JSON.stringify(resultat,null,2));
  } catch(e){console.error('Audit éditorial impossible : '+e.message);process.exitCode=1;}
}
