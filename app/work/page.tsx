import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllWork } from '@/lib/mdx';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Web Design Portfolio | Real Client Results | Pixel Boba',
  description:
    'browse our portfolio of beautiful, high-performance websites and digital experiences. see real client case studies and results from our web design projects.',
  openGraph: {
    title: 'Web Design Portfolio | Real Client Results | Pixel Boba',
    description:
      'browse our portfolio of beautiful, high-performance websites and digital experiences. see real client case studies and results from our web design projects.',
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
    title: 'Web Design Portfolio | Real Client Results | Pixel Boba',
    description:
      'browse our portfolio of beautiful, high-performance websites and digital experiences. see real client case studies and results from our web design projects.',
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
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-6">
                our work
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                a collection of beautiful, functional websites that demonstrate our commitment to
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
                <Link
                  key={work.slug}
                  href={`/work/${work.slug}`}
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 min-h-[400px] flex flex-col"
                >
                  {/* Project Thumbnail */}
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-taro/10 to-deep-taro/20">
                    {work.frontmatter.cover ? (
                      <div className="relative h-full">
                        <Image
                          src={work.frontmatter.cover}
                          alt={work.frontmatter.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Overlay with project info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-4 left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                          <div className="flex items-center gap-2 text-sm">
                            {work.frontmatter.website && <ExternalLink className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full bg-gradient-to-br from-taro to-deep-taro p-8 flex items-center justify-center">
                        <div className="text-white text-center">
                          <h3 className="font-display text-2xl font-bold mb-2 opacity-80">
                            {work.frontmatter.title}
                          </h3>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {work.frontmatter.services?.slice(0, 2).map((service: string) => (
                        <span
                          key={service}
                          className="px-3 py-1 bg-gradient-to-r from-taro/10 to-matcha/10 text-taro text-xs font-medium rounded-full border border-taro/20 transition-colors group-hover:border-taro/40"
                        >
                          {service}
                        </span>
                      ))}
                      {work.frontmatter.services && work.frontmatter.services.length > 2 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                          +{work.frontmatter.services.length - 2} more
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-xl font-bold text-ink mb-2 group-hover:text-taro transition-colors">
                      {work.frontmatter.title}
                    </h3>

                    <p className="text-gray-600 mb-4 flex-1 line-clamp-2">
                      {work.frontmatter.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Placeholder message if no work items */}
            {works.length === 0 && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-taro/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-6 h-6 bg-taro rounded-full animate-bounce" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink mb-2">
                    portfolio coming soon
                  </h3>
                  <p className="text-gray-600">
                    we&apos;re putting the finishing touches on our case studies. check back soon to
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
