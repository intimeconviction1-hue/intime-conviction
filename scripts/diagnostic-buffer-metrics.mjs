// Diagnostic en lecture seule des posts Buffer ; API expérimentale.
// Les métriques peuvent être absentes, retardées ou incomplètes, notamment sur X.
// Le fichier n'affiche ni clé API ni information privée.
import fs from 'node:fs';
const token=process.env.BUFFER_API_KEY;
if (!token) throw new Error('BUFFER_API_KEY absent');
const channel=process.env.BUFFER_CHANNEL_ID;
const state=JSON.parse(fs.readFileSync(process.env.X_PUBLICATION_STATE||'.x-publications.json','utf8'));
const posts=Object.entries(state.seen||{}).filter(([,v])=>v.bufferPostId).map(([fingerprint,v])=>({fingerprint,id:v.bufferPostId,queuedAt:v.queuedAt}));
const query = `query GetPostMetrics($id: PostId!) {
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
console.log('Diagnostic des indisponibilités (sans informations sensibles) : '+JSON.stringify(results.filter(x=>x.status!=='ok').map(x=>String(x.reason||'inconnue').slice(0,180))));
const totals={};
for(const key of ['impressions','clicks','reactions','comments','reposts']) {
  const available=results.filter(r=>r.status==='ok'&&r.metrics.some(m=>m.type===key&&Number.isFinite(Number(m.value))));
  totals[key]={postsWithData:available.length,value:available.reduce((sum,r)=>sum+Number(r.metrics.find(m=>m.type===key).value),0)};
}
const dates=results.flatMap(r=>r.metricsUpdatedAt?[r.metricsUpdatedAt]:[]);
const latestMetricsAt=dates.length?dates.sort().at(-1):null;
const summary={
  date:new Date().toISOString().slice(0,10), measuredAt:new Date().toISOString(),
  postsWithMetrics:results.filter(r=>r.status==='ok'&&r.metrics.length).length,
  postsQueued:posts.length, totals, latestMetricsAt
};
fs.writeFileSync('buffer-metrics-summary.json',JSON.stringify(summary,null,2)+'\n');
const fmt=n=>new Intl.NumberFormat('fr-FR').format(n);
const rows=[
  ['Impressions','impressions'],['Clics signalés par Buffer','clicks'],
  ['Réactions','reactions'],['Commentaires','comments'],['Reposts','reposts']
];
const lines=[
  '# X / Intime Conviction : relevé des performances',
  '',
  '> Données expérimentales de Buffer. Les clics ne sont pas des visites confirmées sur le site. Ne pas additionner les instantanés entre les jours : les compteurs peuvent être cumulatifs.',
  '',
  '| Indicateur | Total rapporté | Posts avec données |',
  '|---|---:|---:|',
  ...rows.map(([label,key])=>'| '+label+' | '+(totals[key].postsWithData ? fmt(totals[key].value) : 'Indisponible')+' | '+totals[key].postsWithData+'/'+posts.length+' |'),
  '',
  'Publications enregistrées : **'+posts.length+'**. Publications avec au moins une métrique : **'+summary.postsWithMetrics+'**.',
  '',
  'Dernière actualisation des métriques connue : **'+(latestMetricsAt||'inconnue')+'**.',
  '',
  'Pour déterminer les visites réelles, connecter Google Analytics 4 au site puis consulter la campagne articles_redaction et la source x / social.',
  ''
];
const markdown=lines.join('\n');
fs.writeFileSync('buffer-metrics-summary.md',markdown);
if(process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,markdown);
console.log('Résumé quotidien enregistré : '+JSON.stringify({posts:summary.postsQueued,withMetrics:summary.postsWithMetrics,totals:summary.totals,latestMetricsAt}));
console.log('Rapport expérimental écrit, aucun post créé.');
