/**
 * Captures d'écran des livrables.
 *
 * Six écrans — les cinq de la navigation plus le parcours d'identification —
 * en clair et en sombre, à 390 px et à 1280 px, en français et en néerlandais.
 * Quarante-huit images, écrites dans /captures.
 *
 *   npm run captures            (le serveur doit tourner sur le port 3100)
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:3100';
const SORTIE = resolve(import.meta.dirname, '../captures');

const ECRANS = [
  { cle: '1-fil', chemin: '' },
  { cle: '2-budget', chemin: '/budget' },
  { cle: '3-vision', chemin: '/vision' },
  { cle: '4-impact', chemin: '/impact' },
  { cle: '5-epargne', chemin: '/epargne' },
  { cle: '6-identification', chemin: '/identite' },
  { cle: '7-preferences', chemin: '/preferences' },
] as const;

const LANGUES = ['fr', 'nl'] as const;
const THEMES = ['clair', 'sombre'] as const;
const LARGEURS = [
  { cle: '390', largeur: 390, hauteur: 844 },
  { cle: '1280', largeur: 1280, hauteur: 900 },
] as const;

await mkdir(SORTIE, { recursive: true });

const navigateur = await chromium.launch();
let n = 0;

for (const theme of THEMES) {
  for (const format of LARGEURS) {
    const contexte = await navigateur.newContext({
      viewport: { width: format.largeur, height: format.hauteur },
      // Densité 1 : les captures pleine page à densité 2 pèsent 69 Mo pour
      // les 56 images, ce qui n'a pas sa place dans un dépôt. Le texte reste
      // parfaitement lisible à 1280 et à 390 points CSS.
      deviceScaleFactor: 1,
      locale: 'fr-BE',
      colorScheme: theme === 'sombre' ? 'dark' : 'light',
      reducedMotion: 'reduce',
    });

    // Le thème est lu depuis le stockage local avant la première peinture.
    await contexte.addInitScript(`try { localStorage.setItem('pc-theme', '${theme === 'sombre' ? 'sombre' : 'clair'}'); } catch (e) {}`);

    const page = await contexte.newPage();

    for (const langue of LANGUES) {
      for (const ecran of ECRANS) {
        const url = `${BASE}/${langue}${ecran.chemin}`;
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
        // Les polices auto-hébergées doivent être posées avant la capture,
        // sinon les titres sont capturés dans la police de repli.
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(250);

        const nom = `${ecran.cle}_${langue}_${theme}_${format.cle}.png`;
        await page.screenshot({ path: resolve(SORTIE, nom), fullPage: true });
        n++;
        console.log(`  ${nom}`);
      }
    }

    await contexte.close();
  }
}

await navigateur.close();
console.log(`\n${n} captures écrites dans /captures.`);
