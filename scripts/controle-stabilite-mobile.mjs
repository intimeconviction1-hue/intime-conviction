import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.IC_VISUAL_BASE_URL ?? 'http://127.0.0.1:4321';
const routes = ['/', '/carte/', '/annuaire/', '/assister/'];
const reportPath = 'controle-stabilite-mobile/rapport.json';
const resultats = [];
const erreurs = [];

await mkdir('controle-stabilite-mobile', { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const route of routes) {
    const page = await browser.newPage({
      viewport: { width: 375, height: 812 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'reduce',
    });
    await page.addInitScript(() => {
      window.__icStabilite = { cls: 0, lcp: null, shifts: [], interactionMaxMs: null };
      try {
        new PerformanceObserver(entries => {
          for (const entry of entries.getEntries()) {
            if (entry.hadRecentInput) continue;
            window.__icStabilite.cls += entry.value;
            window.__icStabilite.shifts.push({
              value: entry.value,
              time: entry.startTime,
              sources: (entry.sources ?? []).map(source => ({
                node: source.node?.tagName ?? null,
                classe: typeof source.node?.className === 'string' ? source.node.className : '',
                texte: source.node?.textContent?.trim().slice(0, 80) ?? '',
                avant: source.previousRect?.toJSON?.() ?? null,
                apres: source.currentRect?.toJSON?.() ?? null,
              })),
            });
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {}
      try {
        new PerformanceObserver(entries => {
          for (const entry of entries.getEntries()) {
            window.__icStabilite.lcp = Math.round(entry.startTime);
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch {}
      try {
        new PerformanceObserver(entries => {
          for (const entry of entries.getEntries()) {
            window.__icStabilite.interactionMaxMs = Math.max(window.__icStabilite.interactionMaxMs ?? 0, entry.duration);
          }
        }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
      } catch {}
    });

    try {
      const response = await page.goto(new URL(route, base).href, { waitUntil: 'networkidle', timeout: 45_000 });
      if (!response?.ok()) erreurs.push(route + ': réponse HTTP ' + (response?.status() ?? 'absente'));
      const refus = page.getByRole('button', { name: 'Tout refuser' });
      if (await refus.isVisible().catch(() => false)) await refus.click();
      await page.evaluate(async () => {
        await document.fonts.ready;
        const images = [...document.images];
        for (const image of images) image.loading = 'eager';
        await Promise.allSettled(images.map(image => image.decode()));
      });
      const hauteur = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < hauteur; y += 650) {
        await page.evaluate(position => window.scrollTo(0, position), y);
        await page.waitForTimeout(100);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      const mesure = await page.evaluate(() => ({
        titre: document.title,
        largeur: document.documentElement.clientWidth,
        largeurDocument: document.documentElement.scrollWidth,
        ...window.__icStabilite,
      }));
      resultats.push({ route, ...mesure });
      console.log('Mesure mobile ' + route + ': ' + JSON.stringify({ cls: Number(mesure.cls.toFixed(3)), lcp: mesure.lcp, interactionMaxMs: mesure.interactionMaxMs }));
      if (mesure.largeurDocument > 377) erreurs.push(route + ': débordement horizontal à 375 px (' + mesure.largeurDocument + ' px)');
      if (mesure.cls > 0.10) erreurs.push(route + ': CLS ' + mesure.cls.toFixed(3) + ' supérieur à 0,10');
      if (mesure.lcp === null || mesure.lcp > 2500) erreurs.push(route + ': LCP ' + (mesure.lcp ?? 'non mesuré') + ' ms, cible 2 500 ms');

      const menu = page.locator('.navigation-bouton-rubriques');
      if (await menu.count()) {
        await menu.click();
        if (await menu.getAttribute('aria-expanded') !== 'true') erreurs.push(route + ': menu mobile inactif');
        await menu.click();
        if (await menu.getAttribute('aria-expanded') !== 'false') erreurs.push(route + ': menu mobile impossible à refermer');
      }
    } catch (error) {
      erreurs.push(route + ': ' + (error?.message ?? String(error)));
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
  await writeFile(reportPath, JSON.stringify({ largeur: 375, resultats, erreurs }, null, 2) + '\n');
}
if (erreurs.length) {
  console.error(erreurs.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Accueil, carte, annuaire et page Assister : CLS ≤ 0,10, LCP ≤ 2 500 ms, menu mobile fonctionnel à 375 px.');
}
