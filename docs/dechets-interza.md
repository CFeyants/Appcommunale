# Calendrier des déchets : le flux qu'il faudrait demander à Interza

**État : non branché.** La plateforme n'affiche aucun calendrier de collecte, et renvoie
vers le calendrier officiel d'Interza.

## Pourquoi c'est important, et pourquoi c'est vide

Le calendrier des déchets est, sans exception connue, **la fonction la plus ouverte de
toutes les applications communales**. C'est la raison utilitaire de revenir, celle qui fait
qu'une application est installée et gardée. Elle vaut, en usage, plus que toutes les
fonctions de participation réunies.

Interza — l'intercommunale qui collecte à Kraainem, Wezembeek-Oppem, Zaventem,
Steenokkerzeel et Machelen — publie son calendrier sur son site et dans sa propre
application, **sans interface programmable documentée**. Aucune convention n'existe.

Reconstituer le calendrier par extraction serait techniquement faisable et éditorialement
irresponsable : une erreur de reconstitution fait manquer une collecte à quelqu'un, et la
plateforme porterait la faute d'une donnée qu'elle n'a pas reçue. Elle s'y refuse.

## Le flux demandé

Deux formats conviendraient, dans cet ordre de préférence.

### 1. iCalendar par adresse — le plus simple à produire

```
GET https://www.interza.be/api/kalender.ics?straat=<code>&huisnummer=<n>
```

Un événement par collecte, `VEVENT` avec :

- `SUMMARY` : la fraction collectée (résiduel, PMC, papier-carton, organique, verre) ;
- `DTSTART` : date de collecte, en journée entière ;
- `CATEGORIES` : code stable de la fraction, indépendant du libellé affiché ;
- `LOCATION` : rue et numéro ou code de tournée.

L'iCalendar a un avantage décisif : il se branche directement dans l'agenda d'un habitant,
sans passer par nous. C'est le résultat que nous cherchons.

### 2. JSON par rue

```
GET https://www.interza.be/api/collectes?rue=<code>&depuis=2026-01-01&jusqua=2026-12-31
```

```json
{
  "commune": "23099",
  "rue": { "code": "…", "nom": "Wezembeeklaan" },
  "collectes": [
    { "date": "2026-08-19", "fraction": "restafval", "libelle": "Déchets résiduels" },
    { "date": "2026-08-19", "fraction": "pmd", "libelle": "PMC" }
  ],
  "misAJourLe": "2026-08-01"
}
```

Codes de fraction souhaités, stables et indépendants de la langue : `restafval`, `pmd`,
`papier-karton`, `gft`, `glas`, `grofvuil`, `snoeihout`.

## Ce que nous nous engageons à respecter

- **Une collecte par jour au maximum**, en dehors des heures de pointe.
- `ETag` et `If-Modified-Since` respectés : nous ne redemandons pas ce qui n'a pas bougé.
- Un `User-Agent` qui identifie le projet et donne un contact.
- Attribution d'Interza affichée sur chaque écran qui utilise la donnée.
- **Aucune adresse d'habitant ne nous est transmise ni conservée** : la sélection de rue se
  fait sur l'appareil de la personne.

## La notification, et sa seule forme acceptable

La veille au soir, pour la rue choisie, **et seulement si la personne l'a activée**. C'est
l'une des trois seules notifications utilitaires prévues, et l'écran de préférences indique
aujourd'hui, sous l'interrupteur, qu'elle ne peut pas encore être envoyée faute de flux.

Aucune notification n'est envoyée sans opt-in explicite, et la fréquence maximale de tout
le produit reste hebdomadaire — cette notification-ci est l'exception prévue au § 2.2 : une
échéance que l'utilisateur a lui-même choisi de suivre.

## Prochaine étape

Adresser cette demande à Interza, et publier la réponse — y compris un refus, y compris une
absence de réponse. Tant qu'il n'y a pas de flux, l'écran affiche l'absence et le lien
officiel.
