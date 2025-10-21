'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

// Placeholder portfolio items - replace with real data
const portfolioItems = [
  {
    id: 1,
    title: 'Brand Identity System',
    category: 'Branding',
    image: '/work/placeholder-1.jpg',
    beforeAfter: true,
  },
  {
    id: 2,
    title: 'SaaS Landing Page',
    category: 'Web Design',
    image: '/work/placeholder-2.jpg',
    beforeAfter: true,
  },
  {
    id: 3,
    title: 'Social Media Campaign',
    category: 'Social Graphics',
    image: '/work/placeholder-3.jpg',
    beforeAfter: false,
  },
  {
    id: 4,
    title: 'Mobile App UI',
    category: 'UI/UX',
    image: '/work/placeholder-4.jpg',
    beforeAfter: true,
  },
  {
    id: 5,
    title: 'Custom Illustrations',
    category: 'Illustration',
    image: '/work/placeholder-5.jpg',
    beforeAfter: false,
  },
  {
    id: 6,
    title: 'E-commerce Design',
    category: 'Web Design',
    image: '/work/placeholder-6.jpg',
    beforeAfter: true,
  },
  {
    id: 7,
    title: 'Icon Set',
    category: 'Icons',
    image: '/work/placeholder-7.jpg',
    beforeAfter: false,
  },
  {
    id: 8,
    title: 'Email Templates',
    category: 'Marketing',
    image: '/work/placeholder-8.jpg',
    beforeAfter: false,
  },
  {
    id: 9,
    title: 'Pitch Deck',
    category: 'Presentations',
    image: '/work/placeholder-9.jpg',
    beforeAfter: true,
  },
];

export default function BobaClubPortfolio() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef} className="py-32 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-5xl md:text-7xl font-black text-ink mb-6">
            see what&apos;s <span className="italic text-taro">brewing</span>
          </h2>
          <p className="text-xl md:text-2xl text-ink/70 font-medium max-w-3xl mx-auto">
            a taste of the visuals we create for boba club members
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-3xl bg-white border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer ${
                  // Vary heights for masonry effect
                  index % 3 === 0 ? 'lg:row-span-2' : ''
                }`}
                style={{
                  minHeight: index % 3 === 0 ? '400px' : '280px',
                }}
              >
                {/* Placeholder background */}
                <div className="absolute inset-0 bg-gradient-to-br from-taro/10 via-matcha/10 to-taro/10 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-ink">
                      <Icon icon="ph:drop-duotone" className="w-16 h-16 text-deep-taro" />
                    </div>
                    <p className="text-ink font-black text-lg mb-2">{item.title}</p>
                    <p className="text-ink/60 text-sm font-bold">{item.category}</p>
                  </div>
                </div>

                {/* Category badge - always visible */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-[#FDB97A] px-4 py-2 rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]">
                    <span className="text-ink text-sm font-black uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Boba pearl decoration - bottom right */}
                <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-deep-taro border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] group-hover:scale-110 transition-transform" />
              </motion.div>
            ))}
          </div>

          {/* CTA to view more */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Link
              href="/work"
              className="inline-flex items-center gap-3 px-12 py-6 bg-deep-taro text-white text-xl font-black rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <span>view more work</span>
              <Icon icon="ph:arrow-right-bold" className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
