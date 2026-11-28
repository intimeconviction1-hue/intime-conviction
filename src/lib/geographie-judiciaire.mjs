// Référentiel territorial dérivé de l'annuaire d'orientation existant.
// Une ville-siège habituelle ne prouve ni le lieu d'une audience ni la compétence dans un dossier.
import { DEPARTEMENTS_ASSISES, ANNUAIRE_OFFICIEL } from './guide-assises.mjs';
import { JURIDICTIONS } from './juridictions.mjs';

const REGIONS = {
 'Auvergne-Rhône-Alpes':'01 03 07 15 26 38 42 43 63 69 73 74',
 'Bourgogne-Franche-Comté':'21 25 39 58 70 71 89 90',
 'Bretagne':'22 29 35 56',
 'Centre-Val de Loire':'18 28 36 37 41 45',
 'Corse':'2A 2B',
 'Grand Est':'08 10 51 52 54 55 57 67 68 88',
 'Hauts-de-France':'02 59 60 62 80',
 'Île-de-France':'75 77 78 91 92 93 94 95',
 'Normandie':'14 27 50 61 76',
 'Nouvelle-Aquitaine':'16 17 19 23 24 33 40 47 64 79 86 87',
 'Occitanie':'09 11 12 30 31 32 34 46 48 65 66 81 82',
 'Pays de la Loire':'44 49 53 72 85',
 'Provence-Alpes-Côte d’Azur':'04 05 06 13 83 84',
 'Guadeloupe':'971','Martinique':'972','Guyane':'973','La Réunion':'974','Mayotte':'976'
};
const parCode = new Map(Object.entries(REGIONS).flatMap(([region,codes])=>codes.split(' ').map(code=>[code,region])));
export const slugGeographique = s=>s.toLowerCase().normalize('NFD').replace(/\p{M}/gu,'').replace(/œ/g,'oe').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const TERRITOIRES = Object.freeze(DEPARTEMENTS_ASSISES.map(d=>Object.freeze({...d,region:parCode.get(d.code),implantation:slugGeographique(d.ville),statut:'orientation',source:ANNUAIRE_OFFICIEL})));
export const IMPLANTATIONS = Object.freeze([...new Set(TERRITOIRES.map(d=>d.implantation))].map(id=>{
 const territoires=TERRITOIRES.filter(d=>d.implantation===id);
 return Object.freeze({id,ville:territoires[0].ville,region:territoires[0].region,departements:territoires.map(d=>d.code),jalons:JURIDICTIONS.filter(j=>slugGeographique(j.ville)===id),statut:'orientation'});
}));
export function validerGeographie(){
 if(TERRITOIRES.length!==101 || parCode.size!==101 || TERRITOIRES.some(d=>!d.region)) throw Error('Couverture départementale incomplète');
 if(IMPLANTATIONS.length!==100 || IMPLANTATIONS.find(i=>i.id==='vesoul')?.departements.join(',')!=='70,90') throw Error('Implantations incohérentes');
 return true;
}
// Aucun rapprochement sur le titre, le lieu des faits ou la seule présence d'une ville.
export function associationsVerifiees(article, associations=[]){
 if(!article || article.verificationEnCours===true || !article.chemin) return [];
 return associations.filter(a=>a.chemin===article.chemin && a.statut==='verifie' && typeof a.source==='string' && /^https:\/\//.test(a.source) && ['assises','cour-criminelle','assises-mineurs'].includes(a.nature) && ['premiere-instance','appel'].includes(a.instance) && IMPLANTATIONS.some(i=>i.id===a.implantation && i.departements.includes(a.codeDepartement)));
}
