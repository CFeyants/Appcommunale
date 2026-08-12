# Rapport — Lot 1 : socle

## Livré

- Monorepo npm workspaces : `apps/web`, `packages/core`, `packages/connectors`,
  `packages/ui`, `data`, `docs`.
- **Modèle de données aligné sur OSLO**, avec l'identifiant cité dans chaque type et les
  extensions justifiées une par une dans [`docs/vocabulaire.md`](docs/vocabulaire.md).
  C'est le seul choix irréversible du lot ; il a été pris avant toute écriture d'écran.
- Schémas Zod pour `Item`, `Seance`, `Objectif`, `Initiative`, `Budget`, `Droit`,
  `Service`, `Entreprise`, `Projet`, `Question`, `Proposition`, `Signalement`,
  `Indicateur`, `EtatSource`. Les types TypeScript sont dérivés des schémas : aucune dérive
  possible entre ce qui est validé et ce qui est typé.
- Jetons de design en OKLCH, mode clair et mode sombre traités comme deux livrables.
  Palette de statut issue d'Okabe-Ito, conçue pour rester distinguable en deutéranopie,
  protanopie et tritanopie.
- Composants : primitives Radix habillées aux jetons du projet (bouton, interrupteur, case
  à cocher, onglets, séparateur, dialogue, accordéon, sélecteur), atomes du produit
  (statut, catégorie, puce de niveau, pastille de pertinence, ligne de source, nombre
  héroïque, bandeaux d'honnêteté), et quatre graphiques SVG écrits à la main.
- i18n FR / NL / EN, chaîne par chaîne. Le dictionnaire français fixe la **forme** ; une
  clé absente en néerlandais est une erreur de compilation.
- Navigation à cinq entrées : barre inférieure à 390 px, barre horizontale au-delà.
- Sélecteur de territoire et couverture déclarée par niveau
  (`packages/core/src/territoires.ts`, affichée sur `/fr/sources`).

## Critères d'acceptation

| Critère | État | Vérification |
|---|---|---|
| shadcn/ui, jetons, clair et sombre | ✅ | 56 captures dans les deux thèmes |
| i18n trilingue | ✅ | `/fr`, `/nl`, `/en` construits statiquement |
| Barre de navigation à cinq entrées | ✅ | capture `3-vision_fr_sombre_390.png` |
| Sélecteur de territoire, couverture déclarée | ✅ | `/fr/sources`, section « Couverture déclarée » |
| Modèle aligné sur OSLO, `/docs/vocabulaire.md` | ✅ | espaces de noms vérifiés en HTTP 200 |
| Chaque type cite son terme OSLO ou justifie son absence | ✅ | `docs/vocabulaire.md`, tableau complet |

## Volume réel

- 4 paquets, 0 dépendance de composants tierce (Radix et lucide exceptés).
- 6 espaces de noms OSLO vérifiés, 1 constaté inexistant (`dienstencataloog`, HTTP 404) —
  d'où le repli documenté sur CPSV-AP pour les services publics.
- 14 schémas Zod, 3 dictionnaires complets.

## Écarts

Aucun composant repris de 21st.dev — décision D4 dans [`DECISIONS.md`](DECISIONS.md).
Le connecteur MCP est branché et reste disponible.

## Défaut trouvé et corrigé

Les classes utilitaires écrites dans `packages/ui` n'étaient pas scannées par Tailwind : la
détection automatique part du dossier de compilation. Symptôme observé : la barre du
graphique budgétaire avait une hauteur mesurée de **0 pixel**. Corrigé par deux directives
`@source` explicites dans `packages/ui/src/styles.css`.
