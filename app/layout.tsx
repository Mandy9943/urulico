import './globals.css';
import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const syne = Syne({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-syne' });

export const metadata: Metadata = {
  title: 'Urulico - Servicios en Uruguay',
  description: 'Encuentra los mejores servicios y pequeños negocios en Uruguay',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} ${syne.variable} min-h-screen bg-black antialiased`}>
        {children}
      </body>
    </html>
  );
}