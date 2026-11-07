/**
 * Veille des liens de rôle et des sessions publiés par les cours d'appel.
 * Pas d'extraction du contenu des PDF, d'identités ni d'inférence d'audiences.
 * Détection: ajout/retrait de liens de documents et changement de leur libellé.
 * Un changement est une piste de vérification humaine, jamais une publication.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROLES_OFFICIELS } from '../src/lib/roles-officiels.mjs';

export const FICHIER_ETAT = '.github/roles-surveillance-state.json';
export const FICHIER_RAPPORT = '.cache/roles-surveillance-report.json';
export const FICHIER_ISSUE = '.cache/roles-surveillance-issue.md';
const HOTE_AUTORISE = 'www.cours-appel.justice.fr';
const EXTENSIONS = /\.(?:pdf|docx?|odt|rtf|xlsx?)$/i;
const MOTS_DOCUMENT = /(?:r[oô]le|role|session|assises?|criminell?e?|\bccd\b|audience)/iu;
const ENTITES = { amp:'&', quot:'"', apos:"'", nbsp:' ', lt:'<', gt:'>', eacute:'é', Eacute:'É', egrave:'è', agrave:'à', rsquo:'’', laquo:'«', raquo:'»', ndash:'–', mdash:'—' };

function decoder(s='') {
  return String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-zA-Z]+);/g, (match,v) => {
    if(v[0]==='#') {
      const n = v[1]?.toLowerCase()==='x' ? parseInt(v.slice(2),16) : parseInt(v.slice(1),10);
      return n>0 && n<=0x10ffff ? String.fromCodePoint(n):match;
    }
    return ENTITES[v] ?? match;
  });
}

function texteHumain(s='') {
  return decoder(s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()).replace(/\s+/g,' ').slice(0,180);
}

function normaliserUrl(href, baseUrl) {
  let u;
  try { u=new URL(decoder(href),baseUrl); }catch { return null; }
  if(u.protocol!=='https:' || u.hostname!==HOTE_AUTORISE || u.username || u.password || u.port) return null;
  if(!EXTENSIONS.test(u.pathname))return null;
  u.search='';u.hash='';
  return u.href;
}

/** Les liens documentaires sont extraits de leur page institutionnelle, sans télécharger les PDF. */
export function extraireDocuments(html, baseUrl, mode='publication') {
  if(typeof html!=='string')throw new TypeError('HTML requis');
  const docs = new Map();
  const ancres=/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi;
  for(const match of html.matchAll(ancres)) {
    const attr=match[1].match(/(?:^|\s)href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    if(!attr)continue;
    const lien=normaliserUrl(attr[1]??attr[2]??attr[3],baseUrl);
    if(!lien)continue;
    const url=new URL(lien);
    let nom='';
    try{nom=decodeURIComponent(url.pathname.split('/').at(-1) || 'Document');}catch{nom=url.pathname.split('/').at(-1)||'Document';}
    const libelle=texteHumain(match[2]);
    if(mode!=='publication' && !MOTS_DOCUMENT.test(libelle+' '+nom))continue;
    let titre=libelle && !/^(téléchargement|telechargement|download|pdf|voir|lien)(?:\\s|$)/i.test(libelle) ? libelle:nom;
    titre=titre.replace(/[\r\n\t]/g,' ').replace(/\s+/g,' ').trim().slice(0,160);
    if(!titre)titre='Document de session';
    // Deux liens vers un même document ne sont pas deux nouvelles audiences.
    if(!docs.has(lien))docs.set(lien,{url:lien,titre});
  }
  return [...docs.values()].sort((a,b)=>a.url.localeCompare(b.url));
}

export function differencier(avant=[],apres=[]) {
  const old=new Map(avant.map(d=>[d.url,d]));
  const recent=new Map(apres.map(d=>[d.url,d]));
  return {
    ajouts:apres.filter(d=>!old.has(d.url)),
    retraits:avant.filter(d=>!recent.has(d.url)),
    renommes:apres.filter(d=>old.has(d.url)&&old.get(d.url).titre!==d.titre)
      .map(d=>({avant:old.get(d.url),apres:d})),
  };
}

/** Une seule collecte par URL, même pour plusieurs départements. */
export function sourcesSurveillees(rows=ROLES_OFFICIELS) {
  const sources=new Map();
  for(const r of rows) {
    if(r.mode==='sur-place'||r.mode==='information')continue;
    const current=sources.get(r.url)??{url:r.url,codes:[],modes:[]};
    if(!current.codes.includes(r.code))current.codes.push(r.code);
    if(!current.modes.includes(r.mode))current.modes.push(r.mode);
    sources.set(r.url,current);
  }
  return [...sources.values()].sort((a,b)=>a.url.localeCompare(b.url))
    .map(r=>({...r,codes:r.codes.sort(),mode:r.modes.includes('publication')?'publication':'ressort'}));
}

async function chargerPage(url) {
  let cible=url;
  for(let i=0;i<4;i++) {
    const u=new URL(cible);
    if(u.protocol!=='https:'||u.hostname!==HOTE_AUTORISE||u.port||u.username||u.password)throw Error('Redirection vers une origine non autorisée');
    const rep=await fetch(u.href,{redirect:'manual',headers:{'User-Agent':'IntimeConvictionRoleMonitor/1.0 (+https://www.intimeconviction.fr/; editorial reference check)','Accept':'text/html'},signal:AbortSignal.timeout(18000)});
    if([301,302,303,307,308].includes(rep.status)){
      const location=rep.headers.get('location');
      if(!location)throw Error('Redirection sans destination');
      cible=new URL(location,u.href).href;continue;
    }
    if(!rep.ok)throw Error('HTTP '+rep.status);
    if(!/text\/html/i.test(rep.headers.get('content-type')??''))throw Error('Réponse non HTML');
    const n=Number(rep.headers.get('content-length')||'0');
    if(n>4_000_000)throw Error('Page excessivement volumineuse');
    const html=await rep.text();
    if(html.length>4_000_000)throw Error('Page excessivement volumineuse');
    return {html,urlFinale:u.href};
  }
  throw Error('Trop de redirections');
}

function nettoyerMarkdown(t='') {
  return String(t).replace(/[\[\]<>\r\n|]/g,' ').replace(/\s+/g,' ').slice(0,180);
}
function lignesDiff(type,rows) {
  const nom={ajouts:'Documents nouvellement référencés',retraits:'Documents retirés',renommes:'Libellés modifiés'}[type];
  if(!rows.length)return '';
  const details=rows.slice(0,25).map(d=>{
    const doc=type==='renommes'?d.apres:d;
    return '- '+nettoyerMarkdown(doc.titre)+' : '+doc.url;
  }).join('\n');
  return '\n**'+nom+' ('+rows.length+')**\n\n'+details+(rows.length>25?'\n- …':'')+'\n';
}

export function creerRapportMarkdown(modifications, erreurs=[]) {
  const date=new Date().toISOString().slice(0,10);
  const lignes=[
    '# Veille des rôles d’audience : modifications à vérifier',
    '',
    'Contrôle du '+date+' (UTC). La source est la page institutionnelle, et non le PDF lui-même.',
    'Un lien ajouté ou retiré ne prouve pas qu’une audience est fixée, modifiée ou annulée.',
    '**Vérification éditoriale obligatoire avant toute publication.**',
    '',
  ];
  for(const c of modifications){
    lignes.push('## Départements '+c.codes.join(', '),'Page officielle : '+c.url);
    for(const type of ['ajouts','retraits','renommes'])lignes.push(lignesDiff(type,c.differences[type]));
  }
  if(erreurs.length)lignes.push('## Sources non contrôlées',...erreurs.map(e=>'- '+e.url+' : '+nettoyerMarkdown(e.raison)));
  lignes.push('','Les fichiers sont seulement des liens vers des documents de source institutionnelle. Aucune date d’audience ni aucune identité n’est importée automatiquement.');
  return lignes.join('\n');
}

export async function executer({sources=sourcesSurveillees(),lire=chargerPage,
  etatChemin=FICHIER_ETAT,rapportChemin=FICHIER_RAPPORT,issueChemin=FICHIER_ISSUE}={}) {
  let etat={version:1,pages:{}};
  try {etat=JSON.parse(await readFile(etatChemin,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
  if(etat.version!==1 || !etat.pages || typeof etat.pages!=='object')throw Error('Format du relevé précédent invalide');
  const suivant={version:1,pages:{...etat.pages}};
  const modifications=[],erreurs=[];let init=0,reussis=0,liensDocuments=0;
  const sourcesSansDocuments=[];
  for(const source of sources) {
    try {
      const {html,urlFinale}=await lire(source.url);
      const documents=extraireDocuments(html,urlFinale,source.mode);
      console.log('Source officielle',source.url,JSON.stringify({
        tailleHTML:html.length,
        nombresAncres:(html.match(/<a\\b/gi)||[]).length,
        occurencesPDF:(html.match(/\\.pdf/gi)||[]).length,
        documents:documents.length,
        forme:/(?:cloudflare|access denied|captcha)/i.test(html)?'page de vérification probable':'HTML ordinaire'
      }));
      liensDocuments+=documents.length;
      if(!documents.length)sourcesSansDocuments.push({url:source.url,codes:source.codes});
      const precedents=etat.pages[source.url];
      if(precedents && precedents.length>0 && documents.length===0) {
        // Mise en page changée, barrière anti-bot ou panne : ne jamais annoncer
        // une suppression totale tant que l'analyseur n'est pas confirmé.
        throw Error('Aucun document reconnu alors que la source en contenait auparavant ; vérification manuelle nécessaire');
      }
      if(!precedents){init++;suivant.pages[source.url]=documents;reussis++;continue;}
      const diff=differencier(precedents,documents);
      if(diff.ajouts.length||diff.retraits.length||diff.renommes.length) {
        modifications.push({...source,differences:diff});
      }
      suivant.pages[source.url]=documents;reussis++;
    }catch(e){erreurs.push({url:source.url,codes:source.codes,raison:String(e.message||e).slice(0,230)});}
  }
  if(reussis===0)throw Error('Aucune source officielle accessible : ne pas modifier le relevé.');
  if(liensDocuments===0 && sources.length>1)throw Error('Aucun lien vers un rôle reconnu sur les pages consultées : réviser l’extracteur.');
  await mkdir(resolve(rapportChemin,'..'),{recursive:true});
  const rapport={version:1,verifieLe:new Date().toISOString(),sourcesVisees:sources.length,sourcesLues:reussis,liensDocuments,sourcesSansDocuments,initialisees:init,modifications,erreurs};
  await writeFile(rapportChemin,JSON.stringify(rapport,null,2)+'\n');
  await writeFile(issueChemin,creerRapportMarkdown(modifications,erreurs)+'\n');
  await mkdir(resolve(etatChemin,'..'),{recursive:true});
  await writeFile(etatChemin,JSON.stringify(suivant,null,2)+'\n');
  console.log(JSON.stringify({sources:sources.length,lues:reussis,liensDocuments,sansDocuments:sourcesSansDocuments.length,initialisees:init,changements:modifications.length,erreurs:erreurs.length}));
  if(erreurs.length)console.warn('Certains sites officiels sont indisponibles ou ont changé de structure ; voir le rapport.');
  return rapport;
}

if(process.argv[1] && fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  executer().catch(e=>{console.error(e);process.exitCode=1;});
}
