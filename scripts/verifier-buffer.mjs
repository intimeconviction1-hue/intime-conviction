// Diagnostic sans publication. Ne jamais afficher la clé API ou l'adresse e-mail.
const key = process.env.BUFFER_API_KEY;
const expectedId = process.env.BUFFER_CHANNEL_ID;
if (!key) throw new Error('Secret BUFFER_API_KEY absent.');
if (!expectedId) throw new Error('BUFFER_CHANNEL_ID absent.');
async function query(graphql) {
  const res = await fetch('https://api.buffer.com', {
    method:'POST',
    headers:{'Content-Type':'application/json', Authorization:'Bearer '+key},
    body:JSON.stringify({query:graphql}),
    signal:AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error('Buffer HTTP '+res.status);
  const out=await res.json();
  if (out.errors?.length) throw new Error('Buffer GraphQL: '+out.errors.map(e=>e.message).join('; '));
  return out.data;
}
const account=await query('query { account { organizations { id name } } }');
const orgs=account?.account?.organizations||[];
if (!orgs.length) throw new Error('Aucune organisation Buffer accessible');
let channels=[];
for (const org of orgs) {
  const data=await query('query { channels(input: { organizationId: '+JSON.stringify(org.id)+' }) { id name service displayName } }');
  channels.push(...(data.channels||[]));
}
console.log('Organisations Buffer trouvées : '+orgs.length);
console.log('Canaux X/Twitter trouvés : '+channels.filter(x=>x.service==='twitter').length);
const selected=channels.find(x=>x.id===expectedId);
if (!selected) throw new Error('Le canal indiqué dans GitHub ne correspond à aucun canal Buffer : vérifier son identifiant API.');
console.log('Canal sélectionné : '+selected.service+' / '+selected.name);
if (selected.service!=='twitter' || !/intimeconv/i.test(selected.name+' '+selected.displayName)) {
  throw new Error('Le canal cible ne correspond pas au compte X IntimeConv : diffusion bloquée.');
}
console.log('VALIDÉ : clé API et canal X IntimeConv reconnus. Aucun post créé.');
