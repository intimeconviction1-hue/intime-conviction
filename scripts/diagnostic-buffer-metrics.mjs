// Diagnostic en lecture seule des posts Buffer ; API expérimentale.
// Les métriques peuvent être absentes, retardées ou incomplètes, notamment sur X.
// Le fichier n'affiche ni clé API ni information privée.
import fs from 'node:fs';
const token=process.env.BUFFER_API_KEY;
if (!token) throw new Error('BUFFER_API_KEY absent');
const channel=process.env.BUFFER_CHANNEL_ID;
const state=JSON.parse(fs.readFileSync(process.env.X_PUBLICATION_STATE||'.x-publications.json','utf8'));
const posts=Object.entries(state.seen||{}).filter(([,v])=>v.bufferPostId).map(([fingerprint,v])=>({fingerprint,id:v.bufferPostId,queuedAt:v.queuedAt}));
const query = `query GetPostMetrics($id: ID!) {
  post(input: { id: $id }) {
    id
    channelId
    metrics { type name value unit }
    metricsUpdatedAt
  }
}`;
async function metrics(id){
  const res=await fetch('https://api.buffer.com',{
    method:'POST', headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
    body:JSON.stringify({query,variables:{id}}),signal:AbortSignal.timeout(18000)
  });
  if (!res.ok) return {status:'unavailable',reason:'http_'+res.status};
  const obj=await res.json();
  if(obj.errors?.length)return {status:'unavailable',reason:obj.errors.map(e=>e.message).join('; ')};
  const p=obj.data?.post;
  if(!p)return {status:'unavailable',reason:'post_not_accessible'};
  if(channel && p.channelId!==channel)return {status:'unavailable',reason:'unexpected_channel'};
  return {status:'ok',metricsUpdatedAt:p.metricsUpdatedAt||null,metrics:(p.metrics||[]).map(m=>({
    type:m.type,name:m.name,value:m.value,unit:m.unit
  }))};
}
const results=[];
for(const item of posts.slice(-30)){
  try { results.push({...item,...await metrics(item.id)}); }
  catch(e){results.push({...item,status:'unavailable',reason:String(e.message||e)});}
}
const report={generatedAt:new Date().toISOString(),experimental:true,
  warning:'Les données Buffer ne mesurent pas les sessions sur intimeconviction.fr. Les métriques X peuvent manquer.',
  totalPostsQueued:posts.length,results};
fs.writeFileSync(process.env.METRICS_REPORT||'buffer-metrics.json',JSON.stringify(report,null,2)+'\n');
console.log('Posts enregistrés : '+posts.length);
console.log('Réponses API exploitables : '+results.filter(x=>x.status==='ok').length);
console.log('Posts avec des mesures : '+results.filter(x=>x.status==='ok'&&x.metrics.length).length);
console.log('Rapport expérimental écrit, aucun post créé.');
