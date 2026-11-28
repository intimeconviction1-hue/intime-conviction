import {IMPLANTATIONS,associationsVerifiees} from './geographie-judiciaire.mjs';
// Les associations proposées ne sont jamais publiées sans validation humaine sourcée.
export function candidatsGeographiques(articles){
 const norm=s=>String(s??'').toLowerCase().normalize('NFD').replace(/\p{M}/gu,'').replace(/[^a-z0-9]+/g,' ').trim();
 return articles.flatMap(({data:a})=>{
  if(a.verificationEnCours||!a.chemin)return [];
  const champ=norm(a.maillage?.juridiction);
  if(!champ||!/(cour d assises|cour criminelle|tribunal criminel)/.test(champ))return [];
  const villes=IMPLANTATIONS.filter(v=>(' '+champ+' ').includes(' '+norm(v.ville)+' '));
  if(!villes.length)return [];
  return [{chemin:a.chemin,implantations:villes.map(v=>v.id),statut:'a-verifier',juridiction:a.maillage.juridiction}];
 });
}
export function articlesParImplantation(articles,associations){
 const index=new Map();
 for(const entry of articles){
  const a=entry.data;
  for(const lien of associationsVerifiees(a,associations)){
   const items=index.get(lien.implantation)??[];
   if(!items.some(x=>x.data.chemin===a.chemin))items.push(entry);
   index.set(lien.implantation,items);
  }
 }
 return index;
}

 // Détection de mentions explicites, exclusivement pour la file de vérification.
 // Aucun résultat n'est considéré comme une audience confirmée.
export function candidatsTextuels(articles){
 const norm=s=>String(s??'').toLowerCase().normalize('NFD').replace(/\p{M}/gu,'').replace(/[^a-z0-9]+/g,' ').trim();
 const refs=new Map();
 for(const v of IMPLANTATIONS){
  const n=norm(v.ville);
  if(n)refs.set(n,[...(refs.get(n)??[]),v.id]);
 }
 const names=[...refs.keys()].sort((a,b)=>b.length-a.length);
 const pattern=new RegExp('(?:cour d assises|cour criminelle(?: departementale)?|tribunal criminel) (?:d appel )?(?:de la |du |des |de |d |a )?('+names.join('|')+')(?![a-z0-9])','g');
 return articles.flatMap(({data:a})=>{
  if(a.verificationEnCours||!a.chemin)return [];
  const zones=[['titre',a.titre],['extrait',a.extrait],['corps',String(a.html??'').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&(?:nbsp|#160);/gi,' ').replace(/&(?:apos|#39|rsquo|#8217);/gi,"'").replace(/&eacute;/gi,'é')]];
  const matches=new Map();
  for(const [zone,value] of zones){
   for(const match of norm(value).matchAll(pattern)){
    for(const id of refs.get(match[1])??[]){
     const existing=matches.get(id)??new Set();
     existing.add(zone);matches.set(id,existing);
    }
   }
  }
  if(!matches.size)return [];
  return [{chemin:a.chemin,statut:'a-verifier',implantations:[...matches.keys()],indices:[...matches].map(([implantation,zones])=>({implantation,zones:[...zones]}))}];
 });
}
