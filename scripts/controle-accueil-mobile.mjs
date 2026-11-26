import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as attendre } from 'node:timers/promises';

const base = process.env.IC_VISUAL_BASE_URL ?? 'https://www.intimeconviction.fr';
const folder = 'controle-mobile-accueil';
const resultats = [];
const erreurs = [];

await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function ouvrirAccueil(page) {
  // Le contrôle et la publication démarrent en parallèle. Attendre que la
  // nouvelle une soit disponible avant de contrôler le site public.
  const fin = Date.now() + 180_000;
  do {
    const url = new URL(base);
    url.searchParams.set('controle-visuel', String(Date.now()));
    const response = await page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    if (response?.ok() && await page.locator('.une-reportages > article:not([hidden])').count() === 3) return;
    await attendre(5_000);
  } while (Date.now() < fin);
  throw new Error('La nouvelle une n’est pas disponible sur le site public.');
}

async function mesurer(article, nom, largeurAttendue) {
  const diagnostic = await article.evaluate(article => {
    const image = article?.querySelector('.une-couverture img');
    const rect = el => el?.getBoundingClientRect().toJSON() ?? null;
    return {
      largeur: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      titre: article?.querySelector('h3')?.innerText ?? null,
      image: rect(image),
      couverture: rect(article?.querySelector('.une-couverture')),
      lien: rect(article?.querySelector('.une-edito h3 a')),
      photoChargee: Boolean(image?.complete && image.naturalWidth > 0),
    };
  });
  resultats.push({ nom, ...diagnostic });
  const { largeur, scrollWidth, image, couverture, lien, photoChargee } = diagnostic;

  if (largeur !== largeurAttendue || scrollWidth > largeurAttendue + 2) {
    erreurs.push(`${nom}: viewport ${largeur}px, document ${scrollWidth}px, largeur attendue ${largeurAttendue}px`);
  }
  if (!photoChargee) erreurs.push(`${nom}: image principale non chargée`);
  if (!image || !couverture || !lien) {
    erreurs.push(`${nom}: image, couverture ou lien absent`);
    return;
  }
  if (Math.abs(image.width - couverture.width) > 2 || lien.x < -2 || lien.right > largeurAttendue + 2) {
    erreurs.push(`${nom}: image ou titre mal aligné`);
  }
  if (Math.abs(image.width / image.height - 16 / 10) > .04 || lien.y < image.bottom - 2) {
    erreurs.push(`${nom}: dimensions de la photo ou position du titre inattendues`);
  }
}

try {
  for (const largeur of [375, 1440]) {
    const mobile = largeur === 375;
    const page = await browser.newPage({
      viewport: { width: largeur, height: 920 }, deviceScaleFactor: 1,
      isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce',
    });
    await ouvrirAccueil(page);
    const refus = page.getByRole('button', { name: 'Tout refuser' });
    if (await refus.isVisible()) await refus.click();
    await page.evaluate(() => document.fonts.ready);
    const articles = page.locator('.une-reportages > article');
    const nombre = await articles.count();
    if (nombre !== 3) erreurs.push(`Viewport ${largeur}: ${nombre} articles au lieu de trois`);
    const photos = await articles.locator('img').evaluateAll(images => images.map(image => image.getAttribute('src')));
    if (new Set(photos).size !== nombre) erreurs.push(`Viewport ${largeur}: visuels répétés à la une`);
    for (let i = 0; i < nombre; i++) {
      const article = articles.nth(i);
      await article.waitFor();
      await article.locator('img').evaluate(image => image.decode());
      await mesurer(article, `une-${largeur}-${i + 1}`, largeur);
    }
    await page.screenshot({ path: `${folder}/une-${largeur}.png` });

    const presse = page.locator('.presse-accueil');
    await presse.scrollIntoViewIfNeeded();
    const images = await presse.locator('.visuel-presse img').evaluateAll(async elements => {
      await Promise.allSettled(elements.map(image => image.decode()));
      return elements.map(image => ({
        rect: image.getBoundingClientRect().toJSON(),
        chargee: image.naturalWidth > 0,
        src: image.currentSrc,
      }));
    });
    resultats.push({ nom: `presse-${largeur}`, images });
    if (images.length !== 5 || new Set(images.map(image => image.src)).size !== images.length) {
      erreurs.push(`Presse ${largeur}px : cinq illustrations distinctes attendues`);
    }
    images.forEach(({ rect, chargee }, i) => {
      if (!chargee || rect.x < -2 || rect.right > largeur + 2 || Math.abs(rect.width - rect.height) > 2) {
        erreurs.push(`Presse ${largeur}px : vignette ${i + 1} non chargée ou mal dimensionnée`);
      }
    });
    await page.screenshot({ path: `${folder}/presse-${largeur}.png` });
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile(`${folder}/rapport.json`, JSON.stringify({ resultats, erreurs }, null, 2) + '\n');
}
if (erreurs.length) {
  console.error(erreurs.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Accueil vérifié à 375 et 1 440 px : trois articles et cinq vignettes distinctes.');
}
