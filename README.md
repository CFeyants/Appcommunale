# App communale — Pilote (Brique 1)

Maquette navigable de l'**application communale de transparence**, première des
trois briques du projet pilote décrit dans le vault ATLAS
(*Monde-Meilleur* → note de cadrage « Pilote communal »).

> Le pilote traduit les propositions du livre à l'échelle d'une seule commune.
> Cette maquette couvre la **Brique 1 — transparence**, à construire en premier :
> données publiques, aucune contrainte réglementaire, valeur immédiate.

## Le principe central : l'étiquette de trajectoire

Aucune décision, dépense ou projet n'est **orphelin**. Chacun porte un lien
explicite vers l'**orientation de long terme** qu'il sert (le « cap communal »),
elle-même reliée vers le haut aux caps régional, national et européen. Le citoyen
ne voit jamais un élément isolé : il voit toujours *pourquoi* il existe et *à quoi*
il se rattache.

Deux règles héritées du document :

- **Données brutes exportables** partout (sinon c'est une plaquette de com, pas un
  commun de transparence).
- **Aucun score agrégé**, aucune note, aucun classement des élus (un chiffre
  agrégé transforme la transparence en arme partisane).

## Les écrans

| Route         | Écran            | Contenu                                                        |
| ------------- | ---------------- | ------------------------------------------------------------- |
| `/`           | Le cap           | Les 3 orientations, leur cible, et le lien montant            |
| `/decisions`  | Décisions        | Décisions du conseil, coût, état, étiquette de trajectoire    |
| `/budget`     | Budget           | Voté vs exécuté par orientation (graphique + détail)          |
| `/projets`    | Projets          | Jalons, retards, écarts au plan                               |
| `/donnees`    | Données ouvertes | Export JSON de chaque jeu de données                          |

Les trois orientations de démonstration (commune fictive de *Tilleul-sur-Meuse*) :
**alimentation & relocalisation**, **climat**, **transmission & soin**.

## Stack

Next.js 15 (App Router) · React 18 · Tailwind CSS v4 · Recharts · lucide-react.
Mêmes fondations que le site *ferme-des-hirondelles*, pour rester familier et
directement déployable (Vercel + domaine).

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
```

## Statut & suite

- [x] **Brique 1** — transparence (cette maquette) : cap, décisions, budget,
      projets, données ouvertes.
- [ ] **Brique 1 (guichet)** — face transactionnelle « dites-le-nous une fois »
      (itsme, eBox, traçabilité d'accès).
- [ ] **Brique 2** — monnaie locale adossée à l'euro (cadrage MiCA d'abord).
- [ ] **Brique 3** — infrastructure de lien / Maison de la transmission
      (hors application : terrain).

> ⚠️ Toutes les données de cette maquette sont **fictives**, à titre de
> démonstration. La structure, elle, est fidèle au document de cadrage.
