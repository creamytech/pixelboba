'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'how do we give feedback if there are no meetings?',
    answer:
      'All feedback happens directly in your client dashboard. You can leave comments on designs, share ideas via messages, and approve milestones. all in one place. We respond within 24 hours, and you never have to schedule a call unless you want to.',
  },
  {
    question: 'what if I need to talk to someone?',
    answer:
      'We are always available via your dashboard messaging system and email. If you prefer a quick call to clarify something, we are happy to hop on. but we don&apos;t require meetings to move forward. Most clients love the async workflow because it saves time and keeps things moving.',
  },
  {
    question: 'how do you understand my vision without a discovery call?',
    answer:
      'Our project form asks all the right questions upfront. We also review your current site, competitors, and inspiration links. From there, we create a detailed brief and clickable prototype that you can review and refine. This process is faster and more thorough than a typical discovery call.',
  },
  {
    question: 'how long does each phase take?',
    answer:
      'Discovery & planning takes 3-5 days. Design & build ranges from 2-5 weeks depending on complexity. Launch happens in 1-2 days. We provide exact timelines in your proposal and track everything in your dashboard.',
  },
  {
    question: 'what happens after the site launches?',
    answer:
      'After launch, we provide ongoing support for any bugs or issues. We also offer optional care plans ($99/month+) that include monthly updates, backups, security monitoring, and content changes. You will always have access to your dashboard for support requests.',
  },
  {
    question: 'can I see work-in-progress designs?',
    answer:
      'Absolutely! You get a live staging site from day one. As we build, you can click through and test everything in real-time. No waiting weeks to see your site. you are involved throughout the entire process via your dashboard.',
  },
  {
    question: 'what if I need revisions?',
    answer:
      'Revisions are built into every package (2-3 rounds depending on your tier). Just leave feedback in your dashboard, and we will implement changes quickly. Our goal is to get it right, not to limit revisions. we want you to love your site.',
  },
  {
    question: 'do you work with clients outside south florida?',
    answer:
      'Yes! While we are based in Fort Lauderdale, our async-first process works perfectly for remote clients. We have built sites for businesses across the US. Location doesn&apos;t matter. great communication and clear processes do.',
  },
];

export default function ProcessFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-milk-tea/10 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-6 lowercase">
              frequently asked questions
            </h2>
            <p className="text-xl text-gray-600 lowercase">
              everything you need to know about our no-meetings workflow
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-xl border border-ink/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-milk-tea/5 transition-colors duration-200"
                  aria-expanded={openIndex === index}
                >
                  <h3 className="font-display text-lg md:text-xl font-bold text-ink lowercase pr-8">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-6 h-6 text-taro" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed lowercase">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Still Have Questions CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center bg-gradient-to-br from-taro/5 to-matcha/5 rounded-2xl p-10 border border-taro/10"
          >
            <h3 className="font-display text-2xl font-bold text-ink mb-4 lowercase">
              still have questions?
            </h3>
            <p className="text-gray-600 mb-6 lowercase">
              we&apos;re here to help. send us a message and we&apos;ll get back to you within 24
              hours.
            </p>
            <a
              href="mailto:hello@pixelboba.com"
              className="inline-flex items-center bg-taro text-white px-8 py-4 rounded-xl font-semibold hover:bg-deep-taro transition-all duration-300 lowercase shadow-lg hover:shadow-2xl hover:shadow-taro/30 hover:scale-105"
            >
              email us
              <span className="inline-block ml-2">→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
