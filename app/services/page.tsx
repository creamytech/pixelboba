import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PriceCard from '@/components/services/PriceCard';
import CTABanner from '@/components/services/CTABanner';
import HowItWorks from '@/components/services/HowItWorks';
import StartProjectForm from '@/components/form/StartProjectForm';
import PlatformsSection from '@/components/sections/PlatformsSection';
import ProcessPreview from '@/components/services/ProcessPreview';
import WhatsIncluded from '@/components/services/WhatsIncluded';
import ComparisonTable from '@/components/services/ComparisonTable';
import BrewStrength from '@/components/services/BrewStrength';

export const metadata: Metadata = {
  title: 'Web Design Services & Pricing | Fort Lauderdale',
  description:
    'Professional Fort Lauderdale web design services. Next.js development, React websites, SaaS & ecommerce solutions. Competitive pricing with no calls needed - get a custom proposal by email within 24 hours.',
  openGraph: {
    title: 'Web Design Services & Pricing | Fort Lauderdale',
    description:
      'Professional Fort Lauderdale web design services. Next.js development, React websites, SaaS & ecommerce solutions. Competitive pricing with no calls needed - get a custom proposal by email within 24 hours.',
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
      'Professional Fort Lauderdale web design services. Next.js development, React websites, SaaS & ecommerce solutions. Competitive pricing with no calls needed - get a custom proposal by email within 24 hours.',
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
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-milk-tea via-background to-taro/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-ink mb-8 lowercase leading-tight">
                services & pricing
              </h1>
              <CTABanner />
            </div>
          </div>
        </section>

        {/* What's Included Section */}
        <WhatsIncluded />

        {/* Pricing Cards */}
        <section className="pb-20">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-[1600px] mx-auto py-8">
              <PriceCard
                title="starter brew"
                price="starting at $1,500"
                deliveryTime="1–2 weeks"
                badge="quick start"
                description="refresh your existing site with modern design and improved performance"
                features={[
                  'mobile-optimized',
                  '1:1 code preview updates',
                  'launch-ready in 1–2 weeks',
                  'modern design refresh',
                  'speed improvements',
                  'seo audit included',
                ]}
              />
              <PriceCard
                title="custom blend"
                price="starting at $3,500"
                deliveryTime="3–4 weeks"
                highlighted={true}
                description="brand new website built from scratch with custom features"
                features={[
                  'mobile-optimized',
                  '1:1 code preview updates',
                  'launch-ready in 3–4 weeks',
                  'custom design & development',
                  'cms integration',
                  'contact forms & analytics',
                  '1 month free support',
                ]}
              />
              <PriceCard
                title="full flavor"
                price="starting at $8,000"
                deliveryTime="6–8 weeks"
                description="complex websites with advanced features and integrations"
                features={[
                  'mobile-optimized',
                  '1:1 code preview updates',
                  'launch-ready in 6–8 weeks',
                  'everything in custom blend',
                  'advanced functionality',
                  'third-party integrations',
                  'custom animations',
                  'user authentication',
                  '3 months free support',
                ]}
              />
              <PriceCard
                title="refills"
                price="starting at $99/month"
                badge="peace of mind"
                description="keep your website updated, secure, and performing at its best"
                features={[
                  'monthly updates & backups',
                  'security monitoring',
                  'performance optimization',
                  'content updates (2 hours)',
                  'priority support',
                  'uptime monitoring',
                  'monthly reports',
                ]}
              />
            </div>

            {/* Add-ons Section */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-white to-milk-tea/20 rounded-2xl p-10 border-2 border-ink/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="font-display text-3xl md:text-4xl font-bold text-ink mb-8 lowercase text-center">
                  popular add-ons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="group flex justify-between items-center p-5 bg-white rounded-xl border border-ink/10 hover:border-taro/30 hover:shadow-md transition-all duration-300">
                      <span className="text-gray-700 font-semibold lowercase">
                        branding & logo design
                      </span>
                      <span className="font-bold text-taro lowercase group-hover:scale-110 transition-transform duration-300">
                        starting at $750
                      </span>
                    </div>
                    <div className="group flex justify-between items-center p-5 bg-white rounded-xl border border-ink/10 hover:border-taro/30 hover:shadow-md transition-all duration-300">
                      <span className="text-gray-700 font-semibold lowercase">
                        custom animations
                      </span>
                      <span className="font-bold text-taro lowercase group-hover:scale-110 transition-transform duration-300">
                        starting at $500
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="group flex justify-between items-center p-5 bg-white rounded-xl border border-ink/10 hover:border-taro/30 hover:shadow-md transition-all duration-300">
                      <span className="text-gray-700 font-semibold lowercase">ecommerce setup</span>
                      <span className="font-bold text-taro lowercase group-hover:scale-110 transition-transform duration-300">
                        starting at $2,500
                      </span>
                    </div>
                    <div className="group flex justify-between items-center p-5 bg-white rounded-xl border border-ink/10 hover:border-taro/30 hover:shadow-md transition-all duration-300">
                      <span className="text-gray-700 font-semibold lowercase">
                        seo optimization package
                      </span>
                      <span className="font-bold text-taro lowercase group-hover:scale-110 transition-transform duration-300">
                        starting at $1,200
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

        {/* Process Preview */}
        <ProcessPreview />

        {/* Featured Services */}
        <section className="py-20 bg-gradient-to-b from-transparent to-milk-tea/10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-12 text-center lowercase">
                specialized services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group bg-white rounded-2xl p-8 border border-ink/10 shadow-md hover:shadow-2xl hover:shadow-taro/10 transition-all duration-300 hover:-translate-y-2">
                  <h3 className="font-display text-2xl font-bold text-ink mb-4 lowercase group-hover:text-taro transition-colors duration-300">
                    next.js development
                  </h3>
                  <p className="text-gray-600 mb-6 lowercase leading-relaxed">
                    the espresso shot of web frameworks. bold, fast, and packs a serious punch.
                    server-side rendering for lightning speed and seo that actually works.
                  </p>
                  <Link
                    href="/services/nextjs-development"
                    className="inline-flex items-center text-taro hover:text-deep-taro font-semibold lowercase transition-all duration-200 group-hover:translate-x-1"
                  >
                    learn more
                    <span className="ml-2">→</span>
                  </Link>
                </div>
                <div className="group bg-white rounded-2xl p-8 border border-ink/10 shadow-md hover:shadow-2xl hover:shadow-taro/10 transition-all duration-300 hover:-translate-y-2">
                  <h3 className="font-display text-2xl font-bold text-ink mb-4 lowercase group-hover:text-taro transition-colors duration-300">
                    e-commerce development
                  </h3>
                  <p className="text-gray-600 mb-6 lowercase leading-relaxed">
                    online stores that sell like cold boba on a hot day. shopify, stripe, and
                    checkout flows smooth enough to drink through a straw.
                  </p>
                  <Link
                    href="/services/ecommerce-development"
                    className="inline-flex items-center text-taro hover:text-deep-taro font-semibold lowercase transition-all duration-200 group-hover:translate-x-1"
                  >
                    learn more
                    <span className="ml-2">→</span>
                  </Link>
                </div>
                <div className="group bg-white rounded-2xl p-8 border border-ink/10 shadow-md hover:shadow-2xl hover:shadow-taro/10 transition-all duration-300 hover:-translate-y-2">
                  <h3 className="font-display text-2xl font-bold text-ink mb-4 lowercase group-hover:text-taro transition-colors duration-300">
                    saas website design
                  </h3>
                  <p className="text-gray-600 mb-6 lowercase leading-relaxed">
                    websites that convert visitors into customers faster than you can say &ldquo;add
                    tapioca pearls.&rdquo; built for software companies ready to grow.
                  </p>
                  <Link
                    href="/services/saas-website-design"
                    className="inline-flex items-center text-taro hover:text-deep-taro font-semibold lowercase transition-all duration-200 group-hover:translate-x-1"
                  >
                    learn more
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <PlatformsSection />

        {/* How It Works */}
        <HowItWorks />

        {/* Project Form */}
        <section id="start-project" className="py-20 bg-milk-tea/20">
          <div id="start"></div>
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-display text-4xl font-bold text-ink mb-4 lowercase">
                  start your project
                </h2>
                <p className="text-lg text-gray-600 lowercase">
                  tell us what you need, no calls, just a quick form
                </p>
              </div>
              <StartProjectForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
