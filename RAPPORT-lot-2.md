# Rapport — Lot 2 : identité et préférences

## Livré

- **itsme en mode démonstration au contrat réel.** Les portées demandées sont celles
  d'itsme, les revendications portent les noms exacts d'OpenID Connect (`sub`,
  `given_name`, `address.postal_code`…), et le branchement en production consiste à
  remplacer `FOURNISSEUR_DEMONSTRATION` par un client OIDC pointant vers
  `idp.prd.itsme.services`. Rien d'autre à changer.
- Écran de connexion affichant **ce qui est demandé et ce qui ne l'est pas**, portée par
  portée, avec la raison de chaque exclusion.
- Les trois étapes de préférences, chacune sautable :
  1. grille à deux entrées, 5 niveaux × 12 thèmes, tout décoché ;
  2. notifications, toutes désactivées, fréquence maximale hebdomadaire, plus les trois
     notifications utilitaires ;
  3. les deux consentements, séparés, désactivés, avec leur finalité en une phrase.
- **Page « Ce que la plateforme croit savoir de vous »**, atteignable en deux clics depuis
  n'importe quel écran par le pied de page. Chaque attribut affiche ce qui l'a produit et
  se supprime individuellement.
- Écran de modification manuelle de toutes les préférences, et bouton « tout effacer ».
- Registre des traitements publié sur `/fr/vie-privee` : une finalité, une base légale, des
  données nommées, une durée.

## Critères d'acceptation

| Critère | État | Vérification |
|---|---|---|
| itsme en démonstration, au contrat réel | ✅ | `contenu/itsme-demo.ts`, bandeau permanent |
| Trois étapes de préférences | ✅ | capture `7-preferences_*` |
| Deux consentements séparés, désactivés par défaut | ✅ | test « les deux consentements sont désactivés par défaut » |
| Page « ce que la plateforme croit savoir » | ✅ | `/fr/preferences/deduit` |
| Suppression attribut par attribut | ✅ | bouton par ligne, testé manuellement |
| Écran de modification manuelle | ✅ | `/fr/preferences` |
| Numéro de registre national jamais stocké | ✅ | test parcourant tout le dépôt |
| Aucune notification sans opt-in, maximum hebdomadaire | ✅ | test sur `PREFERENCES_PAR_DEFAUT` et `FREQUENCES` |

## Les cinq conditions du consentement B

Toutes tenues, sinon la fonction n'aurait pas été livrée.

| Condition | Comment elle est tenue |
|---|---|
| Désactivée par défaut | `CONSENTEMENTS_PAR_DEFAUT`, testé |
| Page listant chaque attribut, suppression une par une | `/fr/preferences/deduit` |
| Aucune donnée de comportement ne sort | tout vit dans `localStorage` ; aucune requête réseau ne part |
| Aucune déduction sur catégorie sensible | `observer()` refuse d'écrire, y compris appelée par erreur ; testé |
| Effacement automatique à 90 jours | `purgerTraces()` s'exécute à chaque ouverture, pas seulement à l'écriture ; testé |

Arbitrage ajouté, non demandé : un intérêt déduit pèse **la moitié** d'un thème déclaré.
Sans ce plafond, la déduction finirait par dominer la déclaration. Décision D16.

## Volume réel

- 4 portées demandées, 4 explicitement écartées avec leur raison.
- 5 types d'événement notifiables × 3 fréquences, aucune option temps réel dans le
  vocabulaire.
- 6 traitements au registre.

## Écart

Le point d'accès `idp.e2e.itsme.services` n'a pas été appelé : l'accès exige un enrôlement
auprès de Belgian Mobile ID. Voir [`IMPOSSIBLE.md`](IMPOSSIBLE.md), point I10.
