'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-white via-milk-tea/20 to-white"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
            See What is Brewing Inside Boba Club
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A taste of the visuals we have created for clients and creators.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                  // Vary heights for masonry effect
                  index % 3 === 0 ? 'lg:row-span-2' : ''
                }`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  minHeight: index % 3 === 0 ? '400px' : '280px',
                }}
              >
                {/* Placeholder background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-taro/20 via-matcha/20 to-brown-sugar/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-taro to-deep-taro rounded-full" />
                    </div>
                    <p className="text-white font-medium text-lg mb-2">{item.title}</p>
                    <p className="text-white/80 text-sm">{item.category}</p>
                  </div>
                </div>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: hoveredItem === item.id ? 0 : 20,
                      opacity: hoveredItem === item.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="inline-block bg-taro/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                      <span className="text-white text-sm font-medium">{item.category}</span>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                    {item.beforeAfter && (
                      <p className="text-white/80 text-sm">Before to After transformation</p>
                    )}
                  </motion.div>
                </motion.div>

                {/* Sparkle effect on hover */}
                <motion.div
                  className="absolute top-4 right-4 pointer-events-none"
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{
                    opacity: hoveredItem === item.id ? 1 : 0,
                    scale: hoveredItem === item.id ? 1 : 0,
                    rotate: hoveredItem === item.id ? 360 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-8 h-8 bg-matcha/80 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </motion.div>

                {/* Boba pearl decoration */}
                <motion.div
                  className="absolute bottom-4 left-4 w-6 h-6 rounded-full bg-gradient-to-br from-taro to-deep-taro shadow-lg"
                  animate={{
                    y: hoveredItem === item.id ? -10 : 0,
                    scale: hoveredItem === item.id ? 1.2 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-radial from-white/40 to-transparent rounded-full" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* CTA to view more */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <Button
              asChild
              size="lg"
              className="group bg-gradient-to-r from-taro to-deep-taro hover:from-deep-taro hover:to-taro text-white px-8 py-6 text-lg transition-all duration-300 hover:shadow-xl hover:shadow-taro/30"
            >
              <Link href="/work" className="inline-flex items-center gap-2">
                <span>View More Work</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
