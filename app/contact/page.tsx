import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import StickyCTA from '@/components/common/StickyCTA';

export const metadata: Metadata = {
  title: 'Contact | Web Design Quote in 24 Hours | Fort Lauderdale',
  description:
    'Get a custom Fort Lauderdale web design proposal within 24 hours. No calls required - just fill out our project form and we&apos;ll get brewing. Professional website design quotes.',
  openGraph: {
    title: 'Contact | Web Design Quote in 24 Hours | Fort Lauderdale',
    description:
      'Get a custom Fort Lauderdale web design proposal within 24 hours. No calls required - just fill out our project form and we&apos;ll get brewing. Professional website design quotes.',
    url: 'https://pixelboba.com/contact',
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
    title: 'Contact | Web Design Quote in 24 Hours | Fort Lauderdale',
    description:
      'Get a custom Fort Lauderdale web design proposal within 24 hours. No calls required - just fill out our project form and we&apos;ll get brewing. Professional website design quotes.',
    images: ['https://pixelboba.com/Pixel_Boba_Icon_PNG.png'],
  },
  alternates: {
    canonical: 'https://pixelboba.com/contact',
  },
};

const faqs = [
  {
    question: 'what information do you need to get started?',
    answer:
      'just fill out our project form with your goals, timeline, and any examples you like. we handle the rest through email.',
  },
  {
    question: 'can you work with our existing branding?',
    answer:
      "absolutely! send us your brand guidelines, logos, and color schemes. we'll make sure everything stays on-brand.",
  },
  {
    question: 'do you offer payment plans?',
    answer:
      'yes, we typically split projects into 2-3 payments: deposit, midpoint, and final. larger projects can be broken down further.',
  },
  {
    question: 'how long does a typical project take?',
    answer:
      '2-6 weeks depending on scope. website redesigns take 1-3 weeks, custom builds take 3-5 weeks, advanced builds take 4-6 weeks.',
  },
  {
    question: "what if we're not happy with the design?",
    answer:
      'we share working previews throughout the process so there are no surprises. most issues get resolved during our regular check-ins via email.',
  },
  {
    question: 'what if I need changes during the project?',
    answer:
      "we share working code previews as we build, so you can see exactly what you're getting. changes happen via email feedback.",
  },
  {
    question: 'do you work with wordpress or shopify?',
    answer:
      'we build custom sites with next.js and react for better performance. we can integrate with headless cms or ecommerce apis if needed.',
  },
  {
    question: 'what about ongoing maintenance?',
    answer:
      'our care plans start at $99/month for content updates, security patches, and bug fixes. no long-term contracts required.',
  },
  {
    question: 'can you help with seo?',
    answer:
      'every site includes basic seo optimization. our advanced seo package starts at $750 for keyword research and content strategy.',
  },
  {
    question: 'how do you handle rush projects?',
    answer:
      'we can expedite projects with our priority timeline - typically 50% faster delivery for an additional 25% fee. just mention your deadline in the project form.',
  },
  {
    question: 'do you work with wix, squarespace, or wordpress?',
    answer:
      'we specialize in custom next.js builds for better performance and flexibility. we can integrate with headless cms or migrate from existing platforms.',
  },
];

export default function ContactPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Get current and next month
  const now = new Date();
  const currentMonth = now.toLocaleDateString('en-US', { month: 'long' });
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleDateString('en-US', {
    month: 'long',
  });
  const year = now.getFullYear();

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-milk-tea via-background to-taro/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-ink mb-8 lowercase leading-tight">
                ready to start?
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-12 lowercase max-w-3xl mx-auto px-4 leading-relaxed">
                ready to get started? use our project form to get a custom proposal within 24 hours.
              </p>

              {/* Primary CTA */}
              <div className="mb-12">
                <Link
                  href="/services#start"
                  className="group inline-flex items-center bg-taro text-white px-10 py-5 rounded-xl font-semibold hover:bg-deep-taro transition-all duration-300 lowercase shadow-lg hover:shadow-2xl hover:shadow-taro/30 text-xl hover:scale-105"
                >
                  get your custom proposal
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <p className="text-gray-600 mt-4 lowercase font-medium text-lg">
                  ✨ response within 24 hours, no calls required
                </p>
              </div>

              {/* Secondary option */}
              <div className="max-w-md mx-auto bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-taro/20 shadow-md">
                <p className="text-gray-700 mb-4 lowercase font-medium text-lg">
                  <strong className="text-ink">have questions first?</strong> email us and
                  we&apos;ll respond quickly.
                </p>
                <a
                  href="mailto:hello@pixelboba.com"
                  className="group inline-flex items-center text-taro hover:text-deep-taro transition-all duration-200 font-semibold text-lg px-4 py-2 rounded-lg hover:bg-taro/10"
                >
                  hello@pixelboba.com
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="pb-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-br from-milk-tea/30 to-taro/10 rounded-2xl p-10 border border-taro/20 shadow-md">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-8 lowercase">
                  quick info
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="group">
                    <h3 className="font-bold text-ink mb-3 lowercase text-lg">email</h3>
                    <a
                      href="mailto:hello@pixelboba.com"
                      className="text-taro hover:text-deep-taro transition-colors duration-200 font-semibold group-hover:scale-105 inline-block"
                    >
                      hello@pixelboba.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-bold text-ink mb-3 lowercase text-lg">response time</h3>
                    <p className="text-gray-700 lowercase font-medium">within 24 hours</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-ink mb-3 lowercase text-lg">project timeline</h3>
                    <p className="text-gray-700 lowercase font-medium">2-6 weeks typical</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-4xl font-bold text-ink mb-12 text-center lowercase">
                frequently asked questions
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl p-8 shadow-md border border-ink/10 hover:shadow-xl hover:shadow-taro/10 hover:border-taro/30 transition-all duration-300"
                  >
                    <h3 className="font-display text-xl md:text-2xl font-bold text-ink mb-4 lowercase group-hover:text-taro transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 lowercase leading-relaxed text-lg">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 bg-gradient-to-r from-taro/10 to-matcha/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-4xl font-bold text-ink mb-6 lowercase">
                let&apos;s make something amazing
              </h2>
              <p className="text-xl text-gray-600 mb-6 lowercase">
                we&apos;re taking on select projects for {year}.
              </p>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-8 max-w-md mx-auto">
                <p className="text-sm text-gray-600 lowercase">
                  🗓️ <strong>booking now:</strong> {currentMonth.toLowerCase()} &{' '}
                  {nextMonth.toLowerCase()} {year} spots
                </p>
              </div>
              <Link
                href="/services#start"
                className="group inline-flex items-center bg-taro text-white px-8 py-4 rounded-xl font-semibold hover:bg-deep-taro transition-all duration-300 lowercase shadow-lg hover:shadow-2xl hover:shadow-taro/30 hover:scale-105"
              >
                secure your spot
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
