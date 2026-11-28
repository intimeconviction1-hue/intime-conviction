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
