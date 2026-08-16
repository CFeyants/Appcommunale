'use client';

import * as React from 'react';
import { Flag } from 'lucide-react';
import { Button } from '@pc/ui';
import { formaterDate } from '@/i18n';

/**
 * « Je conteste ce calcul ».
 *
 * La contestation est publique et reste attachée au marché, **y compris si elle
 * est rejetée** — exactement comme un acte écarté reste au registre avec son
 * motif. Rien n'est supprimé.
 *
 * Sans serveur, les contestations vivent sur l'appareil de la personne. C'est
 * une limite, et elle est écrite à l'écran plutôt que masquée : une
 * contestation qui ne part nulle part n'est pas encore une contestation
 * publique, et le dire fait partie du produit.
 */

const CLE = 'pc-contestations';

interface Contestee {
  id: string;
  marcheId: string;
  ligne: string;
  valeurProposee: string;
  source: string;
  deposeeLe: string;
  etat: 'deposee' | 'retenue' | 'rejetee';
  motif?: string;
}

/** Une contestation de démonstration, pour montrer qu'un rejet reste affiché. */
const SEMENCE: Contestee[] = [
  {
    id: 'demo-1',
    marcheId: 'voirie',
    ligne: 'enrobe',
    valeurProposee: '44 kg CO₂e/t au lieu de 58',
    source: 'Déclaration environnementale de produit du fournisseur, enrobé tiède',
    deposeeLe: '2026-07-30',
    etat: 'rejetee',
    motif:
      'La déclaration citée porte sur un enrobé tiède, alors que le marché en cours spécifie une mise en œuvre à chaud. La valeur proposée sera exacte le jour où le cahier des charges changera — elle ne l’est pas aujourd’hui. La contestation reste affichée.',
  },
];

export function Contestation({
  marcheId,
  lignes,
}: {
  marcheId: string;
  lignes: Array<{ cle: string; libelle: string }>;
}) {
  const [liste, setListe] = React.useState<Contestee[]>([]);
  const [ouvert, setOuvert] = React.useState(false);
  const [ligne, setLigne] = React.useState(lignes[0]?.cle ?? '');
  const [valeur, setValeur] = React.useState('');
  const [source, setSource] = React.useState('');

  React.useEffect(() => {
    let locales: Contestee[] = [];
    try {
      locales = JSON.parse(localStorage.getItem(CLE) ?? '[]');
    } catch {
      /* stockage indisponible */
    }
    setListe([...SEMENCE, ...locales].filter((c) => c.marcheId === marcheId));
  }, [marcheId]);

  const deposer = (e: React.FormEvent) => {
    e.preventDefault();
    const nouvelle: Contestee = {
      id: `${Date.now()}`,
      marcheId,
      ligne,
      valeurProposee: valeur,
      source,
      deposeeLe: new Date().toISOString().slice(0, 10),
      etat: 'deposee',
    };
    let locales: Contestee[] = [];
    try {
      locales = JSON.parse(localStorage.getItem(CLE) ?? '[]');
      localStorage.setItem(CLE, JSON.stringify([...locales, nouvelle]));
    } catch {
      /* ignoré */
    }
    setListe((l) => [...l, nouvelle]);
    setValeur('');
    setSource('');
    setOuvert(false);
  };

  const libelleLigne = (cle: string) => lignes.find((x) => x.cle === cle)?.libelle ?? cle;

  return (
    <section className="mt-5 border-t border-[var(--pc-trait)] pt-4" aria-label="Contestations de ce calcul">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-[13px] font-semibold">
          Contestations{' '}
          <span className="chiffre font-normal text-[var(--pc-encre-tenue)]">{liste.length}</span>
        </h4>
        <Button variant="contour" taille="sm" onClick={() => setOuvert((v) => !v)}>
          <Flag className="h-3.5 w-3.5" />
          Je conteste ce calcul
        </Button>
      </div>

      {ouvert && (
        <form onSubmit={deposer} className="mt-3 space-y-3 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-eleve)] px-4 py-3">
          <label className="block text-[12.5px]">
            <span className="font-medium">Quelle ligne</span>
            <select
              value={ligne}
              onChange={(e) => setLigne(e.target.value)}
              className="mt-1 h-9 w-full rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] px-2.5 text-[13px]"
            >
              {lignes.map((x) => (
                <option key={x.cle} value={x.cle}>
                  {x.libelle}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[12.5px]">
            <span className="font-medium">Quelle valeur proposez-vous</span>
            <input
              value={valeur}
              onChange={(e) => setValeur(e.target.value)}
              required
              placeholder="par exemple : 44 kg CO₂e/t au lieu de 58"
              className="mt-1 h-9 w-full rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] px-2.5 text-[13px]"
            />
          </label>
          <label className="block text-[12.5px]">
            <span className="font-medium">Quelle source</span>
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
              placeholder="déclaration environnementale de produit, étude, mesure…"
              className="mt-1 h-9 w-full rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] px-2.5 text-[13px]"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primaire" taille="sm" type="submit">
              Déposer la contestation
            </Button>
            <span className="text-[11.5px] text-[var(--pc-encre-tenue)]">
              Sans serveur, elle reste sur votre appareil. Une contestation qui ne part nulle part n’est pas encore
              publique — c’est une limite, pas une fonctionnalité.
            </span>
          </div>
        </form>
      )}

      {liste.length > 0 && (
        <ul className="mt-3 space-y-2">
          {liste.map((c) => (
            <li
              key={c.id}
              className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3 text-[12.5px]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium">{libelleLigne(c.ligne)}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide"
                  style={{
                    color:
                      c.etat === 'retenue'
                        ? 'var(--pc-conforme)'
                        : c.etat === 'rejetee'
                          ? 'var(--pc-serieux)'
                          : 'var(--pc-encre-douce)',
                    backgroundColor:
                      c.etat === 'retenue'
                        ? 'var(--pc-conforme-fond)'
                        : c.etat === 'rejetee'
                          ? 'var(--pc-serieux-fond)'
                          : 'var(--pc-fond-enfonce)',
                  }}
                >
                  {c.etat === 'retenue' ? 'retenue' : c.etat === 'rejetee' ? 'rejetée' : 'déposée'}
                </span>
              </div>
              <p className="mt-1 text-[var(--pc-encre-douce)]">
                Valeur proposée : {c.valeurProposee} — source : {c.source}
              </p>
              {c.motif && (
                <p className="mt-1 text-[var(--pc-encre-tenue)]">
                  <span className="font-medium">Motif de la décision :</span> {c.motif}
                </p>
              )}
              <p className="chiffre mt-1 text-[11.5px] text-[var(--pc-encre-tenue)]">
                Déposée le {formaterDate(c.deposeeLe, 'fr')} · elle reste attachée au marché, y compris rejetée
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
