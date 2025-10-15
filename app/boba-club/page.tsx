import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BobaClubHero from '@/components/boba-club/BobaClubHero';
import BobaClubHowItWorks from '@/components/boba-club/BobaClubHowItWorks';
import BobaClubFeatures from '@/components/boba-club/BobaClubFeatures';
import BobaClubWhyUs from '@/components/boba-club/BobaClubWhyUs';
import BobaClubPricing from '@/components/boba-club/BobaClubPricing';
import BobaClubFAQ from '@/components/boba-club/BobaClubFAQ';
import BobaClubPortfolio from '@/components/boba-club/BobaClubPortfolio';
import BobaClubTestimonials from '@/components/boba-club/BobaClubTestimonials';
import BobaClubFinalCTA from '@/components/boba-club/BobaClubFinalCTA';
import BobaClubStickyButton from '@/components/boba-club/BobaClubStickyButton';

export const metadata: Metadata = {
  title: 'Boba Club: Unlimited Design for $3,000 a Month | Pixel Boba',
  description:
    'Your personal design team for everything visual. Branding, illustrations, UI, web, and social content — all under one flat monthly rate. Pause or cancel anytime. Average turnaround in 24–48 hours.',
  openGraph: {
    title: 'Boba Club: Unlimited Design for $3,000 a Month',
    description:
      'Your personal design team for everything visual. Branding, illustrations, UI, web, and social content — all under one flat monthly rate. Pause or cancel anytime.',
    url: 'https://pixelboba.com/boba-club',
    siteName: 'pixel boba',
    images: [
      {
        url: 'https://pixelboba.com/Pixel_Boba_Icon_PNG.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boba Club: Unlimited Design for $3,000 a Month',
    description:
      'Your personal design team for everything visual. Branding, illustrations, UI, web, and social content — all under one flat monthly rate. Pause or cancel anytime.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com/boba-club',
  },
};

export default function BobaClubPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Boba Club - Unlimited Design Subscription',
            description:
              'Unlimited design requests for a flat monthly rate. Get branding, illustrations, UI, web, and social content with 24-48 hour delivery.',
            provider: {
              '@type': 'Organization',
              name: 'Pixel Boba',
              url: 'https://pixelboba.com',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: '3000',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                priceCurrency: 'USD',
                price: '3000',
                unitText: 'MONTH',
              },
            },
          }),
        }}
      />
      <Header />
      <main className="overflow-hidden">
        <BobaClubHero />
        <BobaClubHowItWorks />
        <BobaClubFeatures />
        <BobaClubWhyUs />
        <BobaClubPricing />
        <BobaClubFAQ />
        <BobaClubPortfolio />
        <BobaClubTestimonials />
        <BobaClubFinalCTA />
      </main>
      <Footer />
      <BobaClubStickyButton />
    </div>
  );
}
