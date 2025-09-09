import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Check,
  ShoppingCart,
  CreditCard,
  Shield,
  Smartphone,
  TrendingUp,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'E-commerce Website Development | Online Store Design | Pixel Boba',
  description:
    'custom e-commerce website development. shopify, next.js, and react online stores. payment processing, inventory management, and mobile-optimized shopping experiences starting at $8,000.',
  openGraph: {
    title: 'E-commerce Website Development | Online Store Design | Pixel Boba',
    description:
      'custom e-commerce website development. shopify, next.js, and react online stores. payment processing, inventory management, and mobile-optimized shopping experiences starting at $8,000.',
    url: 'https://pixelboba.com/services/ecommerce-development',
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
    title: 'E-commerce Website Development | Online Store Design | Pixel Boba',
    description:
      'custom e-commerce website development. shopify, next.js, and react online stores. payment processing, inventory management, and mobile-optimized shopping experiences starting at $8,000.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com/services/ecommerce-development',
  },
};

const features = [
  {
    icon: ShoppingCart,
    title: 'custom shopping cart',
    description:
      'intuitive shopping experience with advanced cart functionality and checkout flow.',
  },
  {
    icon: CreditCard,
    title: 'payment processing',
    description: 'secure stripe integration with support for all major payment methods.',
  },
  {
    icon: Shield,
    title: 'secure & compliant',
    description: 'pci compliance, ssl certificates, and enterprise-grade security measures.',
  },
  {
    icon: Smartphone,
    title: 'mobile commerce',
    description: 'optimized mobile shopping experience for on-the-go customers.',
  },
  {
    icon: TrendingUp,
    title: 'analytics & insights',
    description: 'comprehensive tracking and reporting for sales and customer behavior.',
  },
  {
    icon: Users,
    title: 'customer accounts',
    description: 'user registration, order history, and personalized shopping experiences.',
  },
];

const benefits = [
  'custom product catalog design',
  'advanced inventory management system',
  'automated order processing & fulfillment tracking',
  'customer account management with order history',
  'advanced search & filtering functionality',
  'abandoned cart recovery automation',
  'comprehensive seo optimization for products',
  'social media integration & sharing',
  'email marketing automation setup',
  'multi-currency & payment gateway support',
  'real-time shipping calculator integration',
  'comprehensive admin dashboard',
  'mobile-optimized shopping experience',
  'ssl certificate & security compliance',
  'google analytics & conversion tracking',
  'customer reviews & ratings system',
];

export default function EcommercePage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'E-commerce Website Development',
            description:
              'Custom e-commerce website development including online stores, payment processing, inventory management, and mobile-optimized shopping experiences.',
            provider: {
              '@type': 'Organization',
              name: 'Pixel Boba',
              url: 'https://pixelboba.com',
            },
            areaServed: ['Fort Lauderdale', 'Miami', 'Florida', 'United States', 'Global'],
            serviceType: 'E-commerce Development',
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: '4000',
              priceSpecification: {
                '@type': 'PriceSpecification',
                priceCurrency: 'USD',
                price: '4000',
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
                e-commerce development
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed lowercase max-w-3xl mx-auto mb-8">
                custom online stores that convert visitors into customers. shopify, next.js, and
                headless commerce solutions. part of our <strong>advanced website build</strong>{' '}
                service starting at $8,000.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-taro hover:bg-deep-taro text-white px-8 py-4"
                >
                  <Link href="/services#start">start your store</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-taro text-taro">
                  <Link href="/work">see our work</Link>
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
                e-commerce features
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

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-b from-transparent to-milk-tea/10">
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

        {/* Platforms Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-8 lowercase">
                platforms we work with
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-ink mb-2 lowercase">shopify development</h3>
                  <p className="text-gray-600 text-sm lowercase">
                    custom shopify themes, app integrations, and headless commerce solutions.
                  </p>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-ink mb-2 lowercase">next.js commerce</h3>
                  <p className="text-gray-600 text-sm lowercase">
                    custom e-commerce solutions built with next.js and modern web technologies.
                  </p>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-ink mb-2 lowercase">headless commerce</h3>
                  <p className="text-gray-600 text-sm lowercase">
                    decoupled frontend and backend for maximum flexibility and performance.
                  </p>
                </div>
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
                  part of our advanced website build package starting at $8,000
                </span>
              </div>
              <p className="text-lg text-gray-600 mb-8 lowercase">
                e-commerce development includes all enterprise features of our advanced website
                build tier, plus specialized online store functionality and payment processing.
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
                ready to start selling online?
              </h2>
              <p className="text-xl text-gray-600 mb-8 lowercase">
                get a custom e-commerce development proposal within 24 hours. no calls required.
              </p>
              <Button asChild size="lg" className="bg-taro hover:bg-deep-taro text-white px-8 py-4">
                <Link href="/services#start" className="inline-flex items-center space-x-2">
                  <span>start your store</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <p className="text-gray-500 mt-4 text-sm lowercase">
                e-commerce development starting at $8,000 • 6-12 week delivery
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
