# Plateforme citoyenne

Ce que la commune, la Communauté, la Région, la Belgique et l'Union décident, dépensent,
promettent et tiennent. Chaque information remonte à son acte d'origine.

Commune pilote : **Kraainem**, code NIS 23099, commune à facilités de la périphérie
flamande — donc Communauté flamande, Région flamande, Belgique, Union.

---

## Ce qui nous sépare des applications communales existantes

Il existe une catégorie mûre d'applications communales : Neocity équipe plus de cinq cents
collectivités, iDcity et d'autres occupent le créneau de la participation, Decidim est
l'infrastructure libre de référence née à Barcelone. Nous leur empruntons beaucoup — la
granularité des notifications, le mode hors ligne, les services utilitaires, la conformité
d'accessibilité traitée comme un livrable, et l'inspiration de Decidim pour la modération.

Trois choses nous en séparent, et ce sont elles qui empêcheront ce produit de dériver vers
ce qui existe déjà.

**1. Leur contenu est celui que la collectivité choisit de publier.** Ces applications
agrègent le site de la commune et sa page Facebook : c'est un canal de communication
municipale, bien fait. Nous allons chercher les actes à la source officielle, nous
appliquons un test d'admission, et nous reformulons indépendamment — y compris ce que la
commune préférerait ne pas mettre en avant.

**2. Elles s'arrêtent à la commune.** L'empilement des cinq niveaux est notre raison
d'exister et l'essentiel de notre difficulté.

**3. Leur client est la collectivité.** Un fournisseur payé par une commune ne peut
structurellement pas écrire « cette commune n'a pas adopté son règlement de participation »,
ni « cette initiative a huit mois de retard », ni publier le délai de réponse réellement
observé. **Le modèle économique détermine ce qui est dicible** — c'est la raison pour
laquelle cette plateforme ne doit jamais dépendre financièrement des institutions qu'elle
mesure.

---

## Ce que la plateforme montre aujourd'hui, réellement

| Écran | Ce qui est réel | Ce qui ne l'est pas |
|---|---|---|
| **Le fil** | 3 207 points d'agenda de Kraainem sur deux ans, 2 751 actes, 15 reformulés à la main | rien |
| **Budget** | dépenses publiques belges par fonction et par niveau (Eurostat), énergie communale (Fluvius) | initiatives, questions et propositions : démonstration étiquetée |
| **Vision** | 4 objectifs européens et fédéraux sourcés, trajectoire réelle des émissions belges 1990-2024 | rien |
| **Mon impact** | 179 établissements de la commune (OpenStreetMap) | l'écran de paiement enrichi : maquette étiquetée |
| **Épargne** | coopératives citoyennes réelles, démarches et délais légaux réels | rien |

Le reste est affiché comme absent, avec le nom de l'organisme qui devrait produire la
donnée. C'est le contenu principal de plusieurs écrans, et c'est voulu.

---

## Démarrage

```bash
npm install
npm run ingest          # remplit /data depuis les sources publiques (≈ 1 h la première fois)
npm run build
npm run start           # http://localhost:3000
```

Autres commandes :

```bash
npm test                # 28 tests : le test d'admission et les règles non négociables
npm run typecheck
npm run ingest lokaalbeslist     # une source à la fois
npx tsx scripts/captures.mts     # 56 captures d'écran, serveur sur le port 3100
```

Node 22 ou plus. Aucune clé d'API n'est nécessaire : toutes les sources branchées sont
publiques et sans authentification.

### Déploiement

Vercel, avec `apps/web` comme répertoire racine et « Include files outside the root
directory » coché. **L'ingestion ne tourne pas sur Vercel** — le système de fichiers y est
en lecture seule : elle vit dans GitHub Actions, qui commite `/data`, ce qui déclenche le
redéploiement. Tout est dans [`docs/deploiement.md`](docs/deploiement.md), y compris le
piège qui fait servir des écrans vides sans la moindre erreur.

---

## Architecture

```
apps/web            Next.js (App Router), rendu serveur, i18n FR/NL/EN
packages/core       types, schémas Zod, test d'admission, pertinence, compétences
packages/connectors un dossier par source, interface commune
packages/ui         composants et jetons de design
data                instantanés versionnés, remplis par l'ingestion
docs                une fiche par source, le vocabulaire, les propositions à adresser
captures            56 captures : 7 écrans × 2 langues × 2 thèmes × 2 largeurs
```

Principes tenus dans le code, pas seulement écrits :

- **Un connecteur ne parle jamais à l'interface.** Il produit des objets validés par Zod ;
  toute donnée non conforme est rejetée avec un journal explicite.
- **Ingestion planifiée, jamais à la demande.** Aucun appel à une API tierce n'a lieu
  pendant le rendu d'une page. Si un portail tombe, la plateforme sert la dernière collecte
  et le dit.
- **Aucun compte requis pour lire.** Les préférences vivent dans le navigateur.
- **Chaque écran expose son JSON** à la même URL suffixée `.json`, et un export CSV.

---

## Les règles, et où elles sont vérifiées

| Règle | Où elle est tenue |
|---|---|
| Aucune information sans source | `ItemSchema` refuse un item sans `source` complète |
| Un ordre du jour n'est jamais une décision adoptée | `ItemSchema` refuse `adoptee` avec une date future |
| L'impact est rédigé par un humain | `ItemSchema` refuse un item publié sans `reformulation` |
| Le test d'admission est une validation, pas une consigne | `packages/core/src/admission.ts` + `admission.test.ts` |
| Deux profils identiques voient le même ordre | `regles.test.ts` |
| Le numéro de registre national n'est pas stocké | un test parcourt tout le dépôt |
| Aucune déduction sur les catégories sensibles | `observer()` refuse d'écrire, testé |
| Aucun graphique sans explication | `CadreGraphique` lève une erreur ; un test parcourt les fichiers |
| Aucun classement d'entités | un test cherche les tris décroissants dans les composants |
| Notifications et consentements désactivés par défaut | `regles.test.ts` |

---

## Documents à lire

- [`DECISIONS.md`](DECISIONS.md) — chaque arbitrage pris, la règle qui l'a dicté, et ce
  qui aurait été fait autrement.
- [`IMPOSSIBLE.md`](IMPOSSIBLE.md) — les exigences que les sources réelles ne permettent
  pas de tenir, et ce qui a été livré à la place.
- [`docs/sources.md`](docs/sources.md) — une fiche par connecteur, avec les résultats réels
  des appels.
- [`docs/vocabulaire.md`](docs/vocabulaire.md) — l'alignement OSLO, et les extensions
  justifiées une par une.
- [`docs/wallonie-imio.md`](docs/wallonie-imio.md) — la proposition technique à adresser à
  iMio pour obtenir la Wallonie.
- `RAPPORT-lot-*.md` — un rapport par lot, avec les critères passés et échoués.

---

## Licence

Code sous **AGPL-3.0-or-later**. Les données restent sous la licence de leur source :
Modellicentie Gratis Hergebruik pour Lokaal Beslist, ODbL 1.0 pour OpenStreetMap, CC BY 4.0
pour IRCEL-CELINE, décision 2011/833/UE pour Eurostat et EUR-Lex.

Tuer l'organisation ne doit pas tuer l'outil.
