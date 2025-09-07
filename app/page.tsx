import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ServicesPreview from '@/components/sections/ServicesPreview';
import PlatformsSection from '@/components/sections/PlatformsSection';
import CodeFirstSection from '@/components/sections/CodeFirstSection';
import ProcessSection from '@/components/sections/ProcessSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'pixel boba — websites that pop',
  description:
    'custom websites built with code-first quality. no meetings, no calls, just clean builds and quick turnarounds.',
  openGraph: {
    title: 'pixel boba — websites that pop',
    description:
      'custom websites built with code-first quality. no meetings, no calls, just clean builds and quick turnarounds.',
    url: 'https://pixelboba.com',
    siteName: 'pixel boba',
    images: [
      {
        url: 'https://pixelboba.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'pixel boba — websites that pop',
    description:
      'custom websites built with code-first quality. no meetings, no calls, just clean builds and quick turnarounds.',
    images: ['https://pixelboba.com/og-image.png'],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ServicesPreview />
        <PlatformsSection />
        <CodeFirstSection />
        <ProcessSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
