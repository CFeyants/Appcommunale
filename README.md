# Kraainem — Plateforme citoyenne (maquette)

Maquette interactive de la plateforme citoyenne du **pilote communal**, déclinaison
à l'échelle d'une commune des principes du livre *Vivre pour produire*.

> ⚠️ **Démonstration.** Les données de programme (décisions de démonstration,
> budgets, projets, engagements, activités) sont **fictives**. Les données de
> cadre (population, superficie, conseil) et **tout l'onglet Sources & données**
> ainsi que **la liste des commerces** sont **réels et sourcés**.

## Sections

Pour vous (fil personnalisé, anti-capture) · Le cap · Décisions · **Engagements**
(le recours) · Budget · Projets & fonds (triple comptabilité) · **Sources & données** ·
Familles · Jeunes · Culture & sport · **Commerces** · Entraide (identité via itsme) ·
Tableau de bord (KPI + pilote évaluable).

## Données réelles branchées

Relevées et vérifiées le **8 août 2026** depuis les API citées.

| Source | Ce qu'elle donne | Accès |
|---|---|---|
| Lokaal Beslist | 1 063 séances du conseil et du collège (2021 → 2026) | `api/lokaalbeslist.js` |
| Fluvius (open data) | 31,8 GWh d'électricité et 92,0 GWh de gaz consommés sur 12 mois, 2,3 GWh réinjectés, 986 installations photovoltaïques (5 188 kVA) | `api/fluvius.js` |
| VMM — OGC API Features | 7 points de mesure des eaux de surface situés à Kraainem (22 dans la fenêtre) | relevé, dans `src/data.ts` |
| IRCELINE | 137 stations en Belgique, **aucune à Kraainem** | relevé |
| Basisregisters Vlaanderen | NIS 23099 confirmé | relevé |
| OpenStreetMap (Overpass) | 108 commerces et artisans de la commune | relevé, requête dans `src/data.ts` |

Deux écarts avec le dossier « Les données » (7 août 2026), corrigés ici :
les identifiants des jeux Fluvius qui y figurent **n'existent plus** dans le
catalogue (les bons sont `1-19-totaal-gealloceerd-volume` et
`1_20-lijst-van-decentrale-productie-installaties-…`), et l'API CKAN de
data.gov.be n'a pas répondu au chemin standard — le dataset BBC hebdomadaire
reste donc **à localiser**.

Chaque source porte sa mention et sa licence dans l'interface : c'est une
obligation juridique (Modellicentie Gratis Hergebruik, CC BY 4.0, ODbL) autant
que ce qui rend l'outil crédible.

## Budget & tableau de bord

**Budget** — le total décomposé une seule fois (part-to-whole), puis le voté
comparé à l'engagé par orientation, puis Kraainem face à ses voisines. Le fait
que la page doit rendre visible : **5,5 % du budget est rattaché à une
orientation**, 94,5 % ne le sont pas.

**Tableau de bord** — quatre échelles emboîtées, chacune avec sa trajectoire
sur huit relevés, et chacune mesurant à la fois l'environnemental **et** le
social :

1. Objectifs globaux (ce à quoi la commune se rattache)
2. Objectifs communaux (ce qu'elle pilote, et sur quoi elle peut être tenue)
3. Objectifs des commerces participants (31 des 108 commerces)
4. Mes objectifs (privés, non comparatifs, jamais agrégés en une note)

Un indicateur qui se dégrade est affiché comme tel, pas masqué.

### Règles de visualisation tenues

- Palette catégorielle **validée pour la vision des couleurs** — écart minimal
  9,1 (protanopie) et 22,9 (vision normale) sur la paire adjacente la plus
  serrée ; revalidée séparément pour le thème sombre (8,4 / 19,8).
- Les quatre teintes passant sous 3:1 en thème clair, **chaque segment porte une
  étiquette et chaque graphique a sa vue tableau** — ce n'est pas un agrément,
  c'est ce qui rend l'encodage licite.
- Un statut n'est **jamais** porté par la couleur seule : icône + mot.
- Couleurs de statut choisies pour tenir le contraste texte AA (≥ 4,5:1) dans
  les deux thèmes.
- Écart de 2 px de surface entre les remplissages, jamais un contour ; le repère
  de seuil est doublé d'un anneau de surface pour rester visible sur la partie
  remplie.
- Thème sombre **choisi**, pas déduit : chaque teinte reprise un cran plus clair
  et revalidée sur la surface sombre.

Les sections sont adressables par ancre — `#budget`, `#bord`, `#sources`,
`#commerces` — pour qu'une décision qu'on veut faire lire puisse s'envoyer par
un lien.

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
