import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import StickyCTA from '@/components/common/StickyCTA';

export const metadata: Metadata = {
  title: 'Contact | Web Design Quote in 24 Hours | Fort Lauderdale',
  description:
    'Get a custom Fort Lauderdale web design proposal within 24 hours. Call (754) 243-4766 or fill out our project form. Professional website design quotes.',
  openGraph: {
    title: 'Contact | Web Design Quote in 24 Hours | Fort Lauderdale',
    description:
      'Get a custom Fort Lauderdale web design proposal within 24 hours. Call (754) 243-4766 or fill out our project form. Professional website design quotes.',
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
      'Get a custom Fort Lauderdale web design proposal within 24 hours. Call (754) 243-4766 or fill out our project form. Professional website design quotes.',
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
      'Just fill out our project form with your goals, timeline, and any examples you like. You can also give us a call at (754) 243-4766.',
  },
  {
    question: 'can you work with our existing branding?',
    answer:
      "Absolutely! Send us your brand guidelines, logos, and color schemes. We'll make sure everything stays on-brand.",
  },
  {
    question: 'do you offer payment plans?',
    answer:
      'Yes, we typically split projects into 2-3 payments: deposit, midpoint, and final. Larger projects can be broken down further.',
  },
  {
    question: 'how long does a typical project take?',
    answer:
      '2-6 weeks depending on scope. Website redesigns take 1-3 weeks, custom builds take 3-5 weeks, advanced builds take 4-6 weeks.',
  },
  {
    question: "what if we're not happy with the design?",
    answer:
      'We share working previews throughout the process so there are no surprises. Most issues get resolved during our regular check-ins.',
  },
  {
    question: 'what if I need changes during the project?',
    answer:
      "We share working code previews as we build, so you can see exactly what you're getting. Send us your feedback and we'll make it happen.",
  },
  {
    question: 'do you work with wordpress or shopify?',
    answer:
      'We build custom sites with Next.js and React for better performance. We can integrate with headless CMS or ecommerce APIs if needed.',
  },
  {
    question: 'what about ongoing maintenance?',
    answer:
      'Our care plans start at $99/month for content updates, security patches, and bug fixes. No long-term contracts required.',
  },
  {
    question: 'can you help with seo?',
    answer:
      'Every site includes basic SEO optimization. Our advanced SEO package starts at $750 for keyword research and content strategy.',
  },
  {
    question: 'how do you handle rush projects?',
    answer:
      'We can expedite projects with our priority timeline - typically 50% faster delivery for an additional 25% fee. Just mention your deadline in the project form.',
  },
  {
    question: 'do you work with wix, squarespace, or wordpress?',
    answer:
      'We specialize in custom Next.js builds for better performance and flexibility. We can integrate with headless CMS or migrate from existing platforms.',
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
                let&apos;s brew something together
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 lowercase max-w-3xl mx-auto px-4 leading-relaxed">
                tell us about your project. we&apos;ll send you a custom proposal within 24 hours.
              </p>

              {/* Phone Number */}
              <div className="flex items-center justify-center gap-3 mb-12">
                <span className="text-2xl font-semibold text-taro lowercase">call us:</span>
                <a
                  href="tel:+17542434766"
                  className="text-3xl font-bold text-ink hover:text-taro transition-colors duration-300"
                >
                  (754) 243-4766
                </a>
              </div>

              {/* Primary CTA */}
              <div className="mb-12">
                <Link
                  href="/start"
                  className="group inline-flex items-center bg-taro text-white px-10 py-5 rounded-xl font-semibold hover:bg-deep-taro transition-all duration-300 lowercase shadow-lg hover:shadow-2xl hover:shadow-taro/30 text-xl hover:scale-105"
                >
                  get your custom proposal
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <p className="text-gray-600 mt-4 lowercase font-medium text-lg">
                  ✨ response within 24 hours
                </p>
              </div>

              {/* Secondary option */}
              <div className="max-w-md mx-auto bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-taro/20 shadow-md">
                <p className="text-gray-700 mb-4 lowercase font-medium text-lg">
                  <strong className="text-ink">just browsing?</strong> shoot us an email. we love
                  talking shop (and boba).
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="group">
                    <h3 className="font-bold text-ink mb-3 lowercase text-lg">phone</h3>
                    <a
                      href="tel:+17542434766"
                      className="text-taro hover:text-deep-taro transition-colors duration-200 font-semibold group-hover:scale-105 inline-block"
                    >
                      (754) 243-4766
                    </a>
                  </div>
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
                brewing up fresh websites for {year}. your order&apos;s up next.
              </p>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-8 max-w-md mx-auto">
                <p className="text-sm text-gray-600 lowercase">
                  🗓️ <strong>taking orders for:</strong> {currentMonth.toLowerCase()} &{' '}
                  {nextMonth.toLowerCase()} {year}
                </p>
              </div>
              <Link
                href="/start"
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
