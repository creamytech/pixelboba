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

export const metadata: Metadata = {
  title: 'Web Design Services & Pricing | Starting at $1,500 | Pixel Boba',
  description:
    'professional web design starting at $1,500. next.js development, react websites, ecommerce solutions. competitive pricing with no calls needed - get a custom proposal by email within 24 hours.',
  openGraph: {
    title: 'Web Design Services & Pricing | Starting at $1,500 | Pixel Boba',
    description:
      'professional web design starting at $1,500. next.js development, react websites, ecommerce solutions. competitive pricing with no calls needed - get a custom proposal by email within 24 hours.',
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
    title: 'Web Design Services & Pricing | Starting at $1,500 | Pixel Boba',
    description:
      'professional web design starting at $1,500. next.js development, react websites, ecommerce solutions. competitive pricing with no calls needed - get a custom proposal by email within 24 hours.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com/services',
  },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-8 lowercase">
                services - websites that pop
              </h1>
              <CTABanner />
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              <PriceCard
                title="website redesign"
                price="starting at $1,500"
                deliveryTime="1–2 weeks"
                badge="quick start"
                description="refresh your existing site with modern design and improved performance"
                features={[
                  'modern design refresh',
                  'mobile optimization',
                  'speed improvements',
                  'seo audit included',
                  'content migration',
                  '2 rounds of revisions',
                ]}
              />
              <PriceCard
                title="custom website build"
                price="starting at $3,500"
                deliveryTime="3–4 weeks"
                description="brand new website built from scratch with custom features"
                features={[
                  'custom design & development',
                  'responsive across all devices',
                  'cms integration',
                  'contact forms & analytics',
                  'basic seo setup',
                  '3 rounds of revisions',
                  '1 month free support',
                ]}
              />
              <PriceCard
                title="advanced website build"
                price="starting at $8,000"
                deliveryTime="6–8 weeks"
                highlighted={true}
                description="complex websites with advanced features and integrations"
                features={[
                  'everything in custom build',
                  'advanced functionality',
                  'third-party integrations',
                  'custom animations',
                  'advanced seo optimization',
                  'user authentication',
                  'database integration',
                  'unlimited revisions',
                  '3 months free support',
                ]}
              />
              <PriceCard
                title="ongoing care"
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
              <div className="bg-white rounded-xl p-8 border border-ink/10 shadow-sm">
                <h3 className="font-display text-2xl font-bold text-ink mb-6 lowercase text-center">
                  popular add-ons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-milk-tea/10 rounded-lg">
                      <span className="text-gray-700 font-medium lowercase">
                        branding & logo design
                      </span>
                      <span className="font-bold text-taro lowercase">starting at $750</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-milk-tea/10 rounded-lg">
                      <span className="text-gray-700 font-medium lowercase">custom animations</span>
                      <span className="font-bold text-taro lowercase">starting at $500</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-milk-tea/10 rounded-lg">
                      <span className="text-gray-700 font-medium lowercase">ecommerce setup</span>
                      <span className="font-bold text-taro lowercase">starting at $2,500</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-milk-tea/10 rounded-lg">
                      <span className="text-gray-700 font-medium lowercase">
                        seo optimization package
                      </span>
                      <span className="font-bold text-taro lowercase">starting at $1,200</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                <div className="bg-white rounded-xl p-8 border border-ink/10 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-display text-xl font-bold text-ink mb-4 lowercase">
                    next.js development
                  </h3>
                  <p className="text-gray-600 mb-6 lowercase">
                    high-performance websites with modern react framework. server-side rendering and
                    optimal seo.
                  </p>
                  <Link
                    href="/services/nextjs-development"
                    className="inline-flex items-center text-taro hover:text-deep-taro font-medium lowercase transition-colors duration-200"
                  >
                    learn more →
                  </Link>
                </div>
                <div className="bg-white rounded-xl p-8 border border-ink/10 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-display text-xl font-bold text-ink mb-4 lowercase">
                    e-commerce development
                  </h3>
                  <p className="text-gray-600 mb-6 lowercase">
                    custom online stores with shopify, stripe integration, and conversion
                    optimization.
                  </p>
                  <Link
                    href="/services/ecommerce-development"
                    className="inline-flex items-center text-taro hover:text-deep-taro font-medium lowercase transition-colors duration-200"
                  >
                    learn more →
                  </Link>
                </div>
                <div className="bg-white rounded-xl p-8 border border-ink/10 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-display text-xl font-bold text-ink mb-4 lowercase">
                    saas website design
                  </h3>
                  <p className="text-gray-600 mb-6 lowercase">
                    conversion-focused websites for software companies with user onboarding flows.
                  </p>
                  <Link
                    href="/services/saas-website-design"
                    className="inline-flex items-center text-taro hover:text-deep-taro font-medium lowercase transition-colors duration-200"
                  >
                    learn more →
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
