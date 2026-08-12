import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import '@pc/ui/styles.css';
import './global.css';

/*
 * Les polices sont auto-hébergées par next/font : aucune requête vers un
 * serveur tiers au chargement, et l'application reste lisible hors ligne.
 */
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Plateforme citoyenne',
  description:
    'Ce que la commune, la Communauté, la Région, la Belgique et l’Union décident, dépensent, promettent et tiennent.',
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f6f2' },
    { media: '(prefers-color-scheme: dark)', color: '#131519' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${display.variable}`}>
      <head>
        {/*
          Le thème est appliqué avant la peinture : sans cela, un utilisateur en
          mode sombre reçoit un éclair blanc à chaque navigation. Le script est
          inline et minuscule, et ne lit que localStorage.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pc-theme')||'systeme';var d=t==='sombre'||(t==='systeme'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
