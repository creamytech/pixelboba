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
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-ink mb-6">
              frequently asked <span className="italic text-taro">questions</span>
            </h2>
            <p className="text-xl text-ink/70 font-bold">
              everything you need to know about our no-meetings workflow
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-3xl border-4 border-ink overflow-hidden shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left active:bg-cream/50 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-lg md:text-xl font-black text-ink pr-8">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 bg-deep-taro rounded-full p-2"
                  >
                    <ChevronDown className="w-6 h-6 text-white" />
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
                      <div className="px-6 md:px-8 pb-6 md:pb-8 border-t-4 border-ink/10">
                        <p className="text-ink/70 font-bold leading-relaxed pt-6">{faq.answer}</p>
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
            className="mt-16 text-center bg-white rounded-3xl p-10 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)]"
          >
            <h3 className="text-2xl md:text-3xl font-black text-ink mb-4 lowercase">
              still have questions?
            </h3>
            <p className="text-ink/70 font-bold mb-6 text-lg">
              we&apos;re here to help. send us a message and we&apos;ll get back to you within 24
              hours.
            </p>
            <a
              href="mailto:hello@pixelboba.com"
              className="inline-flex items-center gap-2 bg-deep-taro text-white px-10 py-5 rounded-full font-black text-lg border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
            >
              email us
              <span className="inline-block">→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
