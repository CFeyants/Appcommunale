'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check, Eye, Trash2, TriangleAlert } from 'lucide-react';
import { Button, Card, CardContent, Checkbox, Separator, Switch, cn } from '@pc/ui';
import {
  FREQUENCES,
  NIVEAUX,
  THEMES,
  TYPES_EVENEMENT,
  type Frequence,
  type Niveau,
  type Theme,
  type TypeEvenement,
} from '@pc/core';
import type { Dictionnaire, Locale } from '@/i18n';
import { usePreferences } from '@/lib/preferences';

const LIBELLE_EVENEMENT: Record<TypeEvenement, string> = {
  'nouvelle-decision': 'Une nouvelle décision est publiée',
  'consultation-ouverte': 'Une consultation s’ouvre',
  'echeance-proche': 'Une échéance que je suis approche',
  'reponse-institution': 'Une institution répond à une question',
  'avancement-initiative': 'Une initiative que je suis avance',
};

const LIBELLE_FREQUENCE: Record<Frequence, string> = {
  jamais: 'Jamais',
  hebdomadaire: 'Une fois par semaine',
  mensuelle: 'Une fois par mois',
};

/** Les cinq conditions du consentement B, écrites à l'écran, pas seulement dans le code. */
const CONDITIONS_DEDUCTION = [
  'Désactivée par défaut, et la plateforme reste parfaitement utilisable sans elle.',
  'Une page liste chaque attribut déduit, ce qui l’a produit, et permet de le supprimer un par un.',
  'Aucune donnée de comportement ne sort de la plateforme : aucune régie, aucun courtier, aucun pixel tiers, aucune revente, jamais.',
  'Aucune déduction sur les opinions politiques, la religion, la santé, l’orientation sexuelle ou l’origine — ni directement, ni par un détour.',
  'Les traces de navigation sont effacées automatiquement au bout de quatre-vingt-dix jours.',
];

