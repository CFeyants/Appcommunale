/**
 * Aperçus ciblés, pour vérifier un détail sans regénérer les 56 captures.
 *
 *   npx tsx scripts/apercu.mts /fr/budget 1280 clair haut
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const [chemin = '/fr', largeurArg = '1280', theme = 'clair', zone = 'haut'] = process.argv.slice(2);
const largeur = Number(largeurArg);
const SORTIE = resolve(import.meta.dirname, '../captures/apercus');
await mkdir(SORTIE, { recursive: true });

const navigateur = await chromium.launch();
const contexte = await navigateur.newContext({
  viewport: { width: largeur, height: largeur < 500 ? 844 : 900 },
  deviceScaleFactor: 2,
  colorScheme: theme === 'sombre' ? 'dark' : 'light',
  reducedMotion: 'reduce',
});
await contexte.addInitScript(`try { localStorage.setItem('pc-theme', '${theme}'); } catch (e) {}`);

const page = await contexte.newPage();
await page.goto(`http://localhost:3100${chemin}`, { waitUntil: 'networkidle', timeout: 60_000 });
await page.evaluate(() => document.fonts.ready);
if (zone !== 'haut') await page.evaluate((z) => document.querySelector(`#${z}`)?.scrollIntoView(), zone);
await page.waitForTimeout(300);

const nom = `apercu_${chemin.replace(/\W+/g, '-')}_${largeur}_${theme}_${zone}.png`;
await page.screenshot({ path: resolve(SORTIE, nom) });
console.log(resolve(SORTIE, nom));

await navigateur.close();
