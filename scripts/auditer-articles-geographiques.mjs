import {readdir,readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {candidatsGeographiques,candidatsTextuels} from '../src/lib/articles-geographiques.mjs';
import {articleVisible} from '../src/lib/article-visible.mjs';
const root=resolve(process.env.IC_ARTICLES??'../intime-conviction-articles/articles');
async function walk(dir){
 const entries=await readdir(dir,{withFileTypes:true});
 const results=await Promise.all(entries.map(e=>e.isDirectory()?walk(join(dir,e.name)):e.isFile()&&e.name.endsWith('.json')?[join(dir,e.name)]:[]));
 return results.flat();
}
const files=await walk(root);
const articles=[];let invalides=0;
for(const file of files){
 try{const a=JSON.parse(await readFile(file,'utf8'));if(typeof a.chemin!=='string'||typeof a.date!=='string')throw Error('format');articles.push({data:{...a,date:new Date(a.date)}});}catch{invalides++;}
}
const visibles=articles.filter(a=>articleVisible(a.data));
const metadata=candidatsGeographiques(visibles);
const textuels=candidatsTextuels(visibles);
const candidats=[...new Map([...textuels,...metadata].map(c=>[c.chemin,c])).values()];
const counts={};
for(const c of candidats)for(const id of c.implantations)counts[id]=(counts[id]??0)+1;
const rapport={candidatsMetadata:metadata.length,candidatsTextuels:textuels.length,indicesTitre:textuels.filter(c=>c.indices.some(i=>i.zones.includes('titre'))).length,fichiers:files.length,invalides,articlesVisibles:visibles.length,avecJuridiction:visibles.filter(a=>a.data.maillage?.juridiction).length,candidats:candidats.length,implantations:Object.keys(counts).length,parImplantation:counts,ambigus:candidats.filter(c=>c.implantations.length!==1).length};
await mkdir('.cache/geographie',{recursive:true});
await writeFile('.cache/geographie/rapport.json',JSON.stringify(rapport,null,2));
console.log(JSON.stringify(rapport));
// Aucun texte, chemin individuel ou métadonnée privée dans les logs publics.
if(!files.length||invalides)process.exitCode=1;
