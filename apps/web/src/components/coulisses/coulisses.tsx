'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, EyeOff, RotateCcw, Users } from 'lucide-react';
import { Button, cn } from '@pc/ui';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterEuros } from '@/i18n';

/**
 * Trois parcours de bout en bout, joués pas à pas.
 *
 * Chaque étape montre simultanément ce que voit l'habitant, ce que voit
 * l'entreprise, et ce qui circule entre les deux. L'asymétrie du troisième
 * parcours — l'accident du travail — est rendue visible délibérément : c'est
 * un choix, pas un oubli.
 */

interface Etape {
  titre: string;
  habitant: string;
  entreprise: string;
  donnee: string;
  /** Renseigné quand rien ne circule vers l'habitant, et que c'est voulu. */
  rienNeCircule?: string;
}

interface Parcours {
  cle: string;
  titre: string;
  resume: string;
  etapes: Etape[];
}

const PARCOURS: Parcours[] = [
  {
    cle: 'repas',
    titre: 'Un marché de repas scolaires',
    resume:
      'Le cas nominal : l’entreprise remplace son forfait par sa valeur réelle, et les deux écrans bougent ensemble.',
    etapes: [
      {
        titre: 'Avant toute déclaration',
        habitant:
          'L’écran « Ce que la commune achète » affiche le coût complet du marché de repas, calculé au forfait sectoriel — quantile haut de la branche.',
        entreprise:
          'Le tableau de bord affiche « Ce que le silence me coûte » : la rubrique B3 est au forfait, et le montant est chiffré en euros par an.',
        donnee:
          'Le forfait circule dans un seul sens : il sert à calculer le marché. Il ne remonte jamais sur la fiche publique de l’entreprise.',
      },
      {
        titre: 'L’entreprise déclare',
        habitant:
          'Rien ne change encore : la déclaration doit être publiée, et sa pièce justificative attachée, avant d’entrer dans le calcul.',
        entreprise:
          'Le bouton « Je fais mieux que le forfait » ouvre la saisie, demande la pièce, et affiche le gain immédiat.',
        donnee:
          'La déclaration part au format du schéma ouvert déjà décrit sur « Mon impact ». L’entreprise peut le donner à n’importe quel autre client.',
      },
      {
        titre: 'La déclaration est publiée',
        habitant:
          'Le coût complet du marché baisse, la ligne passe du statut « forfait » au statut « déclaré », et la chaîne de calcul le montre poste par poste.',
        entreprise: 'Le montant du silence baisse d’autant, et les offres en cours sont recalculées.',
        donnee:
          'La fiche publique passe de « n’a rien déclaré » à « a déclaré, le [date] ». C’est le seul moment où le compteur public de la commune bouge.',
      },
    ],
  },
  {
    cle: 'contestation',
    titre: 'Une contestation de calcul',
    resume: 'Le cas où quelqu’un a raison de douter — et où le rejet reste affiché.',
    etapes: [
      {
        titre: 'L’habitant conteste une ligne',
        habitant:
          'Sur la chaîne de calcul du marché de voirie, le bouton « Je conteste ce calcul » demande trois choses : quelle ligne, quelle valeur proposée, quelle source.',
        entreprise: 'Rien encore : la contestation porte sur le calcul de la commune, pas sur la déclaration.',
        donnee: 'La contestation est déposée et devient publique, attachée au marché.',
      },
      {
        titre: 'La contestation est instruite',
        habitant:
          'Elle reste visible pendant l’instruction, avec son état. Rien n’est masqué le temps de décider.',
        entreprise:
          'Si elle porte sur un facteur d’émission, elle peut modifier le calcul de ses propres marchés.',
        donnee:
          'Une contestation retenue fait évoluer le barème, et donc sa version. Une contestation rejetée reste affichée avec son motif — comme un acte écarté reste au registre.',
      },
      {
        titre: 'Le barème change de version',
        habitant:
          'L’historique des versions du barème indique ce qui a changé et quand. Les calculs antérieurs gardent la version qui les a produits.',
        entreprise: 'Le simulateur montre l’effet du nouveau paramètre sur les offres à venir.',
        donnee: 'La version du barème accompagne chaque montant : un chiffre sans sa version n’est pas refaisable.',
      },
    ],
  },
  {
    cle: 'accident',
    titre: 'Un accident du travail',
    resume:
      'Le cas asymétrique, et c’est pour lui que ce mode existe : ce qui bouge d’un côté ne doit rien laisser voir de l’autre.',
    etapes: [
      {
        titre: 'L’entreprise déclare l’accident',
        habitant: 'Rien.',
        entreprise:
          'La rubrique B9 est mise à jour. L’indice triennal se recalcule : les intérimaires et les sous-traitants sur site comptent au dénominateur.',
        donnee: 'La déclaration reste dans l’espace entreprise.',
        rienNeCircule:
          'Aucune donnée nominative ne remonte, et aucun événement individuel non plus. Un accident concerne une personne : le publier, même sans nom, dans une commune de dix mille habitants, reviendrait souvent à la désigner.',
      },
      {
        titre: 'L’indice bouge',
        habitant: 'Rien.',
        entreprise:
          'Le solde change sur les marchés au-dessus du seuil, et « Ma position » affiche le nouvel écart à la référence du secteur — par écart, jamais par rang.',
        donnee: 'L’indice est une moyenne sur trois ans : une seule année de sinistralité est du bruit, pas une mesure.',
        rienNeCircule:
          'Même agrégé, l’indice d’une seule entreprise reste dans son espace. Ce que l’habitant pourra voir un jour, c’est une statistique de branche — jamais une entreprise identifiable.',
      },
      {
        titre: 'Ce que l’habitant verra, et ce qu’il ne verra jamais',
        habitant:
          'Rien sur cette entreprise. À terme, une statistique sectorielle publiée par la branche, sans entreprise identifiable.',
        entreprise: 'Tout, sur elle-même, et rien sur les autres : le secteur lui apparaît sous forme de référence.',
        donnee: 'L’asymétrie est le dispositif, pas un défaut de conception.',
        rienNeCircule:
          'C’est le choix le plus important de tout ce mode : la transparence porte sur les dispositifs, les budgets et les délais — jamais sur un agent, jamais sur un salarié.',
      },
    ],
  },
];

