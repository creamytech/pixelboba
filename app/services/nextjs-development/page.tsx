import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Code, Zap, Shield, Smartphone } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import StickyCTA from '@/components/common/StickyCTA';

export const metadata: Metadata = {
  title: 'Next.js Development Services | React Web Development',
  description:
    'professional next.js development services. custom react websites, server-side rendering, and modern web applications. fast, secure, and scalable solutions for businesses.',
  openGraph: {
    title: 'Next.js Development Services | React Web Development',
    description:
      'professional next.js development services. custom react websites, server-side rendering, and modern web applications. fast, secure, and scalable solutions for businesses.',
    url: 'https://pixelboba.com/services/nextjs-development',
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
    title: 'Next.js Development Services | React Web Development',
    description:
      'professional next.js development services. custom react websites, server-side rendering, and modern web applications. fast, secure, and scalable solutions for businesses.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com/services/nextjs-development',
  },
};

const features = [
  {
    icon: Zap,
    title: 'lightning fast performance',
    description: 'server-side rendering and static generation for optimal speed and seo.',
  },
  {
    icon: Shield,
    title: 'enterprise security',
    description: 'built-in security features and best practices for production applications.',
  },
  {
    icon: Smartphone,
    title: 'mobile-first design',
    description: 'responsive layouts that work perfectly on all devices and screen sizes.',
  },
  {
    icon: Code,
    title: 'modern development',
    description: 'typescript, tailwind css, and the latest react features for maintainable code.',
  },
];

const benefits = [
  'server-side rendering for better seo',
  'automatic code splitting for faster loading',
  'built-in image optimization',
  'api routes for backend functionality',
  'static site generation for performance',
  'typescript support for better code quality',
  'vercel deployment for easy hosting',
  'progressive web app capabilities',
];

export default function NextJSPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Next.js Development Services',
            description:
              'Professional Next.js development services including custom React websites, server-side rendering, and modern web applications.',
            provider: {
              '@type': 'Organization',
              name: 'Pixel Boba',
              url: 'https://pixelboba.com',
            },
            areaServed: ['Fort Lauderdale', 'Miami', 'Florida', 'United States', 'Global'],
            serviceType: 'Next.js Development',
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
        {/* Breadcrumb Navigation */}
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: 'home', href: '/' },
              { label: 'services', href: '/services' },
              { label: 'next.js development', href: '/services/nextjs-development' },
            ]}
          />
        </div>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-milk-tea to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-8 lowercase">
                next.js development services
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed lowercase max-w-3xl mx-auto mb-8">
                modern react websites built with next.js. server-side rendering, static generation,
                and enterprise-grade performance. part of our <strong>custom website build</strong>{' '}
                service starting at $3,500.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-taro hover:bg-deep-taro text-white px-8 py-4"
                >
                  <Link href="/start">start your project</Link>
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
                why choose next.js?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                what you get
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
                next.js development includes all features of our custom website build tier, plus
                modern react framework advantages for performance and seo.
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
                ready to build something amazing?
              </h2>
              <p className="text-xl text-gray-600 mb-4 lowercase">
                get a custom next.js development proposal within 24 hours.
              </p>
              <p className="text-lg text-gray-600 mb-8 lowercase">
                call us:{' '}
                <a
                  href="tel:+17542434766"
                  className="font-bold text-taro hover:text-deep-taro transition-colors"
                >
                  (754) 243-4766
                </a>
              </p>
              <Button asChild size="lg" className="bg-taro hover:bg-deep-taro text-white px-8 py-4">
                <Link href="/start" className="inline-flex items-center space-x-2">
                  <span>start your project</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <p className="text-gray-500 mt-4 text-sm lowercase">
                custom development starting at $3,500 • 3-6 week delivery
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
