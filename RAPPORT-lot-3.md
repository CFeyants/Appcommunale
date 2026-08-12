# Rapport — Lot 3 : le fil

## Livré

- **Connecteur Lokaal Beslist** sur Kraainem, avec le chemin réel de la donnée :
  `sessions → agenda-items → handled-by → resolutions → articles`. Aucun raccourci n'existe :
  `/resolutions` refuse tout filtre par commune (HTTP 406) et `include=` échoue en HTTP 500.
- **Test d'admission** implémenté comme une validation exécutée à l'ingestion, pas comme
  une consigne éditoriale. Neuf motifs d'exclusion, chacun avec son cas de test sur un
  intitulé réel de Kraainem.
- **Plafonds mensuels** appliqués, et le dépassement signalé plutôt qu'absorbé.
- Le fil : sept cartes au maximum, cinq éléments par carte, ligne de contexte en tête,
  fin de liste explicite. Aucun défilement infini, aucun compteur de vues.
- **Le registre complet**, rendu côté serveur et piloté par l'URL : onglets retenus /
  écartés / par séance, recherche, pagination finie, export CSV.
- **La fiche complète** d'un acte : impact, action, toutes les dates avec leur
  signification, texte publié par l'autorité, licence, objectifs rattachés, JSON de l'item,
  lien direct vers le document original.
- Pages transversales : « Ce qui entre et ce qui n'entre pas » (avec le décompte réel par
  motif) et « Comment le classement fonctionne » (avec les poids tels qu'ils sont dans le
  code).

## Volume réel de données ingérées

| Mesure | Valeur |
|---|---|
| Séances annoncées par la source, tous exercices | 1 069 |
| Fenêtre de collecte | 1ᵉʳ août 2024 → 12 août 2026 |
| Séances collectées | 400 |
| Points d'agenda **uniques** | 3 207 |
| Points portant un acte | 2 751 |
| Actes dont le texte diffère de l'intitulé | 2 192 |
| Actes contenant des articles rédigés | 736 |
| Actes exposant leurs articles par la relation prévue | **0** |
| Appels HTTP pour la collecte | 17 988 |
| Durée de la collecte | ≈ 55 minutes |
| Items publiés après test d'admission | **15** |
| Items au registre avec leur motif | 3 192 |

## Critères d'acceptation

| Critère | État | Vérification |
|---|---|---|
| Décisions réelles, aucune donnée fictive à l'écran | ✅ | 3 207 points réels ; les cartes citent des actes vérifiables |
| Test d'admission implémenté comme validation de schéma | ✅ | `admission.ts` + 7 tests |
| Moins de vingt items publiés par mois | ✅ | mois le plus chargé : 4 |
| Dix items reformulés à la main | ✅ | **15 livrés** |
| Fiche complète | ✅ | `/fr/acte/<id>` |
| Registre et onglet « écartés » avec motifs | ✅ | `/fr?onglet=ecartes` |
| Export JSON fonctionnel | ✅ | `/fr.json` — 4,6 Mo |
| Interface complète en FR et NL | ✅ | `/nl` construit, 56 captures |

## Ce que la collecte a appris, et qui n'était pas prévu

**Un même point d'agenda est rattaché à plusieurs séances.** La première collecte a compté
6 799 points là où il y en a 3 207 : la source lie un point à la fois à la séance qui publie
l'ordre du jour et à celle qui publie la liste des décisions. Sans déduplication, chaque
acte serait apparu deux fois dans le fil.

**Le fil est court, et c'est le vrai coût du produit.** Quinze items publiés sur 3 207
points, parce que le champ `impact` est rédigé par un humain. La page « Ce qui entre et ce
qui n'entre pas » affiche ce rapport plutôt que de le cacher : reformuler l'ensemble d'une
commune demande une personne à temps partiel, pas un algorithme.

**Les intitulés ne distinguent rien.** « Mobiliteit - Aanvullend reglement » revient six
fois le même mois, pour six décisions différentes : une zone 30 étendue, une priorité
inversée, un stationnement limité, un sentier réservé aux piétons. Aucune automatisation ne
peut deviner ce qui change, pour qui, et à partir de quand.

## Écart

Le texte intégral n'est affiché que pour les actes relus par un humain — décision D10.
Les délibérations non relues nomment des personnes privées ; les republier automatiquement
serait une diffusion que personne n'a validée.
