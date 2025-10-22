import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import SocialProofSection from '@/components/sections/SocialProofSection';
import BobaClubPromo from '@/components/sections/BobaClubPromo';
import ServicesPreview from '@/components/sections/ServicesPreview';
import CodeFirstSection from '@/components/sections/CodeFirstSection';
import ProcessSection from '@/components/sections/ProcessSection';
import CTASection from '@/components/sections/CTASection';
import StickyCTA from '@/components/common/StickyCTA';

export const metadata: Metadata = {
  title: 'Fort Lauderdale Web Design & Development | Local South Florida',
  description:
    'Fort Lauderdale web design company creating custom websites that convert. Local South Florida team, live previews from day 1, no endless meetings. Serving Broward County, Miami-Dade, and Palm Beach County.',
  openGraph: {
    title: 'Fort Lauderdale Web Design & Development | Local South Florida',
    description:
      'Fort Lauderdale web design company creating custom websites that convert. Local South Florida team, live previews from day 1, no endless meetings. Serving Broward County, Miami-Dade, and Palm Beach County.',
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
    title: 'Fort Lauderdale Web Design & Development | Local South Florida',
    description:
      'Fort Lauderdale web design company creating custom websites that convert. Local South Florida team, live previews from day 1, no endless meetings. Serving Broward County, Miami-Dade, and Palm Beach County.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header>
        <HeroSection />
        <SocialProofSection />
        <BobaClubPromo />
        <ServicesPreview />
        <CodeFirstSection />
        <ProcessSection />
      </Header>
      <main>
        <CTASection />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
