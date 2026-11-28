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
  { nom:'recherche-ordinateur', url:'/recherche/?q=Jubillar', viewport:{width:1440,height:900} },
  { nom:'recherche-mobile', url:'/recherche/?q=Jubillar', viewport:{width:390,height:844}, isMobile:true },
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
      // Un sous-menu mobile fermé est placé intentionnellement hors écran à gauche.
      // Il ne crée pas de défilement horizontal : ne pas le signaler comme débordement.
      const fautifs=rects.filter(({rect})=>rect.width>0&&rect.right>innerWidth+2)
        .slice(0,8).map(({el,rect})=>({balise:el.tagName.toLowerCase(),classe:String(el.className||'').slice(0,90),gauche:Math.round(rect.left),droite:Math.round(rect.right)}));
      return {largeurFenetre:innerWidth,largeurDocument:doc.scrollWidth,debordements:fautifs,
        titre:document.querySelector('h1')?.textContent?.trim()??'',
        liensDossiers:[...document.querySelectorAll('a[href^="/dossiers/"]')].length};
    });
    // Une seule entrée « Revue de presse », rattachée à Actualité.
    const revue=page.locator('header .navigation-principale a[href="/revue-de-presse/"]');
    if(await revue.count()!==1)throw Error('Revue de presse absente ou présente en doublon dans la navigation.');
    if(await revue.locator('xpath=ancestor::li[contains(@class,"navigation-entree")]').count()!==1){
      throw Error('Revue de presse non rattachée au sous-menu Actualité.');
    }
    const actualite=page.locator('header .navigation-entree').filter({has:page.locator('a[href="/rubrique/cours-du-jour/#articles-redaction"]')});
    if(await actualite.locator('a[href="/revue-de-presse/"]').count()!==1){
      throw Error('Revue de presse absente du menu Actualité.');
    }
    if(c.nom.startsWith('agenda-')){
      if(await page.locator('header .navigation-acces').count()>0)throw Error('Ancien menu Infos pratiques en doublon.');
      for(const href of ['/agenda/#sessions-annoncees','/agenda/#audiences-a-verifier','/veille-roles/','/annuaire/#repertoire','/assister/']){
        if(await page.locator('header .navigation-principale a[href="'+href+'"]').count()===0){
          throw Error('Accès manquant dans le menu Agenda : '+href);
        }
      }
      if(await page.locator('.visite-assises a[href="/annuaire/#repertoire"]').count()===0 ||
         await page.locator('.visite-assises a[href="/assister/"]').count()===0){
        throw Error('Liens pratiques absents du parcours Agenda.');
      }
      const departement=page.locator('#filtre-departement');
      const mois=page.locator('#filtre-mois');
      await departement.waitFor();
      const disponibles=await departement.locator('option').evaluateAll(options=>options.map(o=>o.value).filter(Boolean));
      const lignes=page.locator('[data-agenda-ligne]');
      const total=await lignes.count();
      if(total===0)throw Error('Agenda sans périodes : vérifier les données avant de tester les filtres.');
      if(disponibles.length===0)throw Error('Aucun département proposé dans l’agenda.');
      // Une période achevée doit être occultée même si la page HTML est ancienne.
      const ancienne=page.locator('[data-agenda-ligne]').first();
      const ancienneFin=await ancienne.getAttribute('data-fin');
      await ancienne.evaluate(el=>{el.dataset.fin='2001-01-01';});
      await departement.selectOption(disponibles[0]);
      if(await ancienne.isVisible())throw Error('Une période expirée reste visible.');
      await ancienne.evaluate((el,fin)=>{el.dataset.fin=fin;},ancienneFin);
      await departement.selectOption('');
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
    if(c.nom.startsWith('recherche-')){
      const requete=page.locator('#requete');
      await requete.waitFor();
      await page.waitForFunction(()=>document.querySelector('#compteur')?.textContent?.includes('article'),null,{timeout:25000});
      if(await requete.inputValue()!=='Jubillar')throw Error('Requête préremplie perdue.');
      const resultat=page.locator('#resultats > li');
      if(await page.locator('#dossiers-recherche:not([hidden]) a[href="/dossiers/affaire-jubillar/"]').count()!==1)
        throw Error('Fiche dossier Jubillar absente.');
      // Le dossier peut exister sans article propre de la rédaction. Ne pas en inventer.
      const indexReponse=await page.request.get(new URL('/index-recherche.json',base).href);
      if(!indexReponse.ok())throw Error('Index du journal inaccessible.');
      const entrees=await indexReponse.json();
      const ancien=entrees.find(a=>a.annee<=2023 && a.annee>=2016 && a.titre?.length>=20 &&
        a.titre.length<100 && typeof a.chemin==='string' && a.image);
      if(!ancien)throw Error('Pas de référence historique pour tester la recherche.');
      await requete.fill(ancien.titre);
      await page.waitForFunction(q=>new URL(location.href).searchParams.get('q')===q,ancien.titre,{timeout:15000});
      await page.waitForFunction(chemin=>[...document.querySelectorAll('#resultats h3 a')].some(a=>a.getAttribute('href')===chemin),ancien.chemin,{timeout:25000});
      const chemins=await resultat.locator('h3 a').evaluateAll(liens=>liens.map(a=>a.getAttribute('href')));
      if(new Set(chemins).size!==chemins.length)throw Error('Résultats du journal dupliqués.');
      const article=page.locator('#resultats > li').filter({has:page.locator('h3 a[href="'+ancien.chemin+'"]')}).first();
      if(await article.locator('.meta').count()!==1)throw Error('Date et rubrique absentes du résultat historique.');
      const photo=article.locator('img.photo-resultat');
      if(await photo.count()!==1)throw Error('Photographie non présentée pour un article qui possède une image.');
      await photo.scrollIntoViewIfNeeded();
      await page.waitForFunction(chemin=>{
        const lien=[...document.querySelectorAll('#resultats h3 a')].find(a=>a.getAttribute('href')===chemin);
        const img=lien?.closest('li')?.querySelector('img.photo-resultat');
        return img?.complete && img.naturalWidth>0;
      },ancien.chemin,{timeout:20000});
      const annee=page.locator('#annee');
      await annee.selectOption(String(ancien.annee));
      await page.waitForFunction(y=>new URL(location.href).searchParams.get('annee')===y,String(ancien.annee));
      await page.waitForFunction(chemin=>[...document.querySelectorAll('#resultats h3 a')].some(a=>a.getAttribute('href')===chemin),ancien.chemin,{timeout:15000});
      const metas=await resultat.locator('.meta').allTextContents();
      if(metas.some(t=>!t.includes(String(ancien.annee))))throw Error('Année sélectionnée non respectée.');
      const rubrique=page.locator('#rubrique');
      await rubrique.selectOption(ancien.rubrique);
      await page.waitForFunction(r=>new URL(location.href).searchParams.get('rubrique')===r,ancien.rubrique);
      const urls=await resultat.locator('h3 a').evaluateAll(liens=>liens.map(a=>a.getAttribute('href')));
      const autorises=new Set(entrees.filter(x=>x.annee===ancien.annee && x.rubrique===ancien.rubrique).map(x=>x.chemin));
      if(urls.some(u=>!autorises.has(u)))throw Error('Filtres année et rubrique non respectés.');
      await page.locator('#effacer').click();
      await page.waitForFunction(()=>document.querySelector('#requete')?.value===''&&document.querySelector('#annee')?.value===''&&document.querySelector('#rubrique')?.value==='');
      console.log('Recherche validée : '+c.nom+', dossier Jubillar, archive '+ancien.annee+', illustration, filtres et URLs uniques');
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
