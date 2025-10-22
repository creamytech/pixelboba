import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import StickyCTA from '@/components/common/StickyCTA';
import Image from 'next/image';
import { Icon } from '@iconify/react';

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
    question: 'What information do you need to get started?',
    answer:
      'Just fill out our project form with your goals, timeline, and any examples you like. You can also give us a call at (754) 243-4766.',
  },
  {
    question: 'Can you work with our existing branding?',
    answer:
      "Absolutely! Send us your brand guidelines, logos, and color schemes. We'll make sure everything stays on-brand.",
  },
  {
    question: 'Do you offer payment plans?',
    answer:
      'Yes, we typically split projects into 2-3 payments: deposit, midpoint, and final. Larger projects can be broken down further.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      '2-6 weeks depending on scope. Website redesigns take 1-3 weeks, custom builds take 3-5 weeks, advanced builds take 4-6 weeks.',
  },
  {
    question: "What if we're not happy with the design?",
    answer:
      'We share working previews throughout the process so there are no surprises. Most issues get resolved during our regular check-ins.',
  },
  {
    question: 'What if I need changes during the project?',
    answer:
      "We share working code previews as we build, so you can see exactly what you're getting. Send us your feedback and we'll make it happen.",
  },
  {
    question: 'Do you work with WordPress or Shopify?',
    answer:
      'We build custom sites with Next.js and React for better performance. We can integrate with headless CMS or ecommerce APIs if needed.',
  },
  {
    question: 'What about ongoing maintenance?',
    answer:
      'Our care plans start at $99/month for content updates, security patches, and bug fixes. No long-term contracts required.',
  },
  {
    question: 'Can you help with SEO?',
    answer:
      'Every site includes basic SEO optimization. Our advanced SEO package starts at $750 for keyword research and content strategy.',
  },
  {
    question: 'How do you handle rush projects?',
    answer:
      'We can expedite projects with our priority timeline—typically 50% faster delivery for an additional 25% fee. Just mention your deadline in the project form.',
  },
  {
    question: 'Do you work with Wix, Squarespace, or WordPress?',
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
      <Header>
        <div className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden">
          {/* Floating cat decoration */}
          <div className="absolute top-10 right-[8%] w-32 h-32 opacity-20 hidden md:block">
            <Image src="/02.svg" alt="" width={128} height={128} className="w-full h-full" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Badge */}
            <div className="text-center mb-20">
              <div className="inline-block bg-[#7C3AED]/10 text-[#7C3AED] px-6 py-3 rounded-full border-2 border-[#7C3AED]/20 mb-8">
                <span className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                  <Icon icon="ph:chat-circle-dots-duotone" className="w-5 h-5" />
                  Get In Touch
                </span>
              </div>

              {/* Hero */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-ink mb-8 leading-tight">
                Let&apos;s Brew Something <span className="italic text-[#7C3AED]">Together</span>
              </h1>
              <p className="text-2xl md:text-3xl text-ink/70 font-bold leading-tight max-w-3xl mx-auto">
                Tell us about your project. We&apos;ll send you a custom proposal within 24 hours.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-20">
              {/* Phone */}
              <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] text-center hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                <div className="mb-4">
                  <Icon icon="ph:phone-duotone" className="w-16 h-16 text-deep-taro mx-auto" />
                </div>
                <h3 className="text-2xl font-black text-ink mb-3">Call Us</h3>
                <a
                  href="tel:+17542434766"
                  className="text-lg font-bold text-[#7C3AED] hover:text-[#A78BFA] transition-colors"
                >
                  (754) 243-4766
                </a>
              </div>

              {/* Email */}
              <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] text-center hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                <div className="mb-4">
                  <Icon icon="ph:envelope-duotone" className="w-16 h-16 text-deep-taro mx-auto" />
                </div>
                <h3 className="text-2xl font-black text-ink mb-3">Email Us</h3>
                <a
                  href="mailto:hello@pixelboba.com"
                  className="text-lg font-bold text-[#7C3AED] hover:text-[#A78BFA] transition-colors"
                >
                  hello@pixelboba.com
                </a>
              </div>

              {/* Form */}
              <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] text-center hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                <div className="mb-4">
                  <Icon
                    icon="ph:note-pencil-duotone"
                    className="w-16 h-16 text-deep-taro mx-auto"
                  />
                </div>
                <h3 className="text-2xl font-black text-ink mb-3">Start Your Project</h3>
                <Link
                  href="/start"
                  className="text-lg font-bold text-[#7C3AED] hover:text-[#A78BFA] transition-colors"
                >
                  Fill Out Form →
                </Link>
              </div>
            </div>

            {/* Quick Info */}
            <div className="mb-20">
              <div className="bg-white rounded-3xl p-10 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
                <h2 className="text-4xl md:text-5xl font-black text-ink mb-8 text-center">
                  Quick Info
                </h2>
                <div className="grid md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="mb-3">
                      <Icon
                        icon="ph:lightning-duotone"
                        className="w-12 h-12 text-deep-taro mx-auto"
                      />
                    </div>
                    <h3 className="text-2xl font-black text-ink mb-2">24 Hours</h3>
                    <p className="text-lg font-bold text-ink/70">Response Time</p>
                  </div>
                  <div>
                    <div className="mb-3">
                      <Icon
                        icon="ph:map-pin-duotone"
                        className="w-12 h-12 text-deep-taro mx-auto"
                      />
                    </div>
                    <h3 className="text-2xl font-black text-ink mb-2">Fort Lauderdale</h3>
                    <p className="text-lg font-bold text-ink/70">South Florida</p>
                  </div>
                  <div>
                    <div className="mb-3">
                      <Icon icon="ph:rocket-duotone" className="w-12 h-12 text-deep-taro mx-auto" />
                    </div>
                    <h3 className="text-2xl font-black text-ink mb-2">2-6 Weeks</h3>
                    <p className="text-lg font-bold text-ink/70">Typical Timeline</p>
                  </div>
                  <div>
                    <div className="mb-3">
                      <Icon
                        icon="ph:hundred-duotone"
                        className="w-12 h-12 text-deep-taro mx-auto"
                      />
                    </div>
                    <h3 className="text-2xl font-black text-ink mb-2">Custom</h3>
                    <p className="text-lg font-bold text-ink/70">Every Proposal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-20">
              <h2 className="text-5xl md:text-6xl font-black text-ink mb-12 text-center">
                Frequently Asked <span className="italic text-[#7C3AED]">Questions</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  >
                    <div className="mb-4">
                      <Icon icon="ph:question-duotone" className="w-12 h-12 text-deep-taro" />
                    </div>
                    <h3 className="text-xl font-black text-ink mb-3">{faq.question}</h3>
                    <p className="text-lg font-bold text-ink/70">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA with cat */}
            <div className="relative">
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
                  Ready to Start?
                </h2>
                <p className="text-2xl text-ink/70 font-bold mb-6">
                  Brewing up fresh websites for {year}. Your order&apos;s up next.
                </p>
                <div className="inline-block bg-[#FDB97A] px-6 py-3 rounded-full border-3 border-ink mb-8">
                  <span className="text-lg font-black text-ink flex items-center gap-2">
                    <Icon icon="ph:calendar-duotone" className="w-6 h-6" />
                    Taking orders for {currentMonth} & {nextMonth}
                  </span>
                </div>
                <div>
                  <Link
                    href="/start"
                    className="inline-flex items-center px-12 py-6 bg-[#FDB97A] text-ink text-xl font-black rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  >
                    START YOUR PROJECT →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Header>
      <Footer />
      <StickyCTA />
    </div>
  );
}
