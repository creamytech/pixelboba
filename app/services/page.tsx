import { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PricingSelector from '@/components/services/PricingSelector';
import CTABanner from '@/components/services/CTABanner';
import HowItWorks from '@/components/services/HowItWorks';
import StartProjectForm from '@/components/form/StartProjectForm';
import PlatformsSection from '@/components/sections/PlatformsSection';
import ProcessPreview from '@/components/services/ProcessPreview';
import WhatsIncluded from '@/components/services/WhatsIncluded';
import ComparisonTable from '@/components/services/ComparisonTable';

export const metadata: Metadata = {
  title: 'Web Design Services & Pricing | Fort Lauderdale',
  description:
    'Professional Fort Lauderdale web design services. Next.js development, React websites, SaaS & ecommerce solutions. Competitive pricing - call (754) 243-4766 or get a custom proposal within 24 hours.',
  openGraph: {
    title: 'Web Design Services & Pricing | Fort Lauderdale',
    description:
      'Professional Fort Lauderdale web design services. Next.js development, React websites, SaaS & ecommerce solutions. Competitive pricing - call (754) 243-4766 or get a custom proposal within 24 hours.',
    url: 'https://pixelboba.com/services',
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
    title: 'Web Design Services & Pricing | Fort Lauderdale',
    description:
      'Professional Fort Lauderdale web design services. Next.js development, React websites, SaaS & ecommerce solutions. Competitive pricing - call (754) 243-4766 or get a custom proposal within 24 hours.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com/services',
  },
};

export default function ServicesPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Web Design & Development Services',
    description:
      'Professional Fort Lauderdale web design services including Next.js development, React websites, SaaS & ecommerce solutions.',
    provider: {
      '@type': 'ProfessionalService',
      name: 'pixel boba llc',
      url: 'https://pixelboba.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Fort Lauderdale',
        addressRegion: 'FL',
        addressCountry: 'US',
      },
    },
    areaServed: [
      'Fort Lauderdale',
      'Broward County',
      'Miami',
      'Miami-Dade County',
      'Palm Beach County',
      'South Florida',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Design Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Website Redesign',
            description: 'Modern design refresh with mobile optimization and speed improvements',
          },
          price: '1500',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: '1500',
            priceCurrency: 'USD',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Website Build',
            description: 'Brand new website built from scratch with custom features',
          },
          price: '3500',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Advanced Website Build',
            description: 'Complex websites with advanced features and integrations',
          },
          price: '8000',
          priceCurrency: 'USD',
        },
      ],
    },
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Header>
        {/* Hero Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-cream">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center">
            <div className="inline-block bg-deep-taro px-6 py-3 rounded-full border-[3px] border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] mb-8">
              <span className="font-black text-white text-sm sm:text-base uppercase tracking-wider flex items-center gap-2">
                <Icon icon="ph:lightning-duotone" className="w-5 h-5" />
                Simple Pricing, No Surprises
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-ink mb-6 leading-tight">
              What We Build
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-ink/70 font-bold mb-10 max-w-3xl mx-auto">
              Professional websites that get you more customers. Fast delivery, transparent pricing.
            </p>
          </div>
        </section>

        {/* What's Included Section */}
        <WhatsIncluded />

        {/* Pricing Selector */}
        <PricingSelector />

        {/* Add-ons Section */}
        <section className="pb-20 bg-cream">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl p-8 sm:p-10 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink mb-8 text-center">
                  Popular Add-Ons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 sm:p-5 bg-cream rounded-2xl border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                      <span className="text-ink font-black text-sm sm:text-base">
                        Branding & Logo Design
                      </span>
                      <span className="font-black text-deep-taro text-sm sm:text-base whitespace-nowrap ml-2">
                        $750+
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 sm:p-5 bg-cream rounded-2xl border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                      <span className="text-ink font-black text-sm sm:text-base">
                        Custom Animations
                      </span>
                      <span className="font-black text-deep-taro text-sm sm:text-base whitespace-nowrap ml-2">
                        $500+
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 sm:p-5 bg-cream rounded-2xl border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                      <span className="text-ink font-black text-sm sm:text-base">
                        E-Commerce Setup
                      </span>
                      <span className="font-black text-deep-taro text-sm sm:text-base whitespace-nowrap ml-2">
                        $2,500+
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 sm:p-5 bg-cream rounded-2xl border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                      <span className="text-ink font-black text-sm sm:text-base">SEO Package</span>
                      <span className="font-black text-deep-taro text-sm sm:text-base whitespace-nowrap ml-2">
                        $1,200+
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <ComparisonTable />

        {/* Platforms Section */}
        <PlatformsSection />

        {/* How It Works */}
        <HowItWorks />

        {/* Project Form */}
        <section id="start-project" className="py-16 sm:py-20 bg-cream">
          <div id="start"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-ink mb-4 sm:mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl sm:text-2xl text-ink/70 font-bold mb-4">
                Call Us or Fill Out the Form Below
              </p>
              <a
                href="tel:+17542434766"
                className="inline-flex items-center gap-2 text-2xl sm:text-3xl font-black text-deep-taro hover:text-taro transition-colors"
              >
                <Icon icon="ph:phone-duotone" className="w-8 h-8 sm:w-9 sm:h-9" />
                (754) 243-4766
              </a>
            </div>
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
              <StartProjectForm />
            </div>
          </div>
        </section>
      </Header>
      <Footer />
    </div>
  );
}
