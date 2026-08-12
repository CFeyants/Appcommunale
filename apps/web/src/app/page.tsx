import { redirect } from 'next/navigation';
import { LOCALE_PAR_DEFAUT } from '@/i18n';

export default function Racine() {
  redirect(`/${LOCALE_PAR_DEFAUT}`);
}
