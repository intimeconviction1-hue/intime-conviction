// Test e2e de l'interface de consentement en production.
// Les requêtes Google sont neutralisées afin de ne pas polluer Analytics.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const URL = process.env.TEST_SITE_URL || 'https://www.intimeconviction.fr/';
const ID = 'G-LBH06QWG2R';
const ARTICLE = 'https://www.intimeconviction.fr/dix-sept-ans-de-reclusion-pour-le-crime-de-deraison/11/2009/';
const CASES = [
  { name: 'ordinateur', viewport: { width: 1360, height: 900 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } },
];

function approx(a, b, tol=1) { return Math.abs(a - b) <= tol; }

const browser = await chromium.launch({ headless:true, args:['--no-sandbox'] });
try {
  for (const { name, viewport } of CASES) {
    const context = await browser.newContext({ viewport, locale:'fr-FR', timezoneId:'Europe/Paris', reducedMotion:'reduce' });
    let requestsGoogle = 0;
    // Aucune requête de test vers Google. Le tag d'analytics est remplacé
    // par une réponse inerte : on teste le chargement conditionnel, pas GA.
    await context.route(/(googletagmanager\.com|google-analytics\.com)/, async route => {
      requestsGoogle++;
      await route.fulfill({status:200,contentType:'application/javascript',body:'// neutralisé par la recette'});
    });
    const page = await context.newPage();
    await page.goto(URL, {waitUntil:'domcontentloaded',timeout:45000});

    const panel = page.locator('#consentement-editorial');
    await panel.waitFor({state:'visible'});
    const initial = await panel.boundingBox();
    assert(initial, name+': pas de dimensions du panneau');
    assert(initial.x >= -1 && initial.y >= -1 && initial.x + initial.width <= viewport.width+1, name+': panneau hors écran');
    assert(initial.y + initial.height <= viewport.height+1, name+': panneau déborde verticalement');
    assert(initial.height <= viewport.height * .62, name+': panneau trop haut, gêne la lecture');
    assert(initial.x > viewport.width*.35 || viewport.width < 671, name+': panneau ordinateur doit rester discret en bas à droite');

    const refused = page.getByRole('button',{name:'Tout refuser'});
    const accepted = page.getByRole('button',{name:'Tout accepter'});
    const a=await refused.boundingBox();
    const b=await accepted.boundingBox();
    assert(a&&b,name+': les boutons sont introuvables');
    assert(approx(a.width,b.width), name+': largeur des boutons inégale : '+a.width+' / '+b.width);
    assert(approx(a.height,b.height), name+': hauteur des boutons inégale');
    const style=await page.evaluate(()=>{
      const r=document.querySelector('[data-consent="refuser"]');
      const a=document.querySelector('[data-consent="accepter"]');
      if(!r||!a)return null;
      const cr=getComputedStyle(r),ca=getComputedStyle(a);
      return {bgRefus:cr.backgroundColor,bgAccord:ca.backgroundColor,colorRefus:cr.color,colorAccord:ca.color};
    });
    assert(style?.bgRefus===style?.bgAccord && style?.colorRefus===style?.colorAccord, name+': styles asymétriques '+JSON.stringify(style));
    assert.equal(requestsGoogle,0,name+': requête Google avant choix');
    assert.equal(await page.locator('script[src*="gtag/js"]').count(),0,name+': script Google injecté avant choix');

    await refused.click();
    await panel.waitFor({state:'hidden'});
    assert.equal(requestsGoogle,0,name+': requête Google après refus');
    assert.equal(await page.locator('script[src*="gtag/js"]').count(),0,name+': script Google après refus');
    assert(await page.locator('#contenu').isVisible(),name+': le contenu doit rester accessible');

    await page.locator('#gestion-confidentialite').click();
    await panel.waitFor({state:'visible'});
    await accepted.click();
    await panel.waitFor({state:'hidden'});
    await page.waitForFunction(()=>!!document.querySelector('script[src*="googletagmanager.com/gtag/js"]'),{timeout:10000});
    const src=await page.locator('script[src*="gtag/js"]').getAttribute('src');
    assert(src?.includes(ID),name+': le mauvais ID Google est injecté');
    assert(requestsGoogle>=1,name+': le script GA n’a pas été demandé après acceptation');
    const consentAccepted=await page.evaluate(()=>JSON.parse(localStorage.getItem('ic:analytics:consent:v1')||'{}').value);
    assert.equal(consentAccepted,'accepter',name+': accord non conservé');

    // Tester les événements de partage avec une acceptation réelle dans la
    // session de test, mais des requêtes vers Google systématiquement bloquées.
    await page.goto(ARTICLE,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForFunction(()=>!!document.querySelector('script[src*="googletagmanager.com/gtag/js"]'),{timeout:10000});
    const observed = await page.evaluate(()=>{
      function clickWithoutNavigation(selector) {
        const el=document.querySelector(selector);
        if(!el) throw new Error('Lien absent : '+selector);
        el.addEventListener('click',e=>e.preventDefault(),{capture:true,once:true});
        el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
      }
      clickWithoutNavigation('a.partager-x');
      clickWithoutNavigation('a.partager-whatsapp');
      clickWithoutNavigation('.passerelle-archives a[href]');
      return (window.dataLayer||[]).filter(v=>Array.isArray(v)&&v[0]==='event').map(v=>({name:v[1],parameters:v[2]}));
    });
    const shares=observed.filter(x=>x.name==='share');
    const moves=observed.filter(x=>x.name==='select_content');
    assert.equal(shares.length,2,name+': attendus deux clics de partage suivis');
    assert.deepEqual(shares.map(x=>x.parameters?.method),['x','whatsapp'],name+': méthodes de partage mal étiquetées');
    assert.equal(moves.length,1,name+': passage archive vers actualité non mesuré');
    assert.equal(moves[0]?.parameters?.content_type,'archive_to_news',name+': type de passage incorrect');
    assert(shares.every(x=>x.parameters?.item_id===new globalThis.URL(ARTICLE).pathname),name+': identifiants de page incohérents');



    await page.locator('#gestion-confidentialite').click();
    await page.getByRole('button',{name:'Tout refuser'}).click();
    await page.waitForLoadState('domcontentloaded');
    await page.reload({waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('script[src*="gtag/js"]').count(),0,name+': Google chargé après retrait et rechargement');
    const consentRefused=await page.evaluate(()=>JSON.parse(localStorage.getItem('ic:analytics:consent:v1')||'{}').value);
    assert.equal(consentRefused,'refuser',name+': refus non conservé');

    const ignored = await page.evaluate(()=>{
      const x=document.querySelector('a.partager-x');
      if(!x)throw new Error('Lien partage X absent après retrait');
      x.addEventListener('click',e=>e.preventDefault(),{capture:true,once:true});
      x.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
      return (window.dataLayer||[]).some(v=>Array.isArray(v)&&v[0]==='event'&&v[1]==='share');
    });
    assert.equal(ignored,false,name+': événement de partage envoyé après retrait du consentement');

    console.log('OK '+name+' : taille maîtrisée, boutons symétriques, refus, acceptation et retrait, aucun signal de test envoyé à Google.');
    await context.close();
  }
} finally {
  await browser.close();
}
