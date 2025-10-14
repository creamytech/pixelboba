import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StepCard from '@/components/process/StepCard';
import DashboardMockup from '@/components/process/DashboardMockup';
import FeedbackSection from '@/components/process/FeedbackSection';
import QualityChecklist from '@/components/process/QualityChecklist';
import ProcessFAQ from '@/components/process/ProcessFAQ';
import StickyCTA from '@/components/common/StickyCTA';

export const metadata: Metadata = {
  title: 'Our Web Design Process | 3-Step Workflow',
  description:
    'A simple 3-step Fort Lauderdale web design process. No meetings, no calls, just clear steps, clean builds, and quick turnarounds. Discovery, design & build, launch & support for South Florida businesses.',
  openGraph: {
    title: 'Our Web Design Process | 3-Step Workflow',
    description:
      'A simple 3-step Fort Lauderdale web design process. No meetings, no calls, just clear steps, clean builds, and quick turnarounds. Discovery, design & build, launch & support for South Florida businesses.',
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
      'A simple 3-step Fort Lauderdale web design process. No meetings, no calls, just clear steps, clean builds, and quick turnarounds. Discovery, design & build, launch & support for South Florida businesses.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com/process',
  },
};

const processSteps = [
  {
    stepNumber: '1',
    title: 'shake: define the flavor',
    description:
      'turn your project form into a clear brief with sitemap, wireframes, and tech plan.',
    whatYouGet: 'project brief, clickable prototype, and timeline',
    timing: '3–5 days',
  },
  {
    stepNumber: '2',
    title: 'brew: design meets code',
    description: 'create your visual design and develop the site with live previews throughout.',
    whatYouGet: 'figma designs, staging site, and progress updates',
    timing: '2–5 weeks',
  },
  {
    stepNumber: '3',
    title: 'pop: review your build live',
    description:
      'test your site, provide feedback, and fine-tune every detail until it&apos;s perfect.',
    whatYouGet: 'live preview, feedback rounds, and final adjustments',
    timing: '3–5 days',
  },
  {
    stepNumber: '4',
    title: 'launch: go public',
    description: 'deploy your site, set up analytics, and make it available to the world.',
    whatYouGet: 'live site, analytics setup, and performance monitoring',
    timing: '1–2 days',
  },
  {
    stepNumber: '5',
    title: 'refill: keep it fresh',
    description: 'ongoing support and updates to keep your site running smoothly.',
    whatYouGet: 'monthly updates, security patches, and priority support',
    timing: 'ongoing',
  },
];

export default function ProcessPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-milk-tea via-background to-taro/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-ink mb-8 lowercase leading-tight">
                our process
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-12 lowercase leading-relaxed max-w-3xl mx-auto">
                a simple workflow that keeps things moving. no meetings, no calls, just clear steps,
                clean builds, and quick turnarounds.
              </p>

              {/* Quick nav links */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <a
                  href="/services"
                  className="group inline-flex items-center text-taro hover:text-deep-taro transition-all duration-200 lowercase font-semibold px-4 py-2 rounded-lg hover:bg-taro/10"
                >
                  services & pricing
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="/work"
                  className="group inline-flex items-center text-taro hover:text-deep-taro transition-all duration-200 lowercase font-semibold px-4 py-2 rounded-lg hover:bg-taro/10"
                >
                  see our work
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-6 lowercase">
                  how we brew your website
                </h2>
                <p className="text-lg text-gray-600 lowercase">
                  here&apos;s what happens in each phase of your project
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {processSteps.map((step, index) => (
                  <StepCard
                    key={step.stepNumber}
                    stepNumber={step.stepNumber}
                    title={step.title}
                    description={step.description}
                    whatYouGet={step.whatYouGet}
                    timing={step.timing}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Client Dashboard Section */}
        <section className="py-20 bg-gradient-to-b from-white to-milk-tea/10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-8 lowercase">
                  your dashboard
                </h2>
                <div className="max-w-3xl mx-auto">
                  <p className="text-xl text-gray-600 mb-8 lowercase">
                    once we kick off, you&apos;ll get access to your own pixel boba dashboard. all
                    project communication happens here. no messy email chains or lost files:
                  </p>

                  {/* Feature List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-taro rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-gray-600 leading-relaxed lowercase">
                          <strong className="text-ink">progress tracking</strong> → see where your
                          site is at in real time.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-matcha rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-gray-600 leading-relaxed lowercase">
                          <strong className="text-ink">messaging</strong> → drop feedback and
                          questions directly inside the project space.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-milk-tea rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-gray-600 leading-relaxed lowercase">
                          <strong className="text-ink">invoices & payments</strong> → simple,
                          transparent, and always available.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-taro/60 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-gray-600 leading-relaxed lowercase">
                          <strong className="text-ink">live previews</strong> → click through your
                          site as it&apos;s being built, not weeks later.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg text-gray-600 lowercase">
                    the dashboard keeps the whole process smooth and stress-free, so you always know
                    what&apos;s happening without chasing updates.
                  </p>
                </div>
              </div>

              {/* Dashboard Mockup */}
              <DashboardMockup />

              {/* Additional Context */}
              <div className="text-center mt-12">
                <p className="text-sm text-gray-500 lowercase max-w-2xl mx-auto">
                  this is a real client dashboard from a recent project. your dashboard will look
                  similar with your project details, timeline, and team messages.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <FeedbackSection />

        {/* Quality Checklist */}
        <QualityChecklist />

        {/* FAQ Section */}
        <ProcessFAQ />

        {/* Bottom CTA Section */}
        <section className="py-20 bg-gradient-to-r from-taro/10 to-matcha/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-4xl font-bold text-ink mb-6 lowercase">
                ready to start moving?
              </h2>
              <p className="text-xl text-gray-600 mb-8 lowercase">
                no phone calls, no discovery meetings, just fill out our project form and we&apos;ll
                get brewing.
              </p>
              <a
                href="/start"
                className="group inline-flex items-center bg-taro text-white px-8 py-4 rounded-xl font-semibold hover:bg-deep-taro transition-all duration-300 lowercase shadow-lg hover:shadow-2xl hover:shadow-taro/30 hover:scale-105"
              >
                start your project
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Sticky CTA */}
      <StickyCTA />
    </div>
  );
}
