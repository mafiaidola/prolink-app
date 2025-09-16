import type { Metadata } from 'next';
import { AppProvider } from '@/components/providers';
import './globals.css';
import { getHomepageContent } from '@/lib/data';
import { Inter, Poppins, PT_Sans } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
  weight: ['400', '500', '600', '700'],
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '700'],
});


export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomepageContent();
  
  return {
    title: content.title || 'ProLink - Your Digital Profile',
    description: content.subtitle || 'Create, manage, and share your professional digital profile with ProLink.',
    icons: {
      icon: content.faviconUrl || '/favicon.ico',
    },
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${ptSans.variable}`}>
      <head />
      <body className="font-body antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
