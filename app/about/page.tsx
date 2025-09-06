import { Metadata } from 'next';
import Image from 'next/image';
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

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-display text-4xl font-bold text-ink mb-16 text-center lowercase">
                meet the tea makers
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Scott Benjamin - Founder */}
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="w-48 h-48 mx-auto rounded-full overflow-hidden relative">
                      <Image
                        src="/Scott.jpg"
                        alt="Scott Benjamin - Founder"
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                      {/* Boba pearl decorations */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-taro rounded-full shadow-lg"></div>
                      <div className="absolute -bottom-1 -left-3 w-4 h-4 bg-matcha rounded-full shadow-lg"></div>
                      <div className="absolute top-1/4 -right-4 w-3 h-3 bg-milk-tea rounded-full shadow-lg"></div>
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-ink mb-2 lowercase">
                    scott benjamin
                  </h3>
                  <p className="text-taro font-semibold mb-4 lowercase">founder & developer</p>
                  <p className="text-gray-600 text-sm mb-4 lowercase">fort lauderdale, fl</p>

                  <div className="bg-gradient-to-br from-taro/5 to-matcha/5 rounded-xl p-6 text-left">
                    <p className="text-gray-600 mb-4 lowercase">
                      scott&apos;s been brewing websites since he was 8 years old — that&apos;s 19
                      years of perfecting the perfect digital blend. when he&apos;s not crafting
                      custom sites, you&apos;ll find him diving deep into data and analytics for his
                      day job.
                    </p>
                    <p className="text-gray-600 lowercase">
                      his love for technology runs deeper than a perfectly steeped tea, and he
                      believes every website should be as satisfying as that first sip of your
                      favorite boba.
                    </p>
                  </div>
                </div>

                {/* Joel Armenta - Artist */}
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="w-48 h-48 mx-auto rounded-full overflow-hidden relative">
                      <Image
                        src="/Jojo.jpg"
                        alt="Joel Armenta - In House Artist"
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                      {/* Boba pearl decorations */}
                      <div className="absolute -top-3 -left-2 w-5 h-5 bg-matcha rounded-full shadow-lg"></div>
                      <div className="absolute -bottom-2 -right-3 w-4 h-4 bg-taro rounded-full shadow-lg"></div>
                      <div className="absolute top-1/3 -left-4 w-3 h-3 bg-milk-tea/80 rounded-full shadow-lg"></div>
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-ink mb-2 lowercase">
                    joel armenta
                  </h3>
                  <p className="text-taro font-semibold mb-4 lowercase">in house artist</p>
                  <p className="text-gray-600 text-sm mb-4 lowercase">ciudad obregón, mexico</p>

                  <div className="bg-gradient-to-br from-matcha/5 to-taro/5 rounded-xl p-6 text-left">
                    <p className="text-gray-600 mb-4 lowercase">
                      joel brings the visual magic that makes each pixel boba project pop. his
                      design eye transforms ideas into stunning visual experiences that users
                      can&apos;t help but love.
                    </p>
                    <p className="text-gray-600 mb-4 lowercase">
                      from concept to final design, joel crafts every visual element with the same
                      care a barista puts into the perfect boba tea blend.
                    </p>
                    <a
                      href="https://www.behance.net/jojopdesign"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-taro text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-taro/90 transition-colors duration-200 lowercase"
                    >
                      view portfolio on behance →
                    </a>
                  </div>
                </div>
              </div>

              {/* Fun Team Stats */}
              <div className="mt-16 bg-gradient-to-r from-taro/10 to-matcha/10 rounded-2xl p-8">
                <h3 className="font-display text-2xl font-bold text-ink mb-8 text-center lowercase">
                  our boba-powered stats
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-taro mb-1">🧋</div>
                    <div className="text-lg font-semibold text-ink">∞</div>
                    <p className="text-gray-600 text-sm lowercase">cups of boba consumed</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-matcha mb-1">🌍</div>
                    <div className="text-lg font-semibold text-ink">2</div>
                    <p className="text-gray-600 text-sm lowercase">countries, one team</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-taro mb-1">💻</div>
                    <div className="text-lg font-semibold text-ink">19</div>
                    <p className="text-gray-600 text-sm lowercase">years coding experience</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-matcha mb-1">🎨</div>
                    <div className="text-lg font-semibold text-ink">∞</div>
                    <p className="text-gray-600 text-sm lowercase">creative possibilities</p>
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
