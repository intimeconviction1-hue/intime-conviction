import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.IC_VISUAL_BASE_URL ?? 'https://www.intimeconviction.fr';
const folder = 'controle-mobile-accueil';
await mkdir(folder,{recursive:true});
const browser = await chromium.launch({headless:true});
const resultats=[];
const erreurs=[];
const mesurer = async (page,nom,attendu) => {
  const diagnostic = await page.evaluate(() => {
    const largeur = document.documentElement.clientWidth;
    const article = [...document.querySelectorAll('.une-carrousel .article-redaction-une')].find(el => !el.hidden);
    const image = article?.querySelector('.une-couverture img');
    const couverture = article?.querySelector('.une-couverture');
    const texte = article?.querySelector('.une-edito');
    const lien = article?.querySelector('.lire-une');
    const rect = el => { const r=el?.getBoundingClientRect(); return r ? {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom} : null; };
    const photosPresse=[...document.querySelectorAll('.presse-accueil .visuel-presse img')];
    return {
      largeur, scrollWidth:document.documentElement.scrollWidth,
      titre:article?.querySelector('h3')?.innerText??null,
      image:rect(image),couverture:rect(couverture),
      texte:rect(texte),lien:rect(lien),
      photoChargee:!!image?.complete && image.naturalWidth>0,
      imagesPresse:photosPresse.map(el=>({rect:rect(el),chargee:el.complete&&el.naturalWidth>0}))
    };
  });
  resultats.push({nom,...diagnostic});
  if(diagnostic.largeur!==attendu)erreurs.push(`${nom}: viewport réel ${diagnostic.largeur}, attendu ${attendu}`);
  if(diagnostic.scrollWidth>attendu+2)erreurs.push(`${nom}: débordement horizontal ${diagnostic.scrollWidth}px`);
  if(!diagnostic.photoChargee)erreurs.push(`${nom}: image principale non chargée`);
  if(!diagnostic.image||!diagnostic.couverture||!diagnostic.texte||!diagnostic.lien)erreurs.push(`${nom}: élément essentiel absent`);
  else {
    if(Math.abs(diagnostic.image.width-diagnostic.couverture.width)>2||Math.abs(diagnostic.image.height-diagnostic.couverture.height)>2)
      erreurs.push(`${nom}: image ne remplit pas le cadre`);
    if(diagnostic.texte.x< -2||diagnostic.texte.right>attendu+2||diagnostic.lien.right>attendu+2)
      erreurs.push(`${nom}: texte ou lien déborde horizontalement`);
    if(attendu===375) {
      if(Math.abs(diagnostic.couverture.width/diagnostic.couverture.height-16/9)>0.035)
        erreurs.push(`${nom}: proportion photo différente de 16/9`);
      if(diagnostic.texte.y<diagnostic.couverture.bottom-2)
        erreurs.push(`${nom}: texte recouvert par l'image`);
    }
  }
  return diagnostic;
};
try {
  for(const taille of [375,1440]){
    const page=await browser.newPage({viewport:{width:taille,height:812},deviceScaleFactor:1,isMobile:taille===375,hasTouch:taille===375});
    const response=await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
    if(!response?.ok())throw Error('Accueil HTTP '+response?.status());
    await page.locator('.une-carrousel .article-redaction-une').first().waitFor({timeout:15000});
    await page.evaluate(()=>document.fonts.ready);
    const boutons=page.locator('.une-carrousel [data-aller]');
    if(await boutons.count()!==3)erreurs.push(`Viewport ${taille}: carrousel sans trois boutons`);
    for(let i=0;i<3;i++){
      await boutons.nth(i).click();
      await page.waitForTimeout(180);
      await mesurer(page,`une-${taille}-${i+1}`,taille);
      await page.screenshot({path:`${folder}/une-${taille}-${i+1}.png`,fullPage:false});
    }
    const actuel=resultats[resultats.length-1];
    if(taille===375){
      if(actuel.imagesPresse.length!==5)erreurs.push('Presse mobile : nombre de photos différent de cinq');
      actuel.imagesPresse.forEach((im,i)=>{
        if(!im.chargee)erreurs.push(`Presse mobile : photo ${i+1} non chargée`);
        if(im.rect && (im.rect.right>377 || im.rect.x< -2))erreurs.push(`Presse mobile : photo ${i+1} déborde`);
        if(im.rect && Math.abs(im.rect.width/im.rect.height-16/9)>0.05)erreurs.push(`Presse mobile : ratio photo ${i+1} incohérent`);
      });
    }
    await page.locator('.presse-accueil').scrollIntoViewIfNeeded();
    await page.screenshot({path:`${folder}/presse-${taille}.png`,fullPage:false});
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile(`${folder}/rapport.json`,JSON.stringify({resultats,erreurs},null,2)+'\n');
}
if(erreurs.length){
  console.error('Contrôle à corriger : '+erreurs.join(' | '));
  process.exitCode=1;
}else console.log('Accueil contrôlé en 375px et 1440px : trois cartes lisibles, photos de presse cohérentes, aucun débordement.');