export function Coulisses({ d, locale }: { d: Dictionnaire; locale: Locale }) {
  const [parcours, setParcours] = React.useState(PARCOURS[0]!.cle);
  const [etape, setEtape] = React.useState(0);

  const courant = PARCOURS.find((p) => p.cle === parcours)!;
  const e = courant.etapes[etape]!;

  const choisir = (cle: string) => {
    setParcours(cle);
    setEtape(0);
  };

  return (
    <div className="contenu py-8 md:py-12">
      <header>
        <h1 className="text-[26px] font-semibold tracking-tight md:text-[30px]">{d.nav.coulisses}</h1>
        <p className="mt-2 max-w-prose text-[14.5px] leading-relaxed text-[var(--pc-encre-douce)]">
          Le même objet vu des deux côtés : à gauche l’habitant, à droite l’entreprise, au centre la donnée commune et
          son trajet. C’est ce mode qui justifie une maquette unique plutôt que deux.
        </p>
      </header>

      {/* --- Le choix du parcours ----------------------------------------- */}
      <div className="mt-6 flex flex-wrap gap-2">
        {PARCOURS.map((p) => (
          <button
            key={p.cle}
            type="button"
            onClick={() => choisir(p.cle)}
            aria-pressed={p.cle === parcours}
            className={cn(
              'rounded-[var(--pc-rayon)] border px-3.5 py-2 text-left text-[13px] transition-colors',
              p.cle === parcours
                ? 'border-[var(--pc-accent)] bg-[var(--pc-accent-doux)] font-medium'
                : 'border-[var(--pc-trait)] hover:bg-[var(--pc-fond-enfonce)]',
            )}
          >
            {p.titre}
          </button>
        ))}
      </div>

      <p className="mt-3 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">{courant.resume}</p>

      {/* --- Les étapes ---------------------------------------------------- */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5" role="group" aria-label="Étapes du parcours">
          {courant.etapes.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setEtape(i)}
              aria-current={i === etape ? 'step' : undefined}
              aria-label={`Étape ${i + 1}`}
              className="h-1.5 w-10"
              style={{
                background: i <= etape ? 'var(--pc-accent)' : 'var(--pc-trait)',
                borderRadius: 'var(--pc-marque-rayon)',
              }}
            />
          ))}
        </div>
        <span className="chiffre text-[12.5px] text-[var(--pc-encre-tenue)]">
          Étape {etape + 1} sur {courant.etapes.length}
        </span>
        <span className="ml-auto flex gap-2">
          {etape > 0 && (
            <Button variant="contour" taille="sm" onClick={() => setEtape((x) => x - 1)}>
              Précédent
            </Button>
          )}
          {etape < courant.etapes.length - 1 ? (
            <Button variant="primaire" taille="sm" onClick={() => setEtape((x) => x + 1)}>
              Étape suivante
            </Button>
          ) : (
            <Button variant="contour" taille="sm" onClick={() => setEtape(0)}>
              <RotateCcw className="h-3.5 w-3.5" />
              Rejouer
            </Button>
          )}
        </span>
      </div>

      <h2 className="mt-6 text-[18px] font-semibold tracking-tight">{e.titre}</h2>

      {/* --- Les trois colonnes -------------------------------------------- */}
      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_1fr]">
        <section className="carte px-5 py-4" aria-label="Côté habitant">
          <p className="flex items-center gap-2 text-[13px] font-semibold">
            <Users className="h-4 w-4 text-[var(--pc-encre-tenue)]" aria-hidden />
            Côté habitant
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--pc-encre-douce)]">{e.habitant}</p>
        </section>

        <div className="flex items-center justify-center lg:w-72">
          <div className="w-full rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] bg-[var(--pc-fond-enfonce)] px-4 py-3">
            <p className="flex items-center gap-2 text-[12px] font-semibold text-[var(--pc-encre-tenue)]">
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              La donnée, et son trajet
            </p>
            <p className="mt-1.5 text-[12.5px] text-[var(--pc-encre-douce)]">{e.donnee}</p>
            {e.rienNeCircule && (
              <p
                className="mt-2.5 flex items-start gap-2 rounded-[var(--pc-rayon)] px-3 py-2 text-[12px]"
                style={{ background: 'var(--pc-serieux-fond)', color: 'var(--pc-serieux)' }}
              >
                <EyeOff className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>
                  <strong className="font-semibold">Rien ne circule, et c’est un choix.</strong> {e.rienNeCircule}
                </span>
              </p>
            )}
          </div>
        </div>

        <section className="carte px-5 py-4" aria-label="Côté entreprise">
          <p className="flex items-center gap-2 text-[13px] font-semibold">
            <Building2 className="h-4 w-4 text-[var(--pc-encre-tenue)]" aria-hidden />
            Côté entreprise
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--pc-encre-douce)]">{e.entreprise}</p>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-[13px]">
        <Link
          href={`/${locale}/budget/achats`}
          className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] px-3.5 py-2 hover:bg-[var(--pc-fond-enfonce)]"
        >
          Ouvrir l’écran habitant
        </Link>
        <Link
          href={`/${locale}/entreprise`}
          className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] px-3.5 py-2 hover:bg-[var(--pc-fond-enfonce)]"
        >
          Ouvrir l’espace entreprise
        </Link>
      </div>
    </div>
  );
}
