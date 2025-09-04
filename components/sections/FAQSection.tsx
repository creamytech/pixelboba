'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "What's included in your web design and development services?",
    answer:
      'Every project includes custom design, responsive development, SEO optimization, performance optimization, content management setup, and post-launch support. We also provide training so you can manage your site independently.',
  },
  {
    question: 'How long does it typically take to complete a project?',
    answer:
      "Most projects take 4-8 weeks from start to finish, depending on complexity and scope. Simple websites can be completed in 2-3 weeks, while complex e-commerce or SaaS platforms may take 8-12 weeks. We'll provide a detailed timeline during our initial consultation.",
  },
  {
    question: 'Do you work with businesses of all sizes?',
    answer:
      'Yes! We work with everyone from solo entrepreneurs and startups to established businesses and enterprises. Our approach scales to match your needs and budget, ensuring you get maximum value regardless of your company size.',
  },
  {
    question: 'What platforms and technologies do you use?',
    answer:
      'We specialize in modern technologies like Next.js, React, TypeScript, and Tailwind CSS. For content management, we often use headless CMS solutions or custom-built admin panels. We choose the best tools for each project to ensure optimal performance and scalability.',
  },
  {
    question: 'Can you redesign my existing website?',
    answer:
      "Absolutely! We can completely redesign your existing site or perform targeted improvements. We'll analyze your current site, identify areas for improvement, and create a strategy that maintains your SEO rankings while dramatically improving user experience.",
  },
  {
    question: 'Do you provide ongoing maintenance and support?',
    answer:
      'Yes, we offer flexible maintenance plans including security updates, content updates, performance monitoring, and technical support. You can choose from monthly retainers or project-based support depending on your needs.',
  },
  {
    question: 'How do you ensure my website will be fast and SEO-friendly?',
    answer:
      'We follow industry best practices including optimized images, efficient code, fast hosting, proper meta tags, schema markup, and mobile-first design. Every site is tested for Core Web Vitals and we aim for 95+ Lighthouse scores across all metrics.',
  },
  {
    question: 'What happens if I need changes after the website launches?',
    answer:
      'We include a revision period after launch for minor adjustments. For ongoing changes, we offer flexible hourly rates or monthly retainers. We also provide training so you can make content updates yourself.',
  },
  {
    question: 'Do you handle hosting and domain setup?',
    answer:
      "We can manage everything for you or work with your existing setup. We typically recommend modern hosting solutions like Vercel or Netlify for optimal performance, but we're flexible based on your preferences and requirements.",
  },
  {
    question: 'How do we get started?',
    answer:
      "Simply contact us through our contact form or email. We'll schedule a discovery call to understand your needs, provide a detailed proposal, and create a timeline that works for both parties. Most projects can start within 1-2 weeks of agreement.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Got questions? We&apos;ve got answers. If you don&apos;t see what you&apos;re looking
            for, feel free to reach out.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold text-ink pr-8">{faq.question}</span>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-taro" />
                    ) : (
                      <Plus className="w-5 h-5 text-taro" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Decorative pearl */}
              {openIndex === index && (
                <motion.div
                  className="w-3 h-3 bg-taro rounded-full mx-auto mt-2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.6 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-600 mb-6">
            Still have questions? We&apos;d love to chat about your project.
          </p>
          <a
            href="/contact"
            className="inline-block bg-taro text-white px-8 py-3 rounded-lg font-semibold hover:bg-deep-taro transition-colors duration-200"
          >
            Get In Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
