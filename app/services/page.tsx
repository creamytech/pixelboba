import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PriceCard from '@/components/services/PriceCard';
import CTABanner from '@/components/services/CTABanner';
import HowItWorks from '@/components/services/HowItWorks';
import StartProjectForm from '@/components/form/StartProjectForm';

export const metadata: Metadata = {
  title: 'pixel boba — services & pricing (starting at)',
  description:
    'custom web design and redesigns with starting-at pricing. no calls needed, tell us what you need and get a custom proposal by email.',
  openGraph: {
    title: 'pixel boba — services & pricing',
    description:
      'custom web design and redesigns with starting-at pricing. no calls needed, tell us what you need and get a custom proposal by email.',
    url: 'https://pixelboba.com/services',
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
    title: 'pixel boba — services & pricing',
    description:
      'custom web design and redesigns with starting-at pricing. no calls needed, tell us what you need and get a custom proposal by email.',
    images: ['https://pixelboba.com/og-image.png'],
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <PriceCard
                title="website redesign"
                price="starting at $750"
                features={[
                  'modern design refresh',
                  'mobile optimization',
                  'speed & seo improvements',
                  'basic accessibility fixes',
                  '1-2 week delivery',
                  '30 days of tweaks included',
                ]}
              />
              <PriceCard
                title="custom website build"
                price="starting at $1,500"
                features={[
                  'custom design system',
                  '4-6 fully designed pages',
                  'smooth animations & interactions',
                  'cms setup + training',
                  'basic seo optimization',
                  '3-4 week delivery',
                  'launch support included',
                ]}
              />
              <PriceCard
                title="advanced website build"
                price="starting at $4,000"
                features={[
                  'full design system + brand guide',
                  '6-12 custom pages',
                  'complex animations & interactions',
                  'third-party integrations',
                  'advanced cms + training',
                  'comprehensive seo setup',
                  '4-6 week delivery',
                  '60 days support included',
                ]}
                highlighted={true}
              />
            </div>

            {/* Ongoing Care & Add-ons */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PriceCard
                  title="ongoing care plans"
                  price="starting at $99/month"
                  features={[
                    'content updates & tweaks',
                    'security & performance monitoring',
                    'priority bug fixes',
                    'monthly backup & reports',
                    'no long-term contracts',
                  ]}
                />
                <div className="bg-white rounded-xl p-8 border border-ink/10 shadow-sm">
                  <h3 className="font-display text-2xl font-bold text-ink mb-6 lowercase">
                    add-ons
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600 lowercase">branding & logo design</span>
                      <span className="font-semibold text-taro lowercase">starting at $350</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600 lowercase">custom animations</span>
                      <span className="font-semibold text-taro lowercase">starting at $200</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600 lowercase">ecommerce setup</span>
                      <span className="font-semibold text-taro lowercase">starting at $1,000</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600 lowercase">seo optimization package</span>
                      <span className="font-semibold text-taro lowercase">starting at $750</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

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
