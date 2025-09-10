import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ServicesPreview from '@/components/sections/ServicesPreview';
import CodeFirstSection from '@/components/sections/CodeFirstSection';
import ProcessSection from '@/components/sections/ProcessSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import StickyCTA from '@/components/common/StickyCTA';

export const metadata: Metadata = {
  title: 'Professional Web Design & Development | Pixel Boba | Starting at $1,500',
  description:
    'custom websites that convert. live previews from day 1, 1-8 week delivery, no endless meetings. starting at $1,500. based in fort lauderdale, florida.',
  openGraph: {
    title: 'Professional Web Design & Development | Pixel Boba | Starting at $1,500',
    description:
      'custom websites that convert. live previews from day 1, 1-8 week delivery, no endless meetings. starting at $1,500. based in fort lauderdale, florida.',
    url: 'https://pixelboba.com',
    siteName: 'pixel boba',
    images: [
      {
        url: 'https://pixelboba.com/Pixel_Boba_Icon_PNG.png',
        width: 512,
        height: 512,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Web Design & Development | Pixel Boba | Starting at $1,500',
    description:
      'custom websites that convert. live previews from day 1, 1-8 week delivery, no endless meetings. starting at $1,500. based in fort lauderdale, florida.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ServicesPreview />
        {/* <TestimonialsSection /> */}
        <CodeFirstSection />
        <ProcessSection />
        <CTASection />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
