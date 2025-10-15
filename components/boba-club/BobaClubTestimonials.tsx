'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Boba Club changed how we handle design. Fast, consistent, and top-tier quality every time.',
    author: 'Ava',
    role: 'Founder of Bloom Studio',
    color: '#A78BFA',
    initial: 'A',
  },
  {
    quote:
      'Our brand finally feels cohesive across every channel. Could not recommend Pixel Boba enough.',
    author: 'Liam',
    role: 'Marketing Lead',
    color: '#84CC16',
    initial: 'L',
  },
  {
    quote: 'It is like having an in-house design team without the overhead.',
    author: 'Maya',
    role: 'Creator & Entrepreneur',
    color: '#8B5E3C',
    initial: 'M',
  },
];

export default function BobaClubTestimonials() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-milk-tea/30 via-transparent to-taro/10 pointer-events-none" />

      {/* Floating confetti/pearls */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${
                ['#A78BFA', '#84CC16', '#8B5E3C'][i % 3]
              })`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
            Clients Who Joined the Club
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what creators and brands are saying about Boba Club.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-taro/10 hover:border-taro/30 transition-all duration-300 h-full flex flex-col">
                  {/* Quote icon */}
                  <motion.div
                    className="mb-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Quote className="w-10 h-10 text-taro/30" />
                  </motion.div>

                  {/* Quote text */}
                  <p className="text-lg text-gray-700 leading-relaxed mb-6 flex-grow">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author info */}
                  <div className="flex items-center gap-4">
                    {/* Avatar with pearl effect */}
                    <motion.div
                      className="relative"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), ${testimonial.color})`,
                          boxShadow: `0 4px 20px ${testimonial.color}40`,
                        }}
                      >
                        {testimonial.initial}
                      </div>

                      {/* Orbiting pearl */}
                      <motion.div
                        className="absolute w-3 h-3 rounded-full bg-white shadow-md"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        style={{
                          top: '50%',
                          left: '50%',
                          marginLeft: '24px',
                          marginTop: '-6px',
                        }}
                      />
                    </motion.div>

                    <div>
                      <p className="font-bold text-ink">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Decorative pearl */}
                  <motion.div
                    className="absolute top-4 right-4 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${testimonial.color})`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
