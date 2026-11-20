#!/usr/bin/env node
// Rapport interne non destructif sur les articles originaux de la rédaction.
// Compte les dates de publication déclarées, pas les commits ni les retouches.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
    if (!Number.isFinite(date.getTime())) { anomalies.push({code:'date_invalide',fichier:a.fichier??''});continue; }
    if (date > dateReference || data.verificationEnCours === true) continue;
    const jour = dateParis.format(date);
    if (!parJour.has(jour)) continue;
    const id=String(data.chemin ?? data.slug ?? a.fichier ?? '').trim();
    if (!id || identifiants.has(id)) { anomalies.push({code:'identifiant_absent_ou_duplique',jour,fichier:a.fichier??''});continue; }
    identifiants.add(id);
    const titre=String(data.titre??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
    const cle=jour+'|'+titre;
    if (!titre || titresParJour.has(cle)) anomalies.push({code:'titre_absent_ou_identique',jour,fichier:a.fichier??''});
    titresParJour.set(cle,id);
    parJour.get(jour).push({titre:data.titre,chemin:id});
  }
  return {
    objectifQuotidien:5,
    jours:[...parJour].map(([date,publications])=>({
      date, nombre:publications.length, manque:Math.max(0,5-publications.length),
      publications
    })),
    anomalies,
    note:'Comptage basé sur la date déclarée des articles signés par la rédaction. Ne prouve pas la date effective de mise en ligne ni l’originalité du texte. Les actualisations d’un fichier existant ne deviennent pas de nouveaux articles.'
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
