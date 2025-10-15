'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    question: 'How fast will I receive my designs?',
    answer:
      'Most requests are completed in 24-48 business hours. Simple tasks like social graphics may be faster, while complex projects like full landing pages may take the full 48 hours or slightly longer depending on scope.',
  },
  {
    question: 'How does onboarding work?',
    answer:
      'After you subscribe, you will receive an invite to our project board where you can submit your first request. We will schedule a quick kickoff to understand your brand and preferences.',
  },
  {
    question: 'Who are the designers?',
    answer:
      'Your designs are created by our founder and lead designer with 10+ years of experience. Additional specialists join for specific needs like illustration or animation.',
  },
  {
    question: 'Is there a limit to how many requests I can make?',
    answer:
      'No limit. Add as many as you like. We complete one at a time from your queue. This ensures each project gets our full attention and maintains our high quality standards.',
  },
  {
    question: 'How does the pause feature work?',
    answer:
      'Your unused time carries over so you never lose days. You can pause your subscription at any time and resume whenever you need design work again. Perfect for seasonal businesses or project-based needs.',
  },
  {
    question: 'How do you handle larger requests?',
    answer:
      'Complex projects are broken into milestones. We deliver iteratively so you can provide feedback and ensure we are heading in the right direction before completing the full scope.',
  },
  {
    question: 'What programs do you design in?',
    answer:
      'Figma, Illustrator, Photoshop, and Webflow. We use industry-standard tools to ensure compatibility and professional results. All final files are delivered in formats you can easily use.',
  },
  {
    question: 'How does Webflow development work?',
    answer:
      'We can build your designs directly in Webflow, including responsive layouts, interactions, and CMS setup. You receive a fully functional website ready to publish.',
  },
  {
    question: 'How will I request designs?',
    answer:
      'Submit requests through our project board. Include as much detail as you like - references, sketches, brand guidelines. We will clarify anything we need before starting.',
  },
  {
    question: "What if I don't like the design?",
    answer:
      'We revise until you are happy. Your feedback guides the work. Most projects need 1-2 rounds of revisions. We want you to love the final result.',
  },
  {
    question: "Are there any requests you don't support?",
    answer:
      '3D rendering, long-form video, and large print publications are not covered. We focus on 2D design work including branding, UI/UX, web design, and marketing materials.',
  },
  {
    question: 'What if I only have a single request?',
    answer:
      'That is okay. Many brands join for a single month to launch or rebrand. There are no long-term contracts or commitments. Cancel anytime, even after your first month.',
  },
  {
    question: 'Are there any refunds?',
    answer:
      'You can request a 75% refund within your first week if you are not satisfied. We want to make sure Boba Club is the right fit for you with minimal risk.',
  },
];

export default function BobaClubFAQ() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-32 bg-milk-tea/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-5xl md:text-7xl font-black text-ink mb-6">
            <span className="italic text-taro">Frequently</span> asked
            <br />
            questions
          </h2>
        </motion.div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr,420px] gap-12 items-start">
          {/* Left: FAQ List */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <div className="bg-white rounded-2xl border-4 border-ink overflow-hidden hover:shadow-xl transition-shadow duration-200">
                  {/* Question Button */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 transition-colors duration-200"
                  >
                    <h3 className="font-medium text-lg text-ink pr-4">{faq.question}</h3>

                    {/* Chevron */}
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-6 h-6 text-ink" />
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.3, ease: 'easeInOut' },
                          opacity: { duration: 0.2 },
                        }}
                        className="overflow-hidden border-t-4 border-ink"
                      >
                        <div className="px-6 py-6">
                          <p className="text-ink/70 leading-relaxed font-medium">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Taro Contact Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-gradient-to-br from-taro via-deep-taro to-matcha rounded-3xl p-10 border-4 border-ink shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-matcha/20 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full" />

              {/* Content */}
              <div className="relative z-10">
                {/* Taro Image */}
                <div className="mb-8 flex justify-center">
                  <div className="relative w-32 h-32 rounded-full border-4 border-ink shadow-xl overflow-hidden bg-white">
                    <Image
                      src="/pfp.png"
                      alt="Taro - Pixel Boba mascot"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Text */}
                <h3 className="font-display text-4xl font-black text-white text-center mb-3 leading-tight">
                  Get in touch
                  <br />
                  with Taro
                </h3>

                <p className="text-center text-white/90 font-medium text-lg mb-8">
                  Prefer to email?
                </p>

                {/* Email Button */}
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-white hover:bg-white/90 text-ink py-6 text-lg font-bold rounded-full transition-all duration-200 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  <a
                    href="mailto:hello@pixelboba.com"
                    className="flex items-center justify-center gap-2"
                  >
                    <span>hello@pixelboba.com</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
