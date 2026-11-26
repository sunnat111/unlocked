import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import '@/styles/tokens.css';
import '@/styles/globals.css';
import '@/styles/site.css';
import '@/styles/app.css';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Unlocked SAT', template: '%s | Unlocked SAT' },
  applicationName: 'Unlocked SAT',
};

export const viewport: Viewport = {
  themeColor: '#0c1529',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
