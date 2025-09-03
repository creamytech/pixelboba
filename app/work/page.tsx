import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllWork } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Our Work - Creative Digital Experiences',
  description:
    'Browse our portfolio of beautiful, high-performance websites and digital experiences.',
};

export default async function WorkPage() {
  const works = await getAllWork();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-6">
                Our Work
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                A collection of beautiful, functional websites that demonstrate our commitment to
                exceptional design and smooth user experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Work Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {works.map((work) => (
                <div
                  key={work.slug}
                  className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-video bg-gradient-to-br from-taro to-deep-taro p-8 flex items-center justify-center">
                    <div className="text-white text-center">
                      <h3 className="font-display text-2xl font-bold mb-2">
                        {work.frontmatter.title}
                      </h3>
                      <p className="text-taro-100">{work.frontmatter.summary}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {work.frontmatter.services?.map((service: string) => (
                        <span
                          key={service}
                          className="px-3 py-1 bg-milk-tea text-brown-sugar text-sm rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600">{work.frontmatter.summary}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Placeholder message if no work items */}
            {works.length === 0 && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-taro/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-6 h-6 bg-taro rounded-full animate-bounce-subtle" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink mb-2">
                    Portfolio Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    We&apos;re putting the finishing touches on our case studies. Check back soon to
                    see our latest work!
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
