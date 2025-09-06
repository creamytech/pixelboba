import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'pixel boba — about us',
  description:
    'custom websites built with code-first quality. performance and accessibility built in from day one.',
  openGraph: {
    title: 'pixel boba — about us',
    description:
      'custom websites built with code-first quality. performance and accessibility built in from day one.',
    url: 'https://pixelboba.com/about',
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
    title: 'pixel boba — about us',
    description:
      'custom websites built with code-first quality. performance and accessibility built in from day one.',
    images: ['https://pixelboba.com/og-image.png'],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-8 lowercase">
                who we are
              </h1>
              <p className="text-xl text-gray-600 mb-8 lowercase max-w-3xl mx-auto">
                we build custom websites with modern tools and test everything. performance and
                accessibility come standard, not as extras.
              </p>
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                <div>
                  <h2 className="font-display text-4xl font-bold text-ink mb-8 lowercase">
                    our approach
                  </h2>
                  <div className="space-y-6">
                    <p className="text-gray-600 lowercase">
                      great websites should load fast, look sharp, and work for everyone.
                      that&apos;s why we build with next.js and typescript instead of page builders.
                    </p>
                    <p className="text-gray-600 lowercase">
                      you get working code previews from day one. no endless mockup rounds or
                      surprises at launch.
                    </p>
                    <p className="text-gray-600 lowercase">
                      every project meets lighthouse performance standards and basic accessibility
                      requirements. your users notice the difference.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-taro to-taro/80 rounded-2xl p-8 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl font-bold mb-4">🧋</div>
                      <p className="text-lg lowercase">
                        code first,
                        <br />
                        performance built in
                      </p>
                    </div>
                  </div>

                  {/* Pearl accents */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-matcha rounded-full" />
                  <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-taro/60 rounded-full" />
                  <div className="absolute top-1/2 -right-8 w-4 h-4 bg-matcha/60 rounded-full" />
                </div>
              </div>

              {/* What Makes Us Different */}
              <div className="mb-20">
                <h2 className="font-display text-4xl font-bold text-ink mb-12 text-center lowercase">
                  what makes us different
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-ink/10 relative">
                    <div className="absolute top-4 right-6 w-3 h-3 bg-taro/20 rounded-full"></div>
                    <h3 className="font-display text-xl font-bold text-ink mb-4 lowercase">
                      working previews from day one
                    </h3>
                    <p className="text-gray-600 lowercase">
                      see your actual website as we build it. no wireframes or mockups that look
                      nothing like the final result.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-8 shadow-sm border border-ink/10 relative">
                    <div className="absolute top-4 right-6 w-3 h-3 bg-matcha/20 rounded-full"></div>
                    <h3 className="font-display text-xl font-bold text-ink mb-4 lowercase">
                      no endless design rounds
                    </h3>
                    <p className="text-gray-600 lowercase">
                      clear code previews mean fewer surprises. you know what you&apos;re getting
                      before we call it done.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-8 shadow-sm border border-ink/10 relative">
                    <div className="absolute top-4 right-6 w-3 h-3 bg-taro/30 rounded-full"></div>
                    <h3 className="font-display text-xl font-bold text-ink mb-4 lowercase">
                      async communication that works
                    </h3>
                    <p className="text-gray-600 lowercase">
                      no meetings or calls required. updates happen via email and preview links that
                      respect your schedule.
                    </p>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-milk-tea/20 rounded-2xl p-12 text-center">
                <h2 className="font-display text-3xl font-bold text-ink mb-8 lowercase">
                  what you can expect
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <div className="text-3xl font-bold text-taro mb-2">90+</div>
                    <p className="text-gray-600 lowercase">lighthouse performance score</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-taro mb-2">100%</div>
                    <p className="text-gray-600 lowercase">mobile responsive</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-taro mb-2">24hr</div>
                    <p className="text-gray-600 lowercase">response time</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-taro mb-2">0</div>
                    <p className="text-gray-600 lowercase">required phone calls</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-taro/10 to-matcha/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-4xl font-bold text-ink mb-6 lowercase">
                ready to start building?
              </h2>
              <p className="text-xl text-gray-600 mb-8 lowercase">
                tell us what you need and get a custom proposal by email. no calls, no pressure.
              </p>
              <a
                href="/services#start"
                className="inline-block bg-taro text-white px-8 py-4 rounded-xl font-semibold hover:bg-taro/90 transition-colors duration-200 lowercase shadow-lg"
              >
                start your project
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
