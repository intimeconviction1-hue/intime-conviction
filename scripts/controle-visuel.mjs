import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.IC_VISUAL_BASE_URL ?? 'https://www.intimeconviction.fr';
const dossier = 'controle-visuel';
await mkdir(dossier, { recursive:true });
const browser = await chromium.launch({ headless:true });
const controles = [
  { nom:'dossiers-ordinateur', url:'/dossiers/', viewport:{width:1440,height:900} },
  { nom:'dossiers-mobile', url:'/dossiers/', viewport:{width:390,height:844}, isMobile:true },
  { nom:'affaire-mobile', url:'/dossiers/affaire-jubillar/', viewport:{width:390,height:844}, isMobile:true },
];
const resultats=[];
try {
  for (const c of controles) {
    const page = await browser.newPage({viewport:c.viewport,deviceScaleFactor:1,isMobile:!!c.isMobile,hasTouch:!!c.isMobile});
    const url = new URL(c.url,base).href;
    const response = await page.goto(url, {waitUntil:'domcontentloaded',timeout:35000});
    await page.locator('h1').first().waitFor({timeout:12000});
    await page.evaluate(() => document.fonts.ready);
    const mesure = await page.evaluate(() => {
      const doc=document.documentElement;
      const rects=[...document.querySelectorAll('body *')].filter(el=>{
        const st=getComputedStyle(el);
        return st.position!=='fixed'&&st.display!=='none'&&st.visibility!=='hidden';
      }).map(el=>({el,rect:el.getBoundingClientRect()}));
      const fautifs=rects.filter(({rect})=>rect.width>0&&(rect.right>innerWidth+2||rect.left< -2))
        .slice(0,8).map(({el,rect})=>({balise:el.tagName.toLowerCase(),classe:String(el.className||'').slice(0,90),gauche:Math.round(rect.left),droite:Math.round(rect.right)}));
      return {largeurFenetre:innerWidth,largeurDocument:doc.scrollWidth,debordements:fautifs,
        titre:document.querySelector('h1')?.textContent?.trim()??'',
        liensDossiers:[...document.querySelectorAll('a[href^="/dossiers/"]')].length};
    });
    await page.screenshot({path:`${dossier}/${c.nom}.png`,fullPage:true});
    const okHttp=response?.ok()??false;
    const okLargeur=mesure.largeurDocument<=c.viewport.width+2;
    const resultat={page:c.nom,url,statutHTTP:response?.status()??null,okHttp,okLargeur,...mesure};
    resultats.push(resultat);
    console.log(JSON.stringify(resultat));
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile(`${dossier}/resultats.json`,JSON.stringify(resultats,null,2)+'\n');
}
if(resultats.length!==controles.length||resultats.some(r=>!r.okHttp||!r.okLargeur)) {
  console.error('Contrôle navigateur non satisfaisant : consulter les captures et le rapport.');
  process.exitCode=1;
}
