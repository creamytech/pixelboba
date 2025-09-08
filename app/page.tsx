import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ServicesPreview from '@/components/sections/ServicesPreview';
import CodeFirstSection from '@/components/sections/CodeFirstSection';
import ProcessSection from '@/components/sections/ProcessSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'pixel boba — websites that pop',
  description:
    'custom websites that convert. live previews from day 1, 2-6 week delivery, no endless meetings. starting at $750.',
  openGraph: {
    title: 'pixel boba — websites that pop',
    description:
      'custom websites that convert. live previews from day 1, 2-6 week delivery, no endless meetings. starting at $750.',
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
    title: 'pixel boba — websites that pop',
    description:
      'custom websites that convert. live previews from day 1, 2-6 week delivery, no endless meetings. starting at $750.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ServicesPreview />
        <TestimonialsSection />
        <CodeFirstSection />
        <ProcessSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
