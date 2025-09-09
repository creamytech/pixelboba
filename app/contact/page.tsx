import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import StickyCTA from '@/components/common/StickyCTA';

export const metadata: Metadata = {
  title: 'Contact Pixel Boba | Web Design Quote in 24 Hours | Fort Lauderdale',
  description:
    'get a custom website proposal within 24 hours. no calls required - just fill out our project form and we&apos;ll get brewing. based in fort lauderdale, florida.',
  openGraph: {
    title: 'Contact Pixel Boba | Web Design Quote in 24 Hours | Fort Lauderdale',
    description:
      'get a custom website proposal within 24 hours. no calls required - just fill out our project form and we&apos;ll get brewing. based in fort lauderdale, florida.',
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
    title: 'Contact Pixel Boba | Web Design Quote in 24 Hours | Fort Lauderdale',
    description:
      'get a custom website proposal within 24 hours. no calls required - just fill out our project form and we&apos;ll get brewing. based in fort lauderdale, florida.',
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
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-8 lowercase">
                ready to start?
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 lowercase max-w-3xl mx-auto px-4 leading-relaxed">
                ready to get started? use our project form to get a custom proposal within 24 hours.
              </p>

              {/* Primary CTA */}
              <div className="mb-12">
                <Link
                  href="/services#start"
                  className="inline-block bg-taro text-white px-10 py-5 rounded-xl font-semibold hover:bg-taro/90 transition-all duration-200 lowercase shadow-lg hover:shadow-xl text-xl hover:scale-105"
                >
                  get your custom proposal →
                </Link>
                <p className="text-gray-500 mt-4 lowercase font-medium">
                  ✨ response within 24 hours, no calls required
                </p>
              </div>

              {/* Secondary option */}
              <div className="max-w-md mx-auto bg-milk-tea/20 rounded-xl p-6">
                <p className="text-gray-600 mb-4 lowercase">
                  <strong>have questions first?</strong> email us and we&apos;ll respond quickly.
                </p>
                <a
                  href="mailto:hello@pixelboba.com"
                  className="text-taro hover:text-deep-taro transition-colors duration-200 font-medium text-lg"
                >
                  hello@pixelboba.com →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="pb-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-milk-tea/20 rounded-2xl p-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-6 lowercase">
                  have questions first?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-semibold text-ink mb-2 lowercase">email</h3>
                    <a
                      href="mailto:hello@pixelboba.com"
                      className="text-taro hover:text-deep-taro transition-colors duration-200 font-medium"
                    >
                      hello@pixelboba.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink mb-2 lowercase">response time</h3>
                    <p className="text-gray-600 lowercase">within 24 hours</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink mb-2 lowercase">project timeline</h3>
                    <p className="text-gray-600 lowercase">2-6 weeks typical</p>
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
                    className="bg-white rounded-xl p-8 shadow-sm border border-ink/10 hover:shadow-md transition-shadow duration-200"
                  >
                    <h3 className="font-display text-xl font-bold text-ink mb-4 lowercase">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 lowercase leading-relaxed">{faq.answer}</p>
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
                we&apos;re taking on select projects for early 2025.
              </p>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-8 max-w-md mx-auto">
                <p className="text-sm text-gray-600 lowercase">
                  🗓️ <strong>booking now:</strong> january & february 2025 spots
                </p>
              </div>
              <Link
                href="/services#start"
                className="inline-block bg-taro text-white px-8 py-4 rounded-xl font-semibold hover:bg-taro/90 transition-colors duration-200 lowercase shadow-lg"
              >
                secure your spot
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
