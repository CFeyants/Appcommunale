import { notFound } from 'next/navigation';
import Link from 'next/link';
import { REGISTRE_TRAITEMENTS, RETENTION_TRACES_JOURS, SCOPES_DEMANDES } from '@pc/core';
import { dictionnaire, estLocale, type Locale } from '@/i18n';
import { SCOPES_ECARTES } from '@/contenu/itsme-demo';

/**
 * Le registre des traitements.
 *
 * Une finalité, une base légale, des données nommées, une durée. Écrit à
 * l'écran plutôt que dans un document interne : c'est la seule forme qui
 * permette à quelqu'un de vérifier.
 */
export default async function PageViePrivee({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  return (
    <div className="contenu max-w-2xl py-10 md:py-14">
      <h1 className="text-[28px] font-semibold tracking-tight md:text-[32px]">{d.nav.vieePrivee}</h1>
      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-[var(--pc-encre-douce)]">
        Aucun compte n’est requis pour lire. L’identification n’est demandée que pour ce qui l’exige réellement, et
        chaque traitement ci-dessous porte sa finalité, sa base légale et sa durée de conservation.
      </p>

      <div className="mt-6 rounded-[var(--pc-rayon)] border border-[var(--pc-accent)] bg-[var(--pc-accent-doux)] px-5 py-4">
        <h2 className="text-[15px] font-semibold">Le numéro de registre national n’est ni demandé, ni stocké</h2>
        <p className="mt-2 text-[13.5px] text-[var(--pc-encre-douce)]">
          En Belgique, l’usage du numéro de registre national est encadré. La plateforme ne demande pas la portée{' '}
          <code className="font-mono text-[12.5px]">eid</code> d’itsme, qui le porterait, et n’en conserve donc aucune
          trace. La clé interne est l’identifiant de sujet propre au service, qu’itsme renvoie déjà pseudonymisé par
          service demandeur. Si un usage futur l’exigeait, il faudrait une base légale explicite : ce serait une
          décision, pas une commodité technique.
        </p>
        <p className="mt-3 text-[12.5px]">
          <span className="font-medium">Portées demandées :</span>{' '}
          <span className="font-mono">{SCOPES_DEMANDES.join(', ')}</span>
        </p>
        <p className="mt-1 text-[12.5px]">
          <span className="font-medium">Portées volontairement écartées :</span>{' '}
          <span className="font-mono">{SCOPES_ECARTES.map((s) => s.scope).join(', ')}</span>
        </p>
      </div>

      <h2 className="mt-9 text-[19px] font-semibold tracking-tight">Registre des traitements</h2>
      <ul className="mt-4 space-y-3">
        {REGISTRE_TRAITEMENTS.map((t) => (
          <li key={t.finalite} className="carte px-5 py-4">
            <h3 className="text-[15px] font-semibold">{t.finalite}</h3>
            <dl className="mt-2.5 space-y-1.5 text-[12.5px]">
              <Ligne terme="Base légale" valeur={t.baseLegale} />
              <Ligne terme="Données" valeur={t.donnees.join(' · ')} />
              <Ligne terme="Conservation" valeur={t.conservation} />
              <Ligne terme="Destinataires" valeur={t.destinataires} />
            </dl>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-[19px] font-semibold tracking-tight">Ce que la plateforme ne fait pas</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-[var(--pc-encre-douce)]">
        <li>Aucun traceur tiers, aucun pixel, aucune régie publicitaire, aucun courtier de données.</li>
        <li>Aucune revente, aucun partage de données de comportement, jamais.</li>
        <li>Aucune déduction sur les opinions politiques, la religion, la santé, l’orientation sexuelle ou l’origine.</li>
        <li>Aucune notification par défaut, aucune relance d’inactivité, aucun score citoyen.</li>
        <li>Aucune synchronisation de vos indicateurs personnels : ils restent sur votre appareil.</li>
        <li>
          Les traces de navigation, si vous avez accordé le consentement B, sont effacées automatiquement après{' '}
          {RETENTION_TRACES_JOURS} jours.
        </li>
      </ul>

      <h2 className="mt-10 text-[19px] font-semibold tracking-tight">Vos droits, exerçables sans nous écrire</h2>
      <p className="mt-2 max-w-prose text-[14px] leading-relaxed text-[var(--pc-encre-douce)]">
        Tant qu’aucun compte n’existe, tout ce qui vous concerne vit dans le stockage de votre navigateur. La page{' '}
        <Link href={`/${l}/preferences/deduit`} className="text-[var(--pc-accent)] underline underline-offset-2">
          {d.nav.croitSavoir}
        </Link>{' '}
        permet de supprimer chaque attribut déduit un par un, et l’écran{' '}
        <Link href={`/${l}/preferences`} className="text-[var(--pc-accent)] underline underline-offset-2">
          {d.nav.preferences}
        </Link>{' '}
        d’effacer tout d’un seul bouton. L’effacement est immédiat et ne demande aucune demande écrite.
      </p>
    </div>
  );
}

function Ligne({ terme, valeur }: { terme: string; valeur: string }) {
  return (
    <div className="flex flex-wrap gap-x-2">
      <dt className="font-medium">{terme}</dt>
      <dd className="text-[var(--pc-encre-douce)]">{valeur}</dd>
    </div>
  );
}
