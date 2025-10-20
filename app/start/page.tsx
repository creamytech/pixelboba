import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StartProjectForm from '@/components/form/StartProjectForm';

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
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-milk-tea via-background to-taro/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-ink mb-8 lowercase leading-tight">
                let&apos;s build something great
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed max-w-3xl mx-auto">
                Tell us about your project, and we&apos;ll send you a custom proposal within 24
                hours.
              </p>
              <p className="text-lg text-gray-600 lowercase mb-3">
                prefer to talk? give us a call:
              </p>
              <p className="text-2xl font-bold text-taro">
                <a href="tel:+17542434766" className="hover:text-deep-taro transition-colors">
                  (754) 243-4766
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Process Preview Cards */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="text-center p-6 bg-gradient-to-br from-taro/5 to-taro/10 rounded-xl">
                  <div className="w-12 h-12 bg-taro rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">1</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink mb-2 lowercase">
                    fill the form
                  </h3>
                  <p className="text-sm text-gray-600">Takes 5 minutes, tell us what you need</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-matcha/5 to-matcha/10 rounded-xl">
                  <div className="w-12 h-12 bg-matcha rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">2</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink mb-2 lowercase">
                    get proposal
                  </h3>
                  <p className="text-sm text-gray-600">
                    Custom quote in your inbox within 24 hours
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-milk-tea/20 to-milk-tea/40 rounded-xl">
                  <div className="w-12 h-12 bg-milk-tea rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">3</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink mb-2 lowercase">
                    start building
                  </h3>
                  <p className="text-sm text-gray-600">
                    Approve and we&apos;ll kick off your project
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-20 bg-gradient-to-b from-white to-milk-tea/10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <StartProjectForm />
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-16 bg-milk-tea/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-taro mb-2">24 Hours</div>
                  <p className="text-gray-600 lowercase">response time</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-taro mb-2">100%</div>
                  <p className="text-gray-600 lowercase">custom proposals</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-taro mb-2">0</div>
                  <p className="text-gray-600 lowercase">meetings needed</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