export function EcranPreferences({ d, locale }: { d: Dictionnaire; locale: Locale }) {
  const { preferences, majPreferences, pret, toutOublier } = usePreferences();
  const [etape, setEtape] = React.useState(1);

  if (!pret) return <div className="contenu py-16" aria-busy />;

  const basculerTheme = (niveau: Niveau, theme: Theme) => {
    majPreferences((p) => {
      const actuels = p.abonnements[niveau] ?? [];
      const suivants = actuels.includes(theme) ? actuels.filter((t) => t !== theme) : [...actuels, theme];
      return { ...p, abonnements: { ...p.abonnements, [niveau]: suivants } };
    });
  };

  const total = Object.values(preferences.abonnements).reduce((s, t) => s + (t?.length ?? 0), 0);

  return (
    <div className="contenu max-w-3xl py-10 md:py-14">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-[28px] font-semibold tracking-tight md:text-[32px]">{d.nav.preferences}</h1>
        <p className="chiffre text-[13px] text-[var(--pc-encre-tenue)]">
          {d.identite.etape} {etape} {d.identite.sur} 3
        </p>
      </div>

      {/* Barre d'étapes : trois marques, aucune animation. */}
      <div className="mt-4 flex gap-1.5" aria-hidden>
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className="h-1 flex-1"
            style={{
              backgroundColor: n <= etape ? 'var(--pc-accent)' : 'var(--pc-trait)',
              borderRadius: 'var(--pc-marque-rayon)',
            }}
          />
        ))}
      </div>

      {/* --- Étape 1 : ce que je veux suivre ------------------------------- */}
      {etape === 1 && (
        <section className="mt-8" aria-labelledby="e1">
          <h2 id="e1" className="text-[20px] font-semibold tracking-tight">
            {d.identite.etape1Titre}
          </h2>
          <p className="mt-2 max-w-prose text-[14px] text-[var(--pc-encre-douce)]">{d.identite.etape1Intro}</p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-[12.5px]">
              <caption className="sr-only">Grille des thèmes suivis par niveau de pouvoir</caption>
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 bg-[var(--pc-fond)] py-2 pr-3 text-left font-medium">
                    &nbsp;
                  </th>
                  {THEMES.map((t) => (
                    <th key={t} scope="col" className="px-1 pb-2 align-bottom">
                      <span className="block w-[3.5rem] -rotate-45 origin-bottom-left whitespace-nowrap text-left text-[11px] font-medium text-[var(--pc-encre-douce)]">
                        {d.themes[t]}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {NIVEAUX.map((n) => (
                  <tr key={n} className="border-t border-[var(--pc-trait)]">
                    <th
                      scope="row"
                      className="sticky left-0 bg-[var(--pc-fond)] py-2 pr-3 text-left text-[13px] font-medium"
                    >
                      {d.niveaux[n]}
                    </th>
                    {THEMES.map((t) => {
                      const coche = (preferences.abonnements[n] ?? []).includes(t);
                      return (
                        <td key={t} className="px-1 py-2 text-center">
                          <Checkbox
                            checked={coche}
                            onCheckedChange={() => basculerTheme(n, t)}
                            aria-label={`${d.niveaux[n]} — ${d.themes[t]}`}
                            className="mx-auto"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3">
            <label className="flex items-start gap-3 text-[13.5px]">
              <Checkbox
                checked={preferences.impactGeneral}
                onCheckedChange={(v) => majPreferences((p) => ({ ...p, impactGeneral: Boolean(v) }))}
                className="mt-0.5"
              />
              <span>
                <strong className="font-medium">{d.themes['impact-general']}</strong>
                <span className="block text-[var(--pc-encre-douce)]">
                  C’est le comportement par défaut. Sans rien cocher au-dessus, vous verrez ce qui concerne tout le
                  monde — {total > 0 ? `vous avez coché ${total} cases` : 'vous n’avez coché aucune case'}.
                </span>
              </span>
            </label>
          </div>
        </section>
      )}

      {/* --- Étape 2 : les notifications ----------------------------------- */}
      {etape === 2 && (
        <section className="mt-8" aria-labelledby="e2">
          <h2 id="e2" className="text-[20px] font-semibold tracking-tight">
            {d.identite.etape2Titre}
          </h2>
          <p className="mt-2 max-w-prose text-[14px] text-[var(--pc-encre-douce)]">{d.identite.etape2Intro}</p>

          <h3 className="etiquette mt-7 text-[var(--pc-encre-tenue)]">{d.identite.utilitaires}</h3>
          <div className="mt-3 space-y-2.5">
            <LigneUtilitaire
              titre={d.epargne.dechets}
              detail="La veille au soir, pour votre rue. C’est la fonction la plus utilisée de toutes les applications communales — et la seule notification que presque tout le monde active."
              actif={preferences.utilitaires.calendrierDechets.actif}
              onChange={(v) =>
                majPreferences((p) => ({
                  ...p,
                  utilitaires: { ...p.utilitaires, calendrierDechets: { actif: v, veilleAuSoir: v } },
                }))
              }
              avertissement="Aucun flux ouvert n’existe aujourd’hui chez Interza : cette notification ne peut pas encore être envoyée."
            />
            <LigneUtilitaire
              titre={d.epargne.travaux}
              detail={`Dans un rayon de ${preferences.utilitaires.travauxVoirie.rayonMetres} m autour de chez vous, avec la date de fin annoncée.`}
              actif={preferences.utilitaires.travauxVoirie.actif}
              onChange={(v) =>
                majPreferences((p) => ({
                  ...p,
                  utilitaires: { ...p.utilitaires, travauxVoirie: { ...p.utilitaires.travauxVoirie, actif: v } },
                }))
              }
              avertissement="Les chantiers ne sont publiés dans aucun flux ouvert : cette notification ne peut pas encore être envoyée."
            />
            <LigneUtilitaire
              titre="Échéance d’une démarche commencée"
              detail="Uniquement pour une démarche que vous avez vous-même commencée, et seulement quand la date approche."
              actif={preferences.utilitaires.echeanceDemarche.actif}
              onChange={(v) =>
                majPreferences((p) => ({ ...p, utilitaires: { ...p.utilitaires, echeanceDemarche: { actif: v } } }))
              }
            />
          </div>

          <h3 className="etiquette mt-8 text-[var(--pc-encre-tenue)]">Par niveau, thème et type d’événement</h3>
          <p className="mt-1.5 max-w-prose text-[13px] text-[var(--pc-encre-douce)]">
            La granularité est le sujet, pas l’existence. Vous ne choisissez pas « recevoir des notifications » mais
            quoi, exactement.
          </p>
          <div className="mt-3 space-y-2">
            {TYPES_EVENEMENT.map((te) => {
              const regle = preferences.regles.find((r) => r.typeEvenement === te);
              return (
                <div
                  key={te}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3"
                >
                  <span className="text-[13.5px]">{LIBELLE_EVENEMENT[te]}</span>
                  <select
                    value={regle?.frequence ?? 'jamais'}
                    onChange={(e) => {
                      const f = e.target.value as Frequence;
                      majPreferences((p) => {
                        const autres = p.regles.filter((r) => r.typeEvenement !== te);
                        if (f === 'jamais') return { ...p, regles: autres };
                        return {
                          ...p,
                          regles: [
                            ...autres,
                            {
                              id: `regle-${te}`,
                              niveau: 'commune' as Niveau,
                              theme: 'impact-general' as const,
                              typeEvenement: te,
                              frequence: f,
                              canal: 'courriel' as const,
                            },
                          ],
                        };
                      });
                    }}
                    className="h-8 rounded-[7px] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] px-2 text-[12.5px]"
                    aria-label={`Fréquence pour : ${LIBELLE_EVENEMENT[te]}`}
                  >
                    {FREQUENCES.map((f) => (
                      <option key={f} value={f}>
                        {LIBELLE_FREQUENCE[f]}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[12.5px] text-[var(--pc-encre-tenue)]">
            La fréquence maximale disponible est hebdomadaire. Il n’existe volontairement aucune option « en temps
            réel », ni aucun rappel d’inactivité.
          </p>

          {preferences.regles.length > 0 && (
            <div className="mt-4 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3 text-[12.5px]">
              <p className="font-medium">Aperçu du pied de chaque message envoyé</p>
              <p className="mt-1.5 text-[var(--pc-encre-douce)]">
                « {d.identite.pourquoiJeRecois} — {d.identite.regleActivee} :{' '}
                {LIBELLE_EVENEMENT[preferences.regles[0]!.typeEvenement]},{' '}
                {LIBELLE_FREQUENCE[preferences.regles[0]!.frequence].toLowerCase()}.{' '}
                <span className="underline">{d.identite.desactiverRegle}</span> »
              </p>
            </div>
          )}
        </section>
      )}

      {/* --- Étape 3 : les deux consentements ------------------------------ */}
      {etape === 3 && (
        <section className="mt-8" aria-labelledby="e3">
          <h2 id="e3" className="text-[20px] font-semibold tracking-tight">
            {d.identite.etape3Titre}
          </h2>

          <Card className="mt-5">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[15px] font-semibold">A — {d.identite.consentementA}</h3>
                  <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
                    {d.identite.consentementATexte}
                  </p>
                </div>
                <Switch
                  checked={preferences.consentements.situation.accorde}
                  onCheckedChange={(v) =>
                    majPreferences((p) => ({
                      ...p,
                      consentements: {
                        ...p.consentements,
                        situation: { accorde: v, accordeLe: v ? new Date().toISOString() : undefined },
                      },
                      situation: v ? p.situation : null,
                    }))
                  }
                  aria-label={d.identite.consentementA}
                />
              </div>
              <p className="mt-3 text-[12.5px] text-[var(--pc-encre-tenue)]">{d.identite.consentementANote}</p>

              {preferences.consentements.situation.accorde && (
                <FormulaireSituation
                  onVider={() => majPreferences((p) => ({ ...p, situation: null }))}
                  situation={preferences.situation}
                  onChange={(s) => majPreferences((p) => ({ ...p, situation: s }))}
                />
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[15px] font-semibold">B — {d.identite.consentementB}</h3>
                  <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
                    {d.identite.consentementBTexte}
                  </p>
                </div>
                <Switch
                  checked={preferences.consentements.deduction.accorde}
                  onCheckedChange={(v) =>
                    majPreferences((p) => ({
                      ...p,
                      consentements: {
                        ...p.consentements,
                        deduction: { accorde: v, accordeLe: v ? new Date().toISOString() : undefined },
                      },
                    }))
                  }
                  aria-label={d.identite.consentementB}
                />
              </div>

              <h4 className="etiquette mt-5 text-[var(--pc-encre-tenue)]">{d.identite.consentementBConditions}</h4>
              <ol className="mt-2.5 space-y-2">
                {CONDITIONS_DEDUCTION.map((c, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] text-[var(--pc-encre-douce)]">
                    <span
                      aria-hidden
                      className="chiffre mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[var(--pc-fond-enfonce)] text-[10px] font-semibold"
                    >
                      {i + 1}
                    </span>
                    {c}
                  </li>
                ))}
              </ol>

              <p className="mt-4">
                <Link
                  href={`/${locale}/preferences/deduit`}
                  className="inline-flex items-center gap-1.5 text-[13px] text-[var(--pc-accent)] underline underline-offset-2"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {d.identite.croitSavoirTitre}
                </Link>
              </p>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button variant="contour" taille="sm" onClick={toutOublier}>
              <Trash2 className="h-3.5 w-3.5" />
              Tout effacer et repartir de zéro
            </Button>
            <span className="text-[12.5px] text-[var(--pc-encre-tenue)]">
              Efface la session, les préférences et les attributs déduits, sur cet appareil.
            </span>
          </div>
        </section>
      )}

      <Separator className="mt-9" />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {etape > 1 && (
            <Button variant="contour" onClick={() => setEtape((e) => e - 1)}>
              {d.identite.precedent}
            </Button>
          )}
          {etape < 3 ? (
            <>
              <Button variant="primaire" onClick={() => setEtape((e) => e + 1)}>
                {d.identite.suivant}
              </Button>
              <Button variant="discret" onClick={() => setEtape((e) => e + 1)}>
                {d.identite.passer}
              </Button>
            </>
          ) : (
            <Button variant="primaire" asChild>
              <Link href={`/${locale}`}>
                <Check className="h-4 w-4" />
                {d.identite.terminer}
              </Link>
            </Button>
          )}
        </div>
        <p className="text-[12.5px] text-[var(--pc-encre-tenue)]">
          Chaque étape est sautable, et tout se modifie à tout moment depuis cet écran.
        </p>
      </div>
    </div>
  );
}

function LigneUtilitaire({
  titre,
  detail,
  actif,
  onChange,
  avertissement,
}: {
  titre: string;
  detail: string;
  actif: boolean;
  onChange: (v: boolean) => void;
  avertissement?: string;
}) {
  return (
    <div className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[14px] font-medium">{titre}</p>
          <p className="mt-1 max-w-prose text-[13px] text-[var(--pc-encre-douce)]">{detail}</p>
        </div>
        <Switch checked={actif} onCheckedChange={onChange} aria-label={titre} />
      </div>
      {avertissement && (
        <p
          className="mt-2.5 flex items-start gap-2 text-[12px]"
          style={{ color: 'var(--pc-retard)' }}
        >
          <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
          {avertissement}
        </p>
      )}
    </div>
  );
}

function FormulaireSituation({
  situation,
  onChange,
  onVider,
}: {
  situation: import('@pc/core').SituationDeclaree | null;
  onChange: (s: import('@pc/core').SituationDeclaree) => void;
  onVider: () => void;
}) {
  const s = situation ?? { enfants: [], parentsDependants: false };
  return (
    <div className="mt-5 space-y-3 border-t border-[var(--pc-trait)] pt-4">
      <label className="flex items-center justify-between gap-4 text-[13.5px]">
        <span>J’ai des enfants mineurs</span>
        <Switch
          checked={s.enfants.length > 0}
          onCheckedChange={(v) =>
            onChange({ ...s, enfants: v ? [{ prenomOuInitiale: '—', anneeNaissance: new Date().getFullYear() - 8 }] : [] })
          }
        />
      </label>
      <label className="flex items-center justify-between gap-4 text-[13.5px]">
        <span>J’aide un parent dépendant</span>
        <Switch checked={s.parentsDependants} onCheckedChange={(v) => onChange({ ...s, parentsDependants: v })} />
      </label>
      <label className="flex items-center justify-between gap-4 text-[13.5px]">
        <span>Je suis locataire</span>
        <Switch checked={Boolean(s.locataire)} onCheckedChange={(v) => onChange({ ...s, locataire: v })} />
      </label>
      <label className="flex items-center justify-between gap-4 text-[13.5px]">
        <span>Mon statut</span>
        <select
          value={s.statut ?? ''}
          onChange={(e) => onChange({ ...s, statut: (e.target.value || undefined) as never })}
          className="h-8 rounded-[7px] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] px-2 text-[12.5px]"
        >
          <option value="">Non renseigné</option>
          <option value="salarie">Salarié</option>
          <option value="independant">Indépendant</option>
          <option value="fonctionnaire">Fonctionnaire</option>
          <option value="etudiant">Étudiant</option>
          <option value="pensionne">Pensionné</option>
          <option value="sans-emploi">Sans emploi</option>
          <option value="autre">Autre</option>
        </select>
      </label>
      <Button variant="contour" taille="sm" onClick={onVider} className={cn('mt-1')}>
        <Trash2 className="h-3.5 w-3.5" />
        Vider ce formulaire
      </Button>
    </div>
  );
}
