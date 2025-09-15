import type { Metadata } from 'next';
import { AppProvider } from '@/components/providers';
import './globals.css';
import { getHomepageContent } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomepageContent();
  
  return {
    title: 'ProLink - Your Digital Profile',
    description: 'Create, manage, and share your professional digital profile with ProLink.',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
