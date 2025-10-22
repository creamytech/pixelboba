import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StepCard from '@/components/process/StepCard';
import DashboardMockup from '@/components/process/DashboardMockup';
import FeedbackSection from '@/components/process/FeedbackSection';
import QualityChecklist from '@/components/process/QualityChecklist';
import ProcessFAQ from '@/components/process/ProcessFAQ';
import StickyCTA from '@/components/common/StickyCTA';
import Image from 'next/image';
import { Icon } from '@iconify/react';

export const metadata: Metadata = {
  title: 'Our Web Design Process | 3-Step Workflow',
  description:
    'A simple 3-step Fort Lauderdale web design process. Clear steps, clean builds, and quick turnarounds. Discovery, design & build, launch & support for South Florida businesses. Call (754) 243-4766.',
  openGraph: {
    title: 'Our Web Design Process | 3-Step Workflow',
    description:
      'A simple 3-step Fort Lauderdale web design process. Clear steps, clean builds, and quick turnarounds. Discovery, design & build, launch & support for South Florida businesses. Call (754) 243-4766.',
    url: 'https://pixelboba.com/process',
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
    title: 'Our Web Design Process | 3-Step Workflow',
    description:
      'A simple 3-step Fort Lauderdale web design process. Clear steps, clean builds, and quick turnarounds. Discovery, design & build, launch & support for South Florida businesses. Call (754) 243-4766.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com/process',
  },
};

const processSteps = [
  {
    stepNumber: '1',
    title: 'Shake: Define the Flavor',
    description:
      'Turn your project form into a clear brief with sitemap, wireframes, and tech plan.',
    whatYouGet: 'Project brief, clickable prototype, and timeline',
    timing: '3–5 days',
  },
  {
    stepNumber: '2',
    title: 'Brew: Design Meets Code',
    description: 'Create your visual design and develop the site with live previews throughout.',
    whatYouGet: 'Figma designs, staging site, and progress updates',
    timing: '2–5 weeks',
  },
  {
    stepNumber: '3',
    title: 'Pop: Review Your Build Live',
    description: "Test your site, provide feedback, and fine-tune every detail until it's perfect.",
    whatYouGet: 'Live preview, feedback rounds, and final adjustments',
    timing: '3–5 days',
  },
  {
    stepNumber: '4',
    title: 'Launch: Go Public',
    description: 'Deploy your site, set up analytics, and make it available to the world.',
    whatYouGet: 'Live site, analytics setup, and performance monitoring',
    timing: '1–2 days',
  },
  {
    stepNumber: '5',
    title: 'Refill: Keep It Fresh',
    description: 'Ongoing support and updates to keep your site running smoothly.',
    whatYouGet: 'Monthly updates, security patches, and priority support',
    timing: 'Ongoing',
  },
];

