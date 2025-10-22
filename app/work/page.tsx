import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllWork } from '@/lib/mdx';
import StickyCTA from '@/components/common/StickyCTA';
import WorkGridClient from '@/components/work/WorkGridClient';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getLayoutStyles } from '@/lib/layout-settings';

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
  const catStyles = await getLayoutStyles('cta-cat-work');

  return (
    <div className="min-h-screen">
      <Header>
        {/* Hero Section */}
        <div className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden">
          {/* Floating cat decoration */}
          <div className="absolute top-10 right-[8%] w-32 h-32 opacity-20 hidden md:block">
            <Image src="/02.svg" alt="" width={128} height={128} className="w-full h-full" />
          </div>

          <div className="max-w-5xl mx-auto text-center mb-20 relative z-10">
            {/* Badge */}
            <div className="inline-block bg-[#7C3AED]/10 text-[#7C3AED] px-6 py-3 rounded-full border-2 border-[#7C3AED]/20 mb-8">
              <span className="font-black text-sm uppercase tracking-wider">🎨 Our Portfolio</span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-ink mb-8 leading-tight">
              Our <span className="italic text-[#7C3AED]">Work</span>
            </h1>
            <p className="text-2xl md:text-3xl text-ink/70 font-bold leading-tight max-w-3xl mx-auto">
              Sites that help real businesses grow. Explore the mix of design and development
              we&apos;ve brewed for our clients.
            </p>
          </div>

          {/* Work Grid */}
          <div className="mb-20">
            <WorkGridClient works={works} />
          </div>

          {/* Bottom CTA with cat */}
          <div className="max-w-3xl mx-auto relative">
            {/* Cat peeking over - Editable in /admin/layout-editor */}
            <div
              className="absolute -top-20 left-1/2 -translate-x-1/2 z-10 transition-all duration-300"
              style={catStyles}
            >
              <Image
                src="/01.svg"
                alt=""
                width={160}
                height={160}
                className="w-36 h-36 sm:w-40 sm:h-40"
              />
            </div>

            <div className="text-center bg-white border-4 border-ink rounded-3xl shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] p-12 pt-20">
              <h2 className="text-5xl md:text-6xl font-black text-ink mb-6 leading-tight">
                Your Project Could Be Next
              </h2>
              <p className="text-2xl text-ink/70 font-bold mb-8">
                Ready to start building something amazing?
              </p>
              <a
                href="/start"
                className="inline-flex items-center px-12 py-6 bg-[#FDB97A] text-ink text-xl font-black rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                START YOUR PROJECT →
              </a>
            </div>
          </div>
        </div>
      </Header>
      <Footer />
      <StickyCTA />
    </div>
  );
}
