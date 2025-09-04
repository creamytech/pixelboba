import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'about us - the team behind the magic',
  description:
    'meet the creative minds behind pixel boba, passionate about crafting digital experiences that truly pop.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-6">
                about us
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                we&apos;re a passionate team of designers and developers who believe the best
                digital experiences combine beautiful design with flawless functionality.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                <div>
                  <h2 className="font-display text-4xl font-bold text-ink mb-6">our story</h2>
                  <p className="text-gray-600 mb-6">
                    pixel boba was born from a simple observation: most websites are either
                    beautiful but slow, or fast but boring. we set out to prove that you don&apos;t
                    have to choose.
                  </p>
                  <p className="text-gray-600 mb-6">
                    like the perfect boba tea, great websites need the right balance of ingredients.
                    beautiful design is the sweet tea base, smooth interactions are the creamy milk,
                    and delightful details are the chewy pearls that make the experience memorable.
                  </p>
                  <p className="text-gray-600">
                    today, we work with forward-thinking brands and businesses to create digital
                    experiences that don&apos;t just look amazing—they perform exceptionally and
                    drive real results.
                  </p>
                </div>

                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-taro to-deep-taro rounded-2xl p-8 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl font-bold mb-4">🧋</div>
                      <p className="text-lg">
                        crafting digital experiences
                        <br />
                        one pixel at a time
                      </p>
                    </div>
                  </div>

                  {/* Decorative pearls */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-matcha rounded-full" />
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-brown-sugar rounded-full opacity-80" />
                  <div className="absolute top-1/2 -right-8 w-6 h-6 bg-milk-tea rounded-full" />
                </div>
              </div>

              {/* Values Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                  <div className="w-16 h-16 bg-taro/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink mb-3">design first</h3>
                  <p className="text-gray-600">
                    every project starts with thoughtful design. we believe beautiful interfaces
                    create better user experiences and stronger emotional connections.
                  </p>
                </div>

                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                  <div className="w-16 h-16 bg-matcha/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink mb-3">
                    performance obsessed
                  </h3>
                  <p className="text-gray-600">
                    beautiful designs mean nothing if they don&apos;t load fast. we optimize every
                    pixel and line of code for maximum performance.
                  </p>
                </div>

                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                  <div className="w-16 h-16 bg-brown-sugar/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink mb-3">
                    partnership focused
                  </h3>
                  <p className="text-gray-600">
                    we&apos;re not just service providers—we&apos;re partners in your success. your
                    goals become our goals from day one.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-taro to-deep-taro">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="font-display text-4xl font-bold mb-6">
                let&apos;s create something amazing
              </h2>
              <p className="text-xl text-taro-100 mb-8">
                ready to see what happens when design meets performance? let&apos;s start a
                conversation about your project.
              </p>
              <a
                href="/contact"
                className="inline-block bg-white text-taro px-8 py-3 rounded-lg font-semibold hover:bg-milk-tea transition-colors duration-200"
              >
                get in touch
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
