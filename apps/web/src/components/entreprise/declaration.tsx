'use client';

import * as React from 'react';
import { CircleCheck, Download, Paperclip } from 'lucide-react';
import { Button } from '@pc/ui';
import { formaterDate, formaterEuros, type Locale } from '@/i18n';
import { ENTREPRISE, PIECES, RUBRIQUES, type Rubrique } from '@/contenu/entreprise';
import { PuceStatut } from '@/components/achats/puce-statut';

/**
 * Ma déclaration — le module de base de la norme volontaire européenne.
 *
 * Onze rubriques, B1 à B11, et **aucun champ ajouté**. Le plafond que le
 * législateur européen a jugé proportionné pour une petite entreprise non
 * cotée : un questionnaire maison serait plus coûteux pour l'entreprise et plus
 * attaquable pour la commune.
 *
 * Chaque champ suit le même schéma : forfait pré-rempli avec sa source, ce
 * qu'il coûte, un bouton pour faire mieux, le gain immédiat après saisie.
 * Le principe doit se lire sans explication : **ne rien déclarer est autorisé
 * et a un prix.**
 */
export function FormulaireDeclaration({ locale }: { locale: Locale }) {
  const [saisies, setSaisies] = React.useState<Record<string, string>>({});
  const [ouverte, setOuverte] = React.useState<string | null>(null);

  const gain = RUBRIQUES.filter((r) => r.forfait && saisies[r.cle]).reduce(
    (s, r) => s + (r.forfait?.coutAnnuelEur ?? 0),
    0,
  );
  const restant = RUBRIQUES.filter((r) => r.forfait && !r.valeurDeclaree && !saisies[r.cle]).reduce(
    (s, r) => s + (r.forfait?.coutAnnuelEur ?? 0),
    0,
  );

  /** Le schéma ouvert déjà décrit sur /fr/impact — réutilisé, jamais redéfini. */
  const exporter = () => {
    const declaration = {
      schema: 'https://plateforme-citoyenne.be/ns/declaration-entreprise/1',
      signataire: ENTREPRISE.denomination,
      numeroEntreprise: ENTREPRISE.numeroEntreprise,
      dateDeclaration: new Date().toISOString().slice(0, 10),
      referentiel: 'Module de base de la norme volontaire européenne pour PME non cotées, rubriques B1 à B11',
      perimetre: ['scope1', 'scope2'],
      methode: 'Relevés propres, pièces justificatives jointes',
      rubriques: RUBRIQUES.map((r) => ({
        code: r.code,
        intitule: r.intitule,
        valeur: saisies[r.cle] ?? r.valeurDeclaree?.valeur ?? null,
        statut: saisies[r.cle] || r.valeurDeclaree ? 'declare' : r.forfait ? 'forfait' : 'non-renseigne',
      })),
      avertissement: 'Déclaration de démonstration. Entreprise fictive.',
    };
    const blob = new Blob([JSON.stringify(declaration, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'declaration-vsme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-[24px] font-semibold tracking-tight md:text-[28px]">Ma déclaration</h1>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Les onze rubriques du module de base de la norme volontaire européenne, B1 à B11. Aucun champ n’y est
          ajouté : c’est le plafond que le législateur a jugé proportionné pour une petite entreprise.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3">
        <p className="text-[13px]">
          <span className="font-medium">Ne rien déclarer est autorisé, et a un prix.</span>{' '}
          <span className="chiffre" style={{ color: 'var(--pc-retard)' }}>
            {formaterEuros(restant, locale)}
          </span>{' '}
          restent au forfait.
          {gain > 0 && (
            <>
              {' '}
              <span className="chiffre font-medium" style={{ color: 'var(--pc-conforme)' }}>
                {formaterEuros(gain, locale)} déjà économisés
              </span>{' '}
              dans cette session.
            </>
          )}
        </p>
        <Button variant="contour" taille="sm" onClick={exporter}>
          <Download className="h-3.5 w-3.5" />
          Exporter en JSON conforme
        </Button>
      </div>
      <p className="-mt-4 text-[12px] text-[var(--pc-encre-tenue)]">
        L’export suit le schéma ouvert déjà décrit sur l’écran « Mon impact ». Vous pouvez le donner à n’importe quel
        autre client : c’est ce qui rend l’effort rentable, plutôt que de le refaire pour chaque acheteur.
      </p>

      <ol className="space-y-3">
        {RUBRIQUES.map((r) => (
          <Ligne
            key={r.cle}
            rubrique={r}
            locale={locale}
            saisie={saisies[r.cle]}
            ouverte={ouverte === r.cle}
            onOuvrir={() => setOuverte(ouverte === r.cle ? null : r.cle)}
            onSaisir={(v) => setSaisies((s) => ({ ...s, [r.cle]: v }))}
          />
        ))}
      </ol>
    </div>
  );
}

function Ligne({
  rubrique,
  locale,
  saisie,
  ouverte,
  onOuvrir,
  onSaisir,
}: {
  rubrique: Rubrique;
  locale: Locale;
  saisie?: string;
  ouverte: boolean;
  onOuvrir: () => void;
  onSaisir: (v: string) => void;
}) {
  const [brouillon, setBrouillon] = React.useState('');
  const [piece, setPiece] = React.useState('');
  const declaree = rubrique.valeurDeclaree || saisie;
  const piecesPossibles = PIECES.filter((p) => p.rubriques.includes(rubrique.cle));

  return (
    <li className="carte px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[14.5px] font-medium">
            <span className="chiffre text-[var(--pc-encre-tenue)]">{rubrique.code}</span> · {rubrique.intitule}
          </p>
          <p className="mt-0.5 text-[12.5px] text-[var(--pc-encre-douce)]">{rubrique.demande}</p>
        </div>
        {declaree ? <PuceStatut statut="declare" /> : rubrique.forfait ? <PuceStatut statut="forfait" /> : null}
      </div>

      {rubrique.valeurDeclaree && (
        <p className="mt-3 flex items-start gap-2 rounded-[var(--pc-rayon)] bg-[var(--pc-fond-enfonce)] px-3 py-2 text-[13px]">
          <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: 'var(--pc-conforme)' }} aria-hidden />
          <span>
            {rubrique.valeurDeclaree.valeur}
            <span className="chiffre block text-[11.5px] text-[var(--pc-encre-tenue)]">
              déclaré le {formaterDate(rubrique.valeurDeclaree.declareeLe, locale)}
            </span>
          </span>
        </p>
      )}

      {saisie && !rubrique.valeurDeclaree && (
        <p className="mt-3 rounded-[var(--pc-rayon)] px-3 py-2 text-[13px]" style={{ background: 'var(--pc-conforme-fond)', color: 'var(--pc-conforme)' }}>
          {saisie} — enregistré dans cette session.{' '}
          {rubrique.forfait && (
            <strong className="font-semibold">
              {formaterEuros(rubrique.forfait.coutAnnuelEur, locale)} économisés par an.
            </strong>
          )}
        </p>
      )}

      {rubrique.forfait && !declaree && (
        <div
          className="mt-3 rounded-[var(--pc-rayon)] border px-4 py-3"
          style={{ borderColor: 'var(--pc-retard)' }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-[13px]">
              <span className="font-medium">Valeur forfaitaire appliquée :</span> {rubrique.forfait.valeur}
            </p>
            <p className="chiffre text-[14px] font-semibold" style={{ color: 'var(--pc-retard)' }}>
              {formaterEuros(rubrique.forfait.coutAnnuelEur, locale)} par an
            </p>
          </div>
          <p className="mt-1 text-[11.5px] text-[var(--pc-encre-tenue)]">
            Source du forfait : aucune administration belge n’en publie — valeur de démonstration, au quantile haut de
            la branche. Elle porte sur vos marchés, pas sur votre entreprise.
          </p>

          {!ouverte ? (
            <Button variant="contour" taille="sm" className="mt-3" onClick={onOuvrir}>
              Je fais mieux que le forfait
            </Button>
          ) : (
            <form
              className="mt-3 space-y-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                if (brouillon.trim()) onSaisir(brouillon.trim());
              }}
            >
              <label className="block text-[12.5px]">
                <span className="font-medium">Votre valeur</span>
                <input
                  value={brouillon}
                  onChange={(e) => setBrouillon(e.target.value)}
                  required
                  placeholder={rubrique.forfait.valeur}
                  className="mt-1 h-9 w-full rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] px-2.5 text-[13px]"
                />
              </label>
              <label className="block text-[12.5px]">
                <span className="font-medium">Pièce justificative</span>
                <select
                  value={piece}
                  onChange={(e) => setPiece(e.target.value)}
                  required
                  className="mt-1 h-9 w-full rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] px-2.5 text-[13px]"
                >
                  <option value="">Choisir une pièce…</option>
                  {piecesPossibles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.objet}
                    </option>
                  ))}
                </select>
                {piecesPossibles.length === 0 && (
                  <span className="mt-1 flex items-center gap-1.5 text-[11.5px] text-[var(--pc-encre-tenue)]">
                    <Paperclip className="h-3 w-3" aria-hidden />
                    Aucune pièce ne couvre encore cette rubrique.
                  </span>
                )}
              </label>
              <Button variant="primaire" taille="sm" type="submit">
                Enregistrer et gagner {formaterEuros(rubrique.forfait.coutAnnuelEur, locale)}
              </Button>
            </form>
          )}
        </div>
      )}

      {rubrique.sansEffetSurLesMarches && (
        <p className="mt-3 text-[12.5px] text-[var(--pc-encre-tenue)]">
          Cette rubrique n’entre dans aucun calcul de marché : elle ne vous coûte rien de ne pas la remplir. Elle
          figure ici parce qu’elle appartient au module de base — et parce qu’un jour un acheteur pourra la demander.
        </p>
      )}
    </li>
  );
}
