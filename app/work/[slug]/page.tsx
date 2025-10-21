import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getWorkBySlug, getAllWork } from '@/lib/mdx';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import BeforeAfterSlideshow from '@/components/BeforeAfterSlideshow';
import {
  Calendar,
  ExternalLink,
  ArrowLeft,
  Smartphone,
  Monitor,
  Palette,
  Code,
  Shield,
  Zap,
  Search,
  Globe,
  Camera,
  Users,
} from 'lucide-react';
import StickyCTA from '@/components/common/StickyCTA';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface WorkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const works = await getAllWork();
  return works.map((work) => ({
    slug: work.slug,
  }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work) {
    return {
      title: 'Case Study Not Found',
    };
  }

  return {
    title: `${work.frontmatter.title} Case Study | Web Design Portfolio`,
    description: `${work.frontmatter.summary} see how pixel boba transformed this client's online presence with custom web design and development.`,
    openGraph: {
      title: `${work.frontmatter.title} Case Study | Web Design Portfolio`,
      description: `${work.frontmatter.summary} see how pixel boba transformed this client's online presence with custom web design and development.`,
      url: `https://pixelboba.com/work/${slug}`,
      siteName: 'pixel boba',
      images: work.frontmatter.cover
        ? [
            {
              url: work.frontmatter.cover,
              width: 1200,
              height: 630,
              alt: `${work.frontmatter.title} project screenshot`,
            },
          ]
        : [],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${work.frontmatter.title} Case Study | Web Design Portfolio`,
      description: `${work.frontmatter.summary} see how pixel boba transformed this client's online presence with custom web design and development.`,
      images: work.frontmatter.cover ? [work.frontmatter.cover] : [],
    },
    alternates: {
      canonical: `https://pixelboba.com/work/${slug}`,
    },
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  const { frontmatter, content } = work;

  // Structured data for the portfolio piece
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: frontmatter.title,
    description: frontmatter.summary,
    url: `https://pixelboba.com/work/${slug}`,
    image: frontmatter.cover || 'https://pixelboba.com/Pixel_Boba_Icon_PNG.png',
    datePublished: frontmatter.publishedAt,
    creator: {
      '@type': 'Organization',
      name: 'Pixel Boba',
      url: 'https://pixelboba.com',
    },
    provider: {
      '@type': 'Organization',
      name: 'Pixel Boba',
      url: 'https://pixelboba.com',
    },
    genre: 'Web Design',
    keywords: frontmatter.services?.join(', ') || 'web design, web development',
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Header />
      <main className="pt-20">
        {/* Breadcrumb Navigation */}
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: 'home', href: '/' },
              { label: 'portfolio', href: '/work' },
              { label: frontmatter.title.toLowerCase(), href: `/work/${slug}` },
            ]}
          />
        </div>

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
            <div className="max-w-6xl mx-auto">
              {/* Large Screenshot Hero */}
              {frontmatter.cover && (
                <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-[16/10] relative">
                    <Image
                      src={frontmatter.cover}
                      alt={`${frontmatter.title} - Project Screenshot`}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                    {/* Browser Frame Overlay */}
                    <div className="absolute top-0 left-0 right-0 bg-gray-200 h-8 flex items-center px-4 gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-600 max-w-xs truncate">
                          {frontmatter.website ||
                            `${frontmatter.title.toLowerCase().replace(/\s+/g, '-')}.com`}
                        </div>
                      </div>
                    </div>

                    {/* Overlay with project title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 text-white">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {frontmatter.services?.map((service: string) => (
                          <span
                            key={service}
                            className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full border border-white/30"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                      <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                        {frontmatter.title}
                      </h1>
                    </div>
                  </div>
                </div>
              )}

              {/* Content without cover image fallback */}
              {!frontmatter.cover && (
                <>
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
                </>
              )}

              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-gray-600 mb-8">{frontmatter.summary}</p>

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
              </div>

              {/* Highlights */}
              {frontmatter.highlights && (
                <div className="bg-gradient-to-br from-taro/5 to-deep-taro/10 rounded-xl p-8 mb-12">
                  <h3 className="font-display text-2xl font-bold text-ink mb-6 text-center">
                    What We Delivered
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {frontmatter.highlights.map((highlight: string, index: number) => {
                      // Map highlights to appropriate icons
                      const getIcon = (text: string) => {
                        const lowerText = text.toLowerCase();
                        if (lowerText.includes('mobile') || lowerText.includes('responsive'))
                          return Smartphone;
                        if (lowerText.includes('design') || lowerText.includes('visual'))
                          return Palette;
                        if (
                          lowerText.includes('performance') ||
                          lowerText.includes('speed') ||
                          lowerText.includes('lighthouse')
                        )
                          return Zap;
                        if (lowerText.includes('seo') || lowerText.includes('search'))
                          return Search;
                        if (
                          lowerText.includes('security') ||
                          lowerText.includes('certified') ||
                          lowerText.includes('compliance')
                        )
                          return Shield;
                        if (
                          lowerText.includes('development') ||
                          lowerText.includes('coding') ||
                          lowerText.includes('technical')
                        )
                          return Code;
                        if (
                          lowerText.includes('website') ||
                          lowerText.includes('site') ||
                          lowerText.includes('web')
                        )
                          return Globe;
                        if (
                          lowerText.includes('photography') ||
                          lowerText.includes('image') ||
                          lowerText.includes('gallery')
                        )
                          return Camera;
                        if (
                          lowerText.includes('user') ||
                          lowerText.includes('experience') ||
                          lowerText.includes('navigation')
                        )
                          return Users;
                        return Monitor; // Default icon
                      };

                      const IconComponent = getIcon(highlight);

                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-taro to-deep-taro rounded-lg flex items-center justify-center mt-0.5 shadow-sm">
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-gray-700 font-medium">{highlight}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Before/After Comparison */}
        {frontmatter.projectType === 'redesign' && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="font-display text-3xl font-bold text-center mb-8">before & after</h2>
                {frontmatter.beforeImages && frontmatter.afterImages ? (
                  <BeforeAfterSlideshow
                    beforeImages={frontmatter.beforeImages}
                    afterImages={frontmatter.afterImages}
                    beforeLabel="before"
                    afterLabel="after"
                  />
                ) : frontmatter.beforeImage && frontmatter.afterImage ? (
                  <BeforeAfterSlider
                    beforeImage={frontmatter.beforeImage}
                    afterImage={frontmatter.afterImage}
                    beforeLabel="before"
                    afterLabel="after"
                  />
                ) : null}
              </div>
            </div>
          </section>
        )}

        {/* Case Study Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Content Blocks - Show different layouts based on project type */}
              {frontmatter.projectType === 'redesign' ? (
                // Redesign Layout - Focus on Before/After
                <div className="space-y-12">
                  {/* Original Content */}
                  <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  </div>
                </div>
              ) : (
                // Custom Build Layout - Full content blocks
                <div className="space-y-16">
                  {/* Challenge Block */}
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-display text-2xl font-bold text-gray-900">Challenge</h3>
                    </div>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        The existing solution lacked modern design principles and failed to
                        effectively showcase the client&apos;s expertise, resulting in low
                        engagement and missed opportunities.
                      </p>
                    </div>
                  </div>

                  {/* Approach Block */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-display text-2xl font-bold text-gray-900">Approach</h3>
                    </div>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        We conducted comprehensive user research, developed a design system focused
                        on accessibility and performance, and implemented modern development
                        practices to create a solution that exceeds industry standards.
                      </p>
                    </div>
                  </div>

                  {/* Solution Block */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-display text-2xl font-bold text-gray-900">Solution</h3>
                    </div>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        The final solution combines beautiful design with technical excellence,
                        featuring responsive layouts, optimized performance, and intuitive user
                        interactions that drive measurable business results.
                      </p>
                    </div>
                  </div>

                  {/* Results with Stats */}
                  <div className="bg-gradient-to-br from-taro/5 to-deep-taro/10 rounded-2xl p-8 border border-taro/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-taro to-deep-taro rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-display text-2xl font-bold text-gray-900">Results</h3>
                    </div>

                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        The new website delivers exceptional performance, significantly improving
                        user experience and driving business growth.
                      </p>
                    </div>
                  </div>

                  {/* Original Content */}
                  <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-taro to-deep-taro relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-sm"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full blur-sm"></div>
            <div className="absolute bottom-20 left-32 w-12 h-12 bg-white rounded-full blur-sm"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full blur-sm"></div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="font-display text-4xl font-bold mb-6">Ready for Similar Results?</h2>
              <p className="text-xl text-taro-100 mb-8">
                Let&apos;s discuss how we can transform your digital presence with the same
                attention to detail and results-driven approach.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-taro hover:bg-milk-tea shadow-lg hover:shadow-xl transition-all"
                >
                  <Link href="/start">Start Your Project</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-taro"
                >
                  <Link href="/work">View More Work</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-taro-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>2-4 week delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>100 Lighthouse scores</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Lifetime support</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