export default function ProcessPage() {
  return (
    <div className="min-h-screen">
      <Header>
        <div className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden">
          {/* Floating cat decoration */}
          <div className="absolute top-10 right-[8%] w-32 h-32 opacity-20 hidden md:block">
            <Image src="/03.svg" alt="" width={128} height={128} className="w-full h-full" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Badge */}
            <div className="text-center mb-20">
              <div className="inline-block bg-[#7C3AED]/10 text-[#7C3AED] px-6 py-3 rounded-full border-2 border-[#7C3AED]/20 mb-8">
                <span className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                  <Icon icon="ph:arrows-clockwise-duotone" className="w-5 h-5" />
                  Our Process
                </span>
              </div>

              {/* Hero */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-ink mb-8 leading-tight">
                How We <span className="italic text-[#7C3AED]">Build</span>
              </h1>
              <p className="text-2xl md:text-3xl text-ink/70 font-bold leading-tight max-w-3xl mx-auto mb-8">
                A simple workflow that keeps things moving. Clear steps, clean builds, and quick
                turnarounds.
              </p>
              <p className="text-2xl font-black text-[#7C3AED]">
                <a href="tel:+17542434766" className="hover:text-[#A78BFA] transition-colors">
                  (754) 243-4766
                </a>
              </p>
            </div>

            {/* Process Steps */}
            <div className="mb-20">
              <h2 className="text-5xl md:text-6xl font-black text-ink mb-6 text-center">
                How We <span className="italic text-[#7C3AED]">Brew</span> Your Website
              </h2>
              <p className="text-2xl text-ink/70 font-bold text-center mb-12">
                Here&apos;s What Happens in Each Phase of Your Project
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {processSteps.map((step, index) => (
                  <div
                    key={step.stepNumber}
                    className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-[#FDB97A] text-ink px-4 py-2 rounded-full font-black text-lg border-3 border-ink">
                        {step.stepNumber}
                      </div>
                      <div className="bg-[#7C3AED]/10 text-[#7C3AED] px-4 py-2 rounded-full border-2 border-[#7C3AED]/20">
                        <span className="font-black text-sm">{step.timing}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-ink mb-3">{step.title}</h3>
                    <p className="text-lg font-bold text-ink/70 mb-4">{step.description}</p>
                    <div className="bg-cream rounded-2xl p-4 border-2 border-ink/10">
                      <p className="text-sm font-black text-ink mb-2">What You Get:</p>
                      <p className="text-sm font-bold text-ink/70">{step.whatYouGet}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Dashboard Section */}
            <div className="mb-20">
              <h2 className="text-5xl md:text-6xl font-black text-ink mb-6 text-center">
                Your <span className="italic text-[#7C3AED]">Dashboard</span>
              </h2>
              <p className="text-2xl text-ink/70 font-bold text-center mb-12 max-w-3xl mx-auto">
                Once we kick off, you&apos;ll get access to your own Pixel Boba dashboard. All
                project communication happens here. No messy email chains or lost files.
              </p>

              {/* Dashboard Features */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
                  <div className="mb-4">
                    <Icon icon="ph:chart-line-up-duotone" className="w-16 h-16 text-deep-taro" />
                  </div>
                  <h3 className="text-2xl font-black text-ink mb-3">Progress Tracking</h3>
                  <p className="text-lg font-bold text-ink/70">
                    See where your site is at in real-time.
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
                  <div className="mb-4">
                    <Icon icon="ph:chat-circle-dots-duotone" className="w-16 h-16 text-deep-taro" />
                  </div>
                  <h3 className="text-2xl font-black text-ink mb-3">Messaging</h3>
                  <p className="text-lg font-bold text-ink/70">
                    Drop feedback and questions directly inside the project space.
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
                  <div className="mb-4">
                    <Icon icon="ph:credit-card-duotone" className="w-16 h-16 text-deep-taro" />
                  </div>
                  <h3 className="text-2xl font-black text-ink mb-3">Invoices & Payments</h3>
                  <p className="text-lg font-bold text-ink/70">
                    Simple, transparent, and always available.
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
                  <div className="mb-4">
                    <Icon icon="ph:eye-duotone" className="w-16 h-16 text-deep-taro" />
                  </div>
                  <h3 className="text-2xl font-black text-ink mb-3">Live Previews</h3>
                  <p className="text-lg font-bold text-ink/70">
                    Click through your site as it&apos;s being built, not weeks later.
                  </p>
                </div>
              </div>

              <DashboardMockup />

              <div className="text-center mt-8">
                <p className="text-lg font-bold text-ink/60">
                  This is a real client dashboard from a recent project. Your dashboard will look
                  similar with your project details, timeline, and team messages.
                </p>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="mb-20">
              <FeedbackSection />
            </div>

            {/* Quality Checklist */}
            <div className="mb-20">
              <QualityChecklist />
            </div>

            {/* FAQ Section */}
            <div className="mb-20">
              <ProcessFAQ />
            </div>

            {/* Bottom CTA with cat */}
            <div className="relative">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-10">
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
                  Ready To Start Moving?
                </h2>
                <p className="text-2xl text-ink/70 font-bold mb-8">
                  No phone calls, no discovery meetings—just fill out our project form and
                  we&apos;ll get brewing.
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
        </div>
      </Header>
      <Footer />
      <StickyCTA />
    </div>
  );
}
