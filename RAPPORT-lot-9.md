# Rapport — Lot 9 : services utiles et signalement

## Livré

- **Calendrier des déchets** : l'absence affichée avec le nom de l'intercommunale, le lien
  vers le calendrier officiel, et le schéma du flux à demander, rédigé dans
  [`docs/dechets-interza.md`](docs/dechets-interza.md).
- **Alertes travaux** : l'absence affichée, avec la raison — GIPOD est réservé aux
  gestionnaires de voirie, les chantiers communaux n'ont pas de géométrie exploitable.
- **Annuaire local** : 179 établissements réels, six catégories, ordre alphabétique, aucun
  tri par popularité ni par note.
- **Démarches** : cinq démarches réelles avec, pour chacune, le formulaire officiel, les
  pièces à fournir, le coût, et **le délai légal quand il en existe un — avec le texte qui
  le fixe**. Quand aucun texte n'en fixe, c'est écrit.
- **Signalement** : un document daté, fabriqué dans le navigateur, avec la photo, la
  géolocalisation, la qualification, le destinataire suggéré et le délai légal. La
  plateforme n'achemine rien et l'écrit en toutes lettres.
- **La relance à trente jours et la mesure du délai observé** — la seule chose que personne
  d'autre ne fait.
- **Mode hors ligne** : agent de service qui sert depuis le cache quand le réseau tombe, et
  bandeau explicite « vous consultez la dernière version chargée ».

## Les délais légaux, réellement sourcés

| Démarche | Délai | Texte qui le fixe |
|---|---|---|
| Carte d'identité | aucun | aucun texte ne fixe de délai en procédure normale |
| Acte de naissance | aucun | délivrance immédiate en ligne depuis la BAEC |
| Permis d'environnement | **105 jours** | décret du 25 avril 2014, art. 32 (60 en procédure simplifiée) |
| Accès à un document administratif | **20 jours** | Bestuursdecreet du 7 décembre 2018, art. II.32, prorogeable une fois |
| Revenu d'intégration sociale | **30 jours** | loi du 26 mai 2002, art. 21 § 1ᵉʳ |

## Critères d'acceptation

| Critère | État | Vérification |
|---|---|---|
| Calendrier des déchets à l'adresse de l'utilisateur | ❌ | aucun flux ouvert — voir `IMPOSSIBLE.md` I6 |
| Alertes travaux dans un rayon choisi | ❌ | aucun flux ouvert — voir `IMPOSSIBLE.md` I7 |
| Annuaire local au gabarit de fiche | ✅ | six catégories, 179 fiches |
| Démarches avec délai légal quand il existe | ✅ | cinq démarches, texte cité pour chaque délai |
| Signalement en document prêt à envoyer | ✅ | fichier daté produit dans le navigateur |
| La plateforme ne prétend nulle part acheminer | ✅ | avertissement au-dessus du formulaire |
| Délai de traitement observé publié dès qu'il y a de la matière | ✅ | relance à J+30, médiane calculée |
| Mode hors ligne réel | ✅ | agent de service + bandeau |

## Les deux critères échoués

Ce sont les deux fonctions dont le brief disait qu'elles font revenir plus que tout le
reste. Aucune des deux n'a de source ouverte en Belgique.

**Déchets.** Interza publie son calendrier sur son site et dans son application, sans
interface programmable documentée, sans convention. Reconstituer par extraction serait
techniquement faisable et éditorialement irresponsable : une erreur fait manquer une
collecte à quelqu'un, et la plateforme porterait la faute d'une donnée qu'elle n'a pas
reçue. Le schéma du flux demandé est rédigé et prêt à adresser.

**Travaux.** GIPOD n'est pas ouvert. Compensation partielle et réelle : les fermetures de
rue décidées par le collège **apparaissent dans le fil**, puisqu'elles passent par un
règlement de police temporaire publié sur Lokaal Beslist. Deux d'entre elles sont
reformulées et visibles — le festival du 27 juin et le Summer Kids Village.

## L'arbitrage du signalement, et ce qu'il produit

Le brief l'avait tranché : on l'inclut, mais jamais comme un guichet.

Le document est fabriqué **sur l'appareil de la personne**, téléchargé, et rien n'est envoyé
nulle part — ce qui rend la promesse tenable. Trente jours plus tard, la page demande si le
problème a été traité, et calcule le délai médian constaté.

Aucune matière encore : le délai observé s'affichera dès qu'il y aura des retours. C'est la
donnée la plus inconfortable et la plus utile que ce produit puisse produire, et personne
d'autre ne peut la produire — un fournisseur payé par la commune ne publierait pas le délai
réel de traitement de cette même commune.

**Limite honnête, écrite à l'écran** : ces chiffres ne portent aujourd'hui que sur les
signalements de la personne elle-même, stockés sur son appareil. Leur agrégation publique
par commune suppose un envoi volontaire, qui n'est pas encore ouvert.
