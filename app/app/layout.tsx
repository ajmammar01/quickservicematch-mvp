import type { Metadata } from 'next';
import './globals.css';
import './leaflet.css';
import { Inter, Outfit } from 'next/font/google';
// 🚧 Hidden for MVP - Authentication
// import { NextAuthProvider } from '../components/providers/NextAuthProvider';
import { ToastProvider } from '../components/providers/ToastProvider';
import { ThemeProvider } from '../components/theme/ThemeProvider';
import ScrollIndicator from '@/components/ScrollIndicator';

// Primary font for headings
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

// Secondary font for body text
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'QuickServiceMatch - Find English-Speaking Service Providers',
  description: 'Find trusted English-speaking service providers anywhere. QuickServiceMatch helps expats, travelers, and internationals connect with reliable local professionals.',
  keywords: 'english speaking service provider, expat services, international services, local services, service matching',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${inter.variable}`}>
      <body className="font-sans bg-background min-h-screen">
        <ThemeProvider>
          {/* 🚧 Hidden for MVP - Authentication */}
          {/* <NextAuthProvider> */}
            <ToastProvider>
              <ScrollIndicator />
              {children}
            </ToastProvider>
          {/* </NextAuthProvider> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
