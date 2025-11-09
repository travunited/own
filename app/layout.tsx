import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Travunited - Visa & Tour Booking Platform',
  description: 'Apply for visas and book curated tour packages with ease. Multi-country visa services and domestic & international tours.',
  keywords: 'visa application, tour booking, travel packages, international tours, visa services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}

