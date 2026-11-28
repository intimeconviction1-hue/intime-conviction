// Téléchargement reproductible de la ressource officielle épinglée.
// Ne remplace jamais le référentiel publié par une réponse incomplète.
import {mkdir,writeFile,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const url='https://static.data.gouv.fr/resources/donnees-geocodees-des-structures-de-la-justice-30378257/20260519-171818/donnees-geocodees-des-structures-de-la-justice-mai2026.csv';
const res=await fetch(url,{signal:AbortSignal.timeout(60000)});
if(!res.ok)throw Error('Téléchargement officiel : HTTP '+res.status);
const data=Buffer.from(await res.arrayBuffer());
if(data.length<100000||data.length>20000000)throw Error('Taille inattendue du CSV');
const header=data.subarray(0,8192).toString('utf8').split(/\r?\n/)[0];
if(!/[;,\t]/.test(header)||/<html|<!doctype/i.test(header))throw Error('En-tête CSV invalide');
await mkdir('.cache/justice',{recursive:true});
const dest='.cache/justice/structures-mai2026.csv';
await writeFile(dest+'.tmp',data);await rename(dest+'.tmp',dest);
console.log(JSON.stringify({source:url,octets:data.length,sha256:createHash('sha256').update(data).digest('hex'),entete:header},null,2));
// L'examen des champs réels précède toute conversion ou attribution géographique.
