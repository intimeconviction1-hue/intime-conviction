/**
 * Usage :
 *   node scripts/comparer-releves-roles.mjs ancien.json nouveau.json
 * Les fichiers JSON sont préparés à partir de documents officiels effectivement lus.
 * Cette commande ne télécharge aucun document et ne publie rien sur le site.
 */
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {comparerReleves} from '../src/lib/comparer-roles.mjs';

export async function comparerFichiers(ancien,nouveau){
  const [a,b]=await Promise.all([
    readFile(ancien,'utf8').then(JSON.parse),
    readFile(nouveau,'utf8').then(JSON.parse)
  ]);
  return comparerReleves(a,b);
}
const execute=process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href;
if(execute){
  if(process.argv.length!==4){
    console.error('Usage : node scripts/comparer-releves-roles.mjs ancien.json nouveau.json');
    process.exitCode=2;
  }else{
    try{
      const rapport=await comparerFichiers(process.argv[2],process.argv[3]);
      console.log(JSON.stringify(rapport,null,2));
    }catch(e){
      console.error('Comparaison impossible : '+e.message);
      process.exitCode=1;
    }
  }
}
