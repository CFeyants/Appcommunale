# Kraainem — Plateforme citoyenne (maquette)

Maquette interactive de la plateforme citoyenne du **pilote communal**, déclinaison
à l'échelle d'une commune des principes du livre *Vivre pour produire*.

> ⚠️ **Démonstration.** Les données de programme (décisions, budgets, projets,
> engagements, activités) sont **fictives**. Les données de cadre sur la commune
> (population, superficie, conseil, etc.) sont **réelles et sourcées** (2024).

## Sections

Pour vous (fil personnalisé, anti-capture) · Le cap · Décisions · **Engagements**
(le recours) · Budget · Projets & fonds (triple comptabilité) · Familles · Jeunes ·
Culture & sport · Entraide (identité via itsme) · Tableau de bord (KPI + pilote évaluable).

## Principes tenus

Rendre visible **et** lisible (étiquette de trajectoire) · aucun score agrégé ni
classement · données brutes exportables · transparence des institutions / protection
des personnes · accessibilité rendue visible · pilote évaluable avec clause d'arrêt.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · lucide-react.

## Développer

```bash
npm install      # ou pnpm install
npm run dev      # http://localhost:5173
npm run build    # build de production -> dist/
npm run preview  # prévisualiser le build
```

## Déployer sur Vercel

Le projet est un site Vite standard — Vercel le détecte automatiquement.

1. Sur [vercel.com](https://vercel.com), **Add New… → Project**.
2. **Import** le dépôt GitHub `CFeyants/Appcommunale`.
3. Vercel détecte **Framework Preset : Vite** — laisser les valeurs par défaut :
   - Build Command : `vite build` (ou `npm run build`)
   - Output Directory : `dist`
   - Install Command : `npm install` (ou `pnpm install`)
4. **Deploy**. À la fin, une URL `https://appcommunale.vercel.app` (ou similaire) est créée.
5. Chaque `git push` sur `main` redéploie automatiquement ; chaque branche/PR obtient
   une URL de prévisualisation.

### Brancher un nom de domaine

Project → **Settings → Domains** → ajouter le domaine, puis suivre l'instruction DNS
(un enregistrement `CNAME` vers `cname.vercel-dns.com`, ou les `A` records indiqués).
