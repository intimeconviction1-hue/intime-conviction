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
  { nom:'agenda-ordinateur', url:'/agenda/', viewport:{width:1440,height:900} },
  { nom:'agenda-mobile', url:'/agenda/', viewport:{width:390,height:844}, isMobile:true },
  { nom:'archives-mobile', url:'/archives/', viewport:{width:390,height:844}, isMobile:true },
  { nom:'lecture-mobile', url:'/12-hommes-en-colere-theatre-hebertot-jusquau-7-janvier-2018/11/2017/', viewport:{width:390,height:844}, isMobile:true },
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
      // Les liens d'évitement volontairement masqués et les éléments d'un
      // carrousel/navigation à défilement horizontal ne sont pas des débordements.
      const defilementHorizontal = (el) => {
        for(let parent=el.parentElement;parent;parent=parent.parentElement) {
          const style=getComputedStyle(parent);
          if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) return true;
        }
        return false;
      };
      const rects=[...document.querySelectorAll('body *')].filter(el=>{
        const st=getComputedStyle(el);
        return st.position!=='fixed'&&st.display!=='none'&&st.visibility!=='hidden'&&
          !el.classList.contains('evitement')&&!defilementHorizontal(el);
      }).map(el=>({el,rect:el.getBoundingClientRect()}));
      const fautifs=rects.filter(({rect})=>rect.width>0&&(rect.right>innerWidth+2||rect.left< -2))
        .slice(0,8).map(({el,rect})=>({balise:el.tagName.toLowerCase(),classe:String(el.className||'').slice(0,90),gauche:Math.round(rect.left),droite:Math.round(rect.right)}));
      return {largeurFenetre:innerWidth,largeurDocument:doc.scrollWidth,debordements:fautifs,
        titre:document.querySelector('h1')?.textContent?.trim()??'',
        liensDossiers:[...document.querySelectorAll('a[href^="/dossiers/"]')].length};
    });
    if(c.nom.startsWith('agenda-')){
      const departement=page.locator('#filtre-departement');
      const mois=page.locator('#filtre-mois');
      await departement.waitFor();
      const disponibles=await departement.locator('option').evaluateAll(options=>options.map(o=>o.value).filter(Boolean));
      const lignes=page.locator('[data-agenda-ligne]');
      const total=await lignes.count();
      if(total===0)throw Error('Agenda sans périodes : vérifier les données avant de tester les filtres.');
      if(disponibles.length===0)throw Error('Aucun département proposé dans l’agenda.');
      const choix=disponibles[0];
      await departement.selectOption(choix);
      const horsDepartement=await page.locator('[data-agenda-ligne]:not([hidden])').evaluateAll((rows,dep)=>rows.filter(row=>row.dataset.departement!==dep).length,choix);
      if(horsDepartement!==0)throw Error('Le filtre département affiche des résultats étrangers.');
      const visiblesFiltrees=await page.locator('[data-agenda-ligne]:not([hidden])').count();
      if(visiblesFiltrees===0)throw Error('Le filtre département ne montre aucun résultat attendu.');
      const premier=page.locator('[data-agenda-ligne]:not([hidden])').first();
      const moisActif=(await premier.getAttribute('data-debut')).slice(0,7);
      await mois.selectOption(moisActif);
      const erreurMois=await page.locator('[data-agenda-ligne]:not([hidden])').evaluateAll((rows,m)=>rows.some(el=>el.dataset.debut>m+'-31'||el.dataset.fin<m+'-01'),moisActif);
      if(erreurMois)throw Error('Le filtre mois ne respecte pas le chevauchement des périodes.');
      await page.locator('#filtres-agenda button[type=reset]').click();
      await page.waitForFunction(()=>[...document.querySelectorAll('[data-agenda-ligne]')].every(e=>!e.hidden));
      await page.goto(new URL('/agenda/?departement='+encodeURIComponent(choix),base).href,{waitUntil:'domcontentloaded'});
      await page.waitForFunction(dep=>document.querySelector('#filtre-departement')?.value===dep,choix);
      const mauvaisLiens=await page.locator('[data-agenda-ligne]:not([hidden])').evaluateAll((rows,dep)=>rows.some(r=>r.dataset.departement!==dep),choix);
      if(mauvaisLiens)throw Error('Le lien direct depuis l’annuaire ne filtre pas correctement.');
      console.log('Filtres agenda validés : '+c.nom+', '+total+' périodes, département '+choix+', mois '+moisActif);
    }
    await page.screenshot({path:`${dossier}/${c.nom}.png`,fullPage:true});
    const okHttp=response?.ok()??false;
    const okLargeur=mesure.largeurDocument<=c.viewport.width+2 && mesure.debordements.length===0;
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
