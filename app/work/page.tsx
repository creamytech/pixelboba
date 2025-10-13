import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllWork } from '@/lib/mdx';
import StickyCTA from '@/components/common/StickyCTA';
import WorkGridClient from '@/components/work/WorkGridClient';

export const metadata: Metadata = {
  title: 'Web Design Portfolio | Real Client Results',
  description:
    'Browse our Fort Lauderdale web design portfolio featuring beautiful, high-performance websites and digital experiences. See real client case studies and results from our web design projects for South Florida businesses.',
  openGraph: {
    title: 'Web Design Portfolio | Real Client Results',
    description:
      'Browse our Fort Lauderdale web design portfolio featuring beautiful, high-performance websites and digital experiences. See real client case studies and results from our web design projects for South Florida businesses.',
    url: 'https://pixelboba.com/work',
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
    title: 'Web Design Portfolio | Real Client Results',
    description:
      'Browse our Fort Lauderdale web design portfolio featuring beautiful, high-performance websites and digital experiences. See real client case studies and results from our web design projects for South Florida businesses.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com/work',
  },
};

export default async function WorkPage() {
  const works = await getAllWork();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-milk-tea via-background to-taro/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-ink mb-8 lowercase leading-tight">
                our work
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 lowercase leading-relaxed max-w-3xl mx-auto">
                sites that help real businesses grow. explore the mix of design and development
                we&apos;ve brewed for our clients.
              </p>
            </div>
          </div>
        </section>

        {/* Work Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <WorkGridClient works={works} />
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-20 bg-gradient-to-br from-taro/5 to-milk-tea">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-4xl md:text-6xl font-bold text-ink mb-6 lowercase leading-tight">
                your project could be next.
              </h2>
              <p className="text-xl text-gray-700 mb-8 lowercase">ready to start?</p>
              <a
                href="/start"
                className="inline-flex items-center px-8 py-4 bg-taro hover:bg-deep-taro text-white text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-taro/30 lowercase"
              >
                start now
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
