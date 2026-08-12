# Rapport — Lot 7 : mon impact et les entreprises

## Livré

- **Mes indicateurs** : quatre saisies personnelles, privées, locales, non comparatives.
  Aucun total, aucun score, aucune série de jours, aucune conversion en équivalent carbone
  — les facteurs d'émission varient d'un référentiel à l'autre et la plateforme n'en impose
  aucun. Tout vit dans le navigateur, rien n'est envoyé.
- **La liste des entreprises de la commune**, réelle : 179 établissements ouverts au public,
  en ordre alphabétique strict, avec recherche mais **sans tri** — offrir un tri, ce serait
  offrir un classement.
- **Le compteur de déclarations en nombre héroïque** : « 0 / 179 ont publié leurs données ».
  C'est l'information la plus utile de l'écran, et elle n'est pas adoucie.
- Les quatre règles du § 7.2 affichées à l'écran, pas seulement respectées : l'entreprise
  est la source et la plateforme le porte-voix ; aucun classement ; la divergence des
  méthodes est affichée et non lissée ; le volet social ne passe que par des faits établis.
- **L'écran de paiement enrichi en maquette étiquetée** : bandeau permanent, schéma de
  message documenté, aucune donnée bancaire, aucun appel réseau, aucune annonce ailleurs
  dans l'application.

## Volume réel

| Mesure | Valeur |
|---|---|
| Établissements collectés | **179** |
| Avec adresse complète | 63 |
| Avec horaires | 60 |
| Avec téléphone | 44 |
| Entreprises ayant publié des données environnementales | **0** |

## Critères d'acceptation

| Critère | État | Vérification |
|---|---|---|
| Indicateurs personnels privés, locaux, non comparatifs | ✅ | `localStorage`, aucune requête, aucun score |
| Liste des entreprises réelle | ⚠️ | réelle mais issue d'OSM, pas de la BCE — voir ci-dessous |
| Fiches vides assumées | ✅ | « n'a rien déclaré » sur les 179 |
| Compteur de déclarations en tête | ✅ | nombre héroïque de l'écran |
| Aucun classement, aucun palmarès, aucune note | ✅ | ordre alphabétique, aucun tri offert ; test sur les tris |
| Écran de paiement en maquette étiquetée | ✅ | bandeau permanent, `docs/paiement-enrichi.md` |
| La plateforme n'estime jamais à la place de l'entreprise | ✅ | aucun calcul d'estimation dans le code |

## Le critère partiellement tenu

**La liste devrait venir de la Banque-Carrefour des Entreprises.** Le téléchargement du
fichier KBO Open Data exige une inscription nominative : le service répond **HTTP 302** vers
une page d'authentification. C'est l'un des trois cas où le brief demande de s'arrêter — il
faut que Cédric crée le compte et fournisse les identifiants.

En attendant, la liste vient d'OpenStreetMap (ODbL 1.0, attribution affichée). L'origine
est expliquée en tête de section, avec le code de réponse obtenu et le taux de complétude.
Voir [`IMPOSSIBLE.md`](IMPOSSIBLE.md), point I2.

**Ce qui reste vrai malgré tout** : le compteur « 0 sur 179 » est exact quelle que soit
l'origine de la liste, puisque aucune entreprise ne publie ces données nulle part. Le vide
de l'écran ne dépend pas de la source de la liste.

## Ce que la collecte a appris

**Le point d'accès unique européen n'ouvrira pas ce dossier.** Il ouvre le 10 juillet 2027,
par vagues, et ne couvrira pas les entreprises d'une commune de dix mille habitants. Un
écran qui attendrait cette ouverture attendrait indéfiniment. C'est pourquoi le schéma de
déclaration volontaire est écrit dès maintenant : l'entreprise publie elle-même, contre un
schéma ouvert, et la plateforme affiche sans calculer.

**OpenStreetMap est contributif, donc inégal.** Un tiers des fiches porte une adresse
complète. Rien ne garantit qu'un établissement fermé ait été retiré. C'est affiché comme
tel, conformément à la règle « publie l'absence ».
