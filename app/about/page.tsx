import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AboutPageClient from '@/components/about/AboutPageClient';
import StickyCTA from '@/components/common/StickyCTA';

export const metadata: Metadata = {
  title: 'About Pixel Boba - Web Design Team | Fort Lauderdale',
  description:
    'Meet the Pixel Boba team. Fort Lauderdale web design agency building custom websites with code-first quality, performance and accessibility from day one. Learn about our process and expertise.',
  openGraph: {
    title: 'About Pixel Boba - Web Design Team | Fort Lauderdale',
    description:
      'Meet the Pixel Boba team. Fort Lauderdale web design agency building custom websites with code-first quality, performance and accessibility from day one. Learn about our process and expertise.',
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
      'Meet the Pixel Boba team. Fort Lauderdale web design agency building custom websites with code-first quality, performance and accessibility from day one. Learn about our process and expertise.',
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
      <StickyCTA />
    </div>
  );
}
