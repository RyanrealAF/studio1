
import type {Metadata} from 'next';
import './globals.css';
import { Sidebar } from '@/components/vocal-surgeon/Sidebar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'VOCAL SURGEON | Precise Audio Repair',
  description: 'A tool built on a single conviction: the words were already known. Everything else is surgery.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background text-foreground antialiased selection:bg-primary/30 overflow-x-hidden">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:ml-64 relative">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
