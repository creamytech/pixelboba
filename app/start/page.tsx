import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StartProjectForm from '@/components/form/StartProjectForm';
import Image from 'next/image';
import { Icon } from '@iconify/react';

export const metadata: Metadata = {
  title: 'Start Your Project | Fort Lauderdale Web Design',
  description:
    'Tell us about your project and get a custom web design proposal within 24 hours. Call (754) 243-4766 or fill out our quick form.',
  openGraph: {
    title: 'Start Your Project | Fort Lauderdale Web Design',
    description:
      'Tell us about your project and get a custom web design proposal within 24 hours. Call (754) 243-4766 or fill out our quick form.',
    url: 'https://pixelboba.com/start',
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
    title: 'Start Your Project | Fort Lauderdale Web Design',
    description:
      'Tell us about your project and get a custom web design proposal within 24 hours. Call (754) 243-4766 or fill out our quick form.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com/start',
  },
};

export default function StartProjectPage() {
  return (
    <div className="min-h-screen">
      <Header>
        <div className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden">
          {/* Floating cat decoration */}
          <div className="absolute top-10 left-[8%] w-32 h-32 opacity-20 hidden md:block">
            <Image src="/03.svg" alt="" width={128} height={128} className="w-full h-full" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Badge */}
            <div className="text-center mb-20">
              <div className="inline-block bg-[#7C3AED]/10 text-[#7C3AED] px-6 py-3 rounded-full border-2 border-[#7C3AED]/20 mb-8">
                <span className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                  <Icon icon="ph:rocket-duotone" className="w-5 h-5" />
                  Let&apos;s Start
                </span>
              </div>

              {/* Hero */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-ink mb-8 leading-tight">
                Let&apos;s Build Something <span className="italic text-[#7C3AED]">Great</span>
              </h1>
              <p className="text-2xl md:text-3xl text-ink/70 font-bold leading-tight max-w-3xl mx-auto mb-8">
                Tell us about your project, and we&apos;ll send you a custom proposal within 24
                hours.
              </p>
              <p className="text-2xl font-black text-[#7C3AED]">
                <a href="tel:+17542434766" className="hover:text-[#A78BFA] transition-colors">
                  (754) 243-4766
                </a>
              </p>
            </div>

            {/* Process Steps */}
            <div className="grid md:grid-cols-3 gap-6 mb-20">
              <div className="bg-gradient-to-br from-[#C4B5FD] to-[#A78BFA] rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] text-center text-white">
                <div className="mb-4">
                  <Icon icon="ph:note-pencil-duotone" className="w-16 h-16 mx-auto" />
                </div>
                <div className="bg-white/90 text-ink px-4 py-2 rounded-full font-black text-sm border-2 border-ink inline-block mb-4">
                  STEP 1
                </div>
                <h3 className="text-2xl font-black mb-3">Fill The Form</h3>
                <p className="text-lg font-bold opacity-90">
                  Takes 5 minutes, tell us what you need
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] text-center text-white">
                <div className="mb-4">
                  <Icon icon="ph:lightning-duotone" className="w-16 h-16 mx-auto" />
                </div>
                <div className="bg-white/90 text-ink px-4 py-2 rounded-full font-black text-sm border-2 border-ink inline-block mb-4">
                  STEP 2
                </div>
                <h3 className="text-2xl font-black mb-3">Get Proposal</h3>
                <p className="text-lg font-bold opacity-90">
                  Custom quote in your inbox within 24 hours
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] text-center text-white">
                <div className="mb-4">
                  <Icon icon="ph:rocket-launch-duotone" className="w-16 h-16 mx-auto" />
                </div>
                <div className="bg-white/90 text-ink px-4 py-2 rounded-full font-black text-sm border-2 border-ink inline-block mb-4">
                  STEP 3
                </div>
                <h3 className="text-2xl font-black mb-3">Start Building</h3>
                <p className="text-lg font-bold opacity-90">
                  Approve and we&apos;ll kick off your project
                </p>
              </div>
            </div>

            {/* Form with cat */}
            <div className="relative mb-20">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10">
                <Image src="/02.svg" alt="" width={120} height={120} className="w-28 h-28" />
              </div>

              <div className="bg-white border-4 border-ink rounded-3xl shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] p-12 pt-20">
                <StartProjectForm />
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] text-center">
                <div className="mb-3">
                  <Icon icon="ph:lightning-duotone" className="w-12 h-12 text-deep-taro mx-auto" />
                </div>
                <h3 className="text-3xl font-black text-[#7C3AED] mb-2">24 Hours</h3>
                <p className="text-lg font-bold text-ink/70">Response Time</p>
              </div>
              <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] text-center">
                <div className="mb-3">
                  <Icon icon="ph:hundred-duotone" className="w-12 h-12 text-deep-taro mx-auto" />
                </div>
                <h3 className="text-3xl font-black text-[#7C3AED] mb-2">100%</h3>
                <p className="text-lg font-bold text-ink/70">Custom Proposals</p>
              </div>
              <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] text-center">
                <div className="mb-3">
                  <Icon icon="ph:target-duotone" className="w-12 h-12 text-deep-taro mx-auto" />
                </div>
                <h3 className="text-3xl font-black text-[#7C3AED] mb-2">0</h3>
                <p className="text-lg font-bold text-ink/70">Meetings Needed</p>
              </div>
            </div>
          </div>
        </div>
      </Header>
      <Footer />
    </div>
  );
}
