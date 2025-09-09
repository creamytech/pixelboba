import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AboutPageClient from '@/components/about/AboutPageClient';

export const metadata: Metadata = {
  title: 'About Pixel Boba - Web Design Team | Fort Lauderdale',
  description:
    'meet the pixel boba team. custom websites built with code-first quality, performance and accessibility built in from day one. based in fort lauderdale, florida.',
  openGraph: {
    title: 'About Pixel Boba - Web Design Team | Fort Lauderdale',
    description:
      'meet the pixel boba team. custom websites built with code-first quality, performance and accessibility built in from day one. based in fort lauderdale, florida.',
    url: 'https://pixelboba.com/about',
    siteName: 'pixel boba',
    images: [
      {
        url: 'https://pixelboba.com/Pixel_Boba_Icon_PNG.png',
        width: 1200,
        height: 630,
        alt: 'pixel boba logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Pixel Boba - Web Design Team | Fort Lauderdale',
    description:
      'meet the pixel boba team. custom websites built with code-first quality, performance and accessibility built in from day one. based in fort lauderdale, florida.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <AboutPageClient />
      <Footer />
    </div>
  );
}
