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
      <Header>
        <div className="py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Back Navigation */}
            <Link
              href="/work"
              className="inline-flex items-center gap-2 mb-8 font-black text-ink hover:text-[#7C3AED] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              BACK TO WORK
            </Link>

            {/* Hero Section */}
            <div className="mb-12">
              {/* Service tags and title */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-6">
                  {frontmatter.services?.map((service: string) => (
                    <span
                      key={service}
                      className="px-4 py-2 bg-[#7C3AED]/10 text-[#7C3AED] text-sm font-black rounded-full border-2 border-[#7C3AED]/20 uppercase tracking-wide"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-ink mb-6 leading-tight">
                  {frontmatter.title}
                </h1>

                <p className="text-xl md:text-2xl text-ink/70 font-bold mb-8 leading-tight">
                  {frontmatter.summary}
                </p>

                <div className="flex flex-wrap gap-6 text-base font-bold text-ink/60 mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {new Date(frontmatter.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </div>
                  {frontmatter.website && (
                    <a
                      href={frontmatter.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#FDB97A] text-ink font-black rounded-full border-3 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                    >
                      <ExternalLink className="w-5 h-5" />
                      VISIT WEBSITE
                    </a>
                  )}
                </div>
              </div>

              {/* Large Screenshot with Pomegranate styling */}
              {frontmatter.cover && (
                <div className="relative mb-12 rounded-2xl sm:rounded-3xl overflow-hidden border-4 sm:border-[5px] border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] sm:shadow-[12px_12px_0px_0px_rgba(58,0,29,1)] md:shadow-[16px_16px_0px_0px_rgba(58,0,29,1)]">
                  <div className="aspect-[16/10] relative bg-cream">
                    <Image
                      src={frontmatter.cover}
                      alt={`${frontmatter.title} - Project Screenshot`}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                  </div>
                </div>
              )}

              {/* Highlights */}
              {frontmatter.highlights && (
                <div className="bg-white border-4 border-ink rounded-2xl sm:rounded-3xl shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] sm:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] p-8 sm:p-10 md:p-12">
                  <h3 className="text-3xl md:text-4xl font-black text-ink mb-8 text-center">
                    What We Delivered
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <div
                          key={index}
                          className="flex items-start gap-4 bg-cream rounded-xl p-4 border-2 border-ink/10"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-[#7C3AED] rounded-lg flex items-center justify-center mt-0.5 border-2 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <p className="text-ink font-bold text-lg leading-snug">{highlight}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Header>

      {/* Before/After Comparison */}
      {frontmatter.projectType === 'redesign' && (
        <section className="py-16 md:py-20 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-ink text-center mb-12">
              Before & <span className="italic text-[#7C3AED]">After</span>
            </h2>
            <div className="bg-white border-4 border-ink rounded-2xl sm:rounded-3xl shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] sm:shadow-[12px_12px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
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
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Content Blocks - Show different layouts based on project type */}
            {frontmatter.projectType === 'redesign' ? (
              // Redesign Layout - Focus on Before/After
              <div className="space-y-12">
                {/* Original Content */}
                <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-ink prose-p:text-ink/70 prose-p:font-bold prose-p:text-lg prose-p:leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              </div>
            ) : (
              // Custom Build Layout - Full content blocks
              <div className="space-y-8">
                {/* Challenge Block */}
                <div className="bg-white border-4 border-ink rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#EF4444] to-[#F97316] rounded-xl flex items-center justify-center border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]">
                      <svg
                        className="w-6 h-6 text-white"
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
                    <h3 className="text-3xl md:text-4xl font-black text-ink">Challenge</h3>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-ink/70 font-bold text-lg leading-relaxed">
                      The existing solution lacked modern design principles and failed to
                      effectively showcase the client&apos;s expertise, resulting in low engagement
                      and missed opportunities.
                    </p>
                  </div>
                </div>

                {/* Approach Block */}
                <div className="bg-white border-4 border-ink rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#6366F1] rounded-xl flex items-center justify-center border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]">
                      <svg
                        className="w-6 h-6 text-white"
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
                    <h3 className="text-3xl md:text-4xl font-black text-ink">Approach</h3>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-ink/70 font-bold text-lg leading-relaxed">
                      We conducted comprehensive user research, developed a design system focused on
                      accessibility and performance, and implemented modern development practices to
                      create a solution that exceeds industry standards.
                    </p>
                  </div>
                </div>

                {/* Solution Block */}
                <div className="bg-white border-4 border-ink rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]">
                      <svg
                        className="w-6 h-6 text-white"
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
                    <h3 className="text-3xl md:text-4xl font-black text-ink">Solution</h3>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-ink/70 font-bold text-lg leading-relaxed">
                      The final solution combines beautiful design with technical excellence,
                      featuring responsive layouts, optimized performance, and intuitive user
                      interactions that drive measurable business results.
                    </p>
                  </div>
                </div>

                {/* Results with Stats */}
                <div className="bg-white border-4 border-ink rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] rounded-xl flex items-center justify-center border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]">
                      <svg
                        className="w-6 h-6 text-white"
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
                    <h3 className="text-3xl md:text-4xl font-black text-ink">Results</h3>
                  </div>

                  <div className="prose prose-lg max-w-none">
                    <p className="text-ink/70 font-bold text-lg leading-relaxed">
                      The new website delivers exceptional performance, significantly improving user
                      experience and driving business growth.
                    </p>
                  </div>
                </div>

                {/* Original Content */}
                <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-ink prose-p:text-ink/70 prose-p:font-bold prose-p:text-lg prose-p:leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-3xl mx-auto relative">
            {/* Cat peeking over */}
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
                Ready for <span className="italic text-[#7C3AED]">Similar Results?</span>
              </h2>
              <p className="text-2xl text-ink/70 font-bold mb-8">
                Let&apos;s discuss how we can transform your digital presence with the same
                attention to detail.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                <Link
                  href="/start"
                  className="inline-flex items-center px-10 py-5 bg-[#FDB97A] text-ink text-xl font-black rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  START YOUR PROJECT →
                </Link>

                <Link
                  href="/work"
                  className="inline-flex items-center px-10 py-5 bg-white text-ink text-xl font-black rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  VIEW MORE WORK
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-8 text-base font-bold text-ink/60 border-t-3 border-ink/10 pt-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>2-6 Week Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span>100 Lighthouse Scores</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Lifetime Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTA />
    </div>
  );
}
