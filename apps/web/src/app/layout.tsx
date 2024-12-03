// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import '../app/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meriah Minpro',
  description: 'Minpro Event EO',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>
        <Header />
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        <Footer />
      </body>
    </html>
  );
}