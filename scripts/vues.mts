/**
 * Vues à hauteur d'écran, pour montrer le rendu.
 *
 * Les 56 captures livrées sont en pleine page : fidèles, mais si hautes
 * qu'elles deviennent illisibles une fois réduites. Celles-ci cadrent une
 * hauteur d'écran, à l'endroit qui compte sur chaque page.
 *
 *   npx tsx scripts/vues.mts
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const BASE = 'http://localhost:3100';
const SORTIE = resolve(import.meta.dirname, '../captures/vues');
await mkdir(SORTIE, { recursive: true });

/** `ancre` : identifiant vers lequel faire défiler avant la prise. */
const VUES = [
  { nom: '1-fil', url: '/fr' },
  { nom: '2-budget', url: '/fr/budget' },
  { nom: '2b-budget-explication', url: '/fr/budget', clic: 'GF10' },
  { nom: '3-vision', url: '/fr/vision', ancre: 'eu-ges-2030' },
  { nom: '4-impact', url: '/fr/impact' },
  { nom: '5-epargne', url: '/fr/epargne', ancre: 'services' },
  { nom: '6-identification', url: '/fr/identite' },
  { nom: '7-preferences', url: '/fr/preferences' },
  { nom: '8-sources', url: '/fr/sources' },
  { nom: '9-acte', url: '/fr/acte/51cd5ee5-0dad-5d7a-a899-10ae2b608dfe' },
] as const;

const navigateur = await chromium.launch();

for (const theme of ['clair', 'sombre'] as const) {
  const contexte = await navigateur.newContext({
    viewport: { width: 1280, height: 940 },
    deviceScaleFactor: 1,
    colorScheme: theme === 'sombre' ? 'dark' : 'light',
    reducedMotion: 'reduce',
  });
  await contexte.addInitScript(`try { localStorage.setItem('pc-theme', '${theme}'); } catch (e) {}`);
  const page = await contexte.newPage();

  for (const vue of VUES) {
    await page.goto(BASE + vue.url, { waitUntil: 'networkidle', timeout: 60_000 });
    await page.evaluate(() => document.fonts.ready);

    // Le panneau d'explication du budget ne s'ouvre qu'au clic sur une part.
    if ('clic' in vue && vue.clic) {
      await page.getByRole('button', { name: /Protection sociale/ }).first().click();
      await page.waitForTimeout(200);
      await page.evaluate(() => window.scrollBy(0, 380));
    }
    if ('ancre' in vue && vue.ancre) {
      await page.evaluate((a) => document.getElementById(a)?.scrollIntoView(), vue.ancre);
    }
    await page.waitForTimeout(250);

    await page.screenshot({ path: resolve(SORTIE, `${vue.nom}_${theme}.png`) });
    console.log(`  ${vue.nom}_${theme}.png`);
  }
  await contexte.close();
}

await navigateur.close();
console.log(`\nVues écrites dans captures/vues.`);
