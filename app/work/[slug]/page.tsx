import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getWorkBySlug, getAllWork } from '@/lib/mdx';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { Calendar, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface WorkPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const works = await getAllWork();
  return works.map((work) => ({
    slug: work.slug,
  }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const work = await getWorkBySlug(params.slug);

  if (!work) {
    return {
      title: 'Case Study Not Found',
    };
  }

  return {
    title: `${work.frontmatter.title} - Case Study`,
    description: work.frontmatter.summary,
    openGraph: {
      title: `${work.frontmatter.title} - Case Study`,
      description: work.frontmatter.summary,
      images: work.frontmatter.cover ? [work.frontmatter.cover] : [],
    },
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const work = await getWorkBySlug(params.slug);

  if (!work) {
    notFound();
  }

  const { frontmatter, content } = work;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 py-6">
          <Button asChild variant="ghost" className="group">
            <Link href="/work" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Work
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-6">
                {frontmatter.services?.map((service: string) => (
                  <span
                    key={service}
                    className="px-3 py-1 bg-taro/10 text-taro text-sm rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-4xl md:text-6xl font-bold text-ink mb-6">
                {frontmatter.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl">{frontmatter.summary}</p>

              <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(frontmatter.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                {frontmatter.website && (
                  <a
                    href={frontmatter.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-taro transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
              </div>

              {/* Highlights */}
              {frontmatter.highlights && (
                <div className="bg-gradient-to-br from-taro/5 to-deep-taro/10 rounded-xl p-8 mb-12">
                  <h3 className="font-display text-2xl font-bold text-ink mb-6 text-center">
                    What We Delivered
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {frontmatter.highlights.map((highlight: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-taro rounded-full flex items-center justify-center mt-0.5">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-700 font-medium">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Before/After Comparison */}
        {frontmatter.beforeImage && frontmatter.afterImage && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="font-display text-3xl font-bold text-center mb-8">before & after</h2>
                <BeforeAfterSlider
                  beforeImage={frontmatter.beforeImage}
                  afterImage={frontmatter.afterImage}
                  beforeLabel="before"
                  afterLabel="after"
                />
              </div>
            </div>
          </section>
        )}

        {/* Case Study Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-taro to-deep-taro">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="font-display text-4xl font-bold mb-6">ready for similar results?</h2>
              <p className="text-xl text-taro-100 mb-8">
                let&apos;s discuss how we can transform your digital presence with the same
                attention to detail and results-driven approach.
              </p>
              <Button asChild size="lg" className="bg-white text-taro hover:bg-milk-tea">
                <Link href="/contact">start your project</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
