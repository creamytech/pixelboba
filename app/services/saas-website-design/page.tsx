import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Zap, Users, TrendingUp, Shield, Globe, BarChart } from 'lucide-react';
import StickyCTA from '@/components/common/StickyCTA';

export const metadata: Metadata = {
  title: 'SaaS Website Design | Software Landing Pages',
  description:
    'professional saas website design and software landing pages. conversion-optimized designs that turn visitors into paying customers. built with next.js and react for growth-focused companies.',
  openGraph: {
    title: 'SaaS Website Design | Software Landing Pages',
    description:
      'professional saas website design and software landing pages. conversion-optimized designs that turn visitors into paying customers. built with next.js and react for growth-focused companies.',
    url: 'https://pixelboba.com/services/saas-website-design',
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
    title: 'SaaS Website Design | Software Landing Pages',
    description:
      'professional saas website design and software landing pages. conversion-optimized designs that turn visitors into paying customers. built with next.js and react for growth-focused companies.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com/services/saas-website-design',
  },
};

const features = [
  {
    icon: TrendingUp,
    title: 'conversion optimization',
    description: 'data-driven design decisions to maximize signups and trial conversions.',
  },
  {
    icon: Users,
    title: 'user onboarding',
    description: 'clear value propositions and streamlined signup flows for better ux.',
  },
  {
    icon: BarChart,
    title: 'analytics integration',
    description: 'comprehensive tracking to understand user behavior and optimize performance.',
  },
  {
    icon: Shield,
    title: 'trust & credibility',
    description: 'security badges, testimonials, and social proof to build customer confidence.',
  },
  {
    icon: Globe,
    title: 'seo optimized',
    description: 'technical seo implementation to help your saas rank higher in search results.',
  },
  {
    icon: Zap,
    title: 'fast performance',
    description: 'lightning-fast loading times critical for saas customer acquisition.',
  },
];

const benefits = [
  'conversion-optimized landing pages',
  'feature showcase & benefits sections',
  'strategic pricing table design',
  'customer testimonials & case studies',
  'optimized free trial & signup forms',
  'product demo & walkthrough sections',
  'trust badges & security compliance display',
  'integration showcase pages',
  'help documentation & support pages',
  'fully mobile-responsive design',
  'a/b testing ready components',
  'google analytics & tracking setup',
  'email capture & lead generation forms',
  'professional copywriting consultation',
  'competitive analysis integration',
  'user onboarding flow optimization',
];

const caseStudies = [
  {
    company: 'techflow solutions',
    industry: 'project management',
    result: 'modern saas design with clear value proposition',
    link: '/work/techflow-solutions',
  },
];

export default function SaaSPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'SaaS Website Design',
            description:
              'Professional SaaS website design and software landing pages. Conversion-optimized designs that turn visitors into paying customers.',
            provider: {
              '@type': 'Organization',
              name: 'Pixel Boba',
              url: 'https://pixelboba.com',
            },
            areaServed: ['Fort Lauderdale', 'Miami', 'Florida', 'United States', 'Global'],
            serviceType: 'SaaS Website Design',
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: '1500',
              priceSpecification: {
                '@type': 'PriceSpecification',
                priceCurrency: 'USD',
                price: '1500',
                eligibleQuantity: {
                  '@type': 'QuantitativeValue',
                  minValue: 1,
                  unitText: 'project',
                },
              },
            },
          }),
        }}
      />
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-milk-tea to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-8 lowercase">
                saas website design
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed lowercase max-w-3xl mx-auto mb-8">
                conversion-optimized saas websites that turn visitors into paying customers. clear
                value propositions, streamlined signups, and modern design. part of our{' '}
                <strong>custom website build</strong> service starting at $3,500.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-taro hover:bg-deep-taro text-white px-8 py-4"
                >
                  <Link href="/services#start">start your project</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-taro text-taro">
                  <Link href="/work/techflow-solutions">see saas case study</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-16 text-center lowercase">
                saas-focused features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-taro/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-taro" />
                      </div>
                      <h3 className="font-semibold text-ink mb-2 lowercase">{feature.title}</h3>
                      <p className="text-gray-600 text-sm lowercase">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Case Study Preview */}
        <section className="py-20 bg-gradient-to-b from-transparent to-milk-tea/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-12 text-center lowercase">
                saas success story
              </h2>
              {caseStudies.map((study, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="text-center">
                    <h3 className="font-display text-2xl font-bold text-ink mb-2 lowercase">
                      {study.company}
                    </h3>
                    <p className="text-taro font-medium mb-4 lowercase">{study.industry}</p>
                    <p className="text-gray-600 mb-6 lowercase">{study.result}</p>
                    <Button asChild variant="outline" className="border-taro text-taro">
                      <Link href={study.link}>view case study</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-12 text-center lowercase">
                what&apos;s included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-taro flex-shrink-0" />
                    <span className="text-gray-700 lowercase">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Badge Section */}
        <section className="py-16 bg-gradient-to-b from-transparent to-milk-tea/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center bg-taro/10 border border-taro/20 rounded-full px-6 py-3 mb-6">
                <span className="text-taro font-medium lowercase">
                  part of our custom website build package starting at $3,500
                </span>
              </div>
              <p className="text-lg text-gray-600 mb-8 lowercase">
                saas website design includes all features of our custom website build tier, plus
                specialized conversion optimization and user onboarding expertise.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center text-taro hover:text-deep-taro font-medium lowercase transition-colors duration-200"
              >
                view all pricing packages →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-6 lowercase">
                ready to grow your saas?
              </h2>
              <p className="text-xl text-gray-600 mb-8 lowercase">
                get a custom saas website design proposal within 24 hours. no calls required.
              </p>
              <Button asChild size="lg" className="bg-taro hover:bg-deep-taro text-white px-8 py-4">
                <Link href="/services#start" className="inline-flex items-center space-x-2">
                  <span>start your project</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <p className="text-gray-500 mt-4 text-sm lowercase">
                saas website design starting at $3,500 • 3-5 week delivery
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
