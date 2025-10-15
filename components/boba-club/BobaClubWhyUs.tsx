'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { DollarSign, Target, Zap, Award, Calendar, Layout } from 'lucide-react';
import Image from 'next/image';

const highlights = [
  {
    icon: DollarSign,
    title: 'Predictable Pricing',
    description: 'One flat rate. No hourly billing or scope creep.',
    gradient: 'from-taro to-deep-taro',
  },
  {
    icon: Target,
    title: 'Consistent Quality',
    description: 'Your dedicated Pixel Boba designer learns your brand and stays aligned.',
    gradient: 'from-matcha to-green-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Delivery',
    description: 'Receive new work in 24-48 hours on average.',
    gradient: 'from-brown-sugar to-amber-700',
  },
  {
    icon: Award,
    title: 'Full Creative Ownership',
    description: 'Every file and design is yours to keep forever.',
    gradient: 'from-taro to-purple-600',
  },
  {
    icon: Calendar,
    title: 'No Commitment Needed',
    description: 'Pause or cancel whenever you need.',
    gradient: 'from-matcha to-lime-600',
  },
  {
    icon: Layout,
    title: 'Streamlined Workflow',
    description: 'Submit, track, and revise from one easy dashboard.',
    gradient: 'from-deep-taro to-indigo-700',
  },
];

const testimonials = [
  {
    quote:
      'Boba Club changed how we handle design. Fast, consistent, and top-tier quality every time.',
    author: 'Ava',
    role: 'Founder of Bloom Studio',
    avatar: '/avatars/avatar-1.jpg',
    color: '#A78BFA',
  },
  {
    quote:
      'Our brand finally feels cohesive across every channel. Could not recommend Pixel Boba enough.',
    author: 'Liam',
    role: 'Marketing Lead',
    avatar: '/avatars/avatar-2.jpg',
    color: '#84CC16',
  },
  {
    quote: 'It is like having an in-house design team without the overhead.',
    author: 'Maya',
    role: 'Creator & Entrepreneur',
    avatar: '/avatars/avatar-3.jpg',
    color: '#8B5E3C',
  },
];

export default function BobaClubWhyUs() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-taro/5 via-transparent to-matcha/5 pointer-events-none" />

      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-taro/10 to-matcha/10"
            style={{
              width: 80 + i * 30,
              height: 80 + i * 30,
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
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
            Why Creators and Brands Love Boba Club
          </h2>
        </motion.div>

        {/* Highlights Grid */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg border border-taro/10 hover:border-taro/30 transition-all duration-300"
              >
                {/* Gradient orb on hover */}
                <motion.div
                  className={`absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br ${highlight.gradient} rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${highlight.gradient} rounded-xl flex items-center justify-center mb-4`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <highlight.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="font-display text-xl font-bold text-ink mb-3">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                </div>

                {/* Decorative pearl */}
                <motion.div
                  className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-taro/30"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-milk-tea to-white rounded-3xl p-12 shadow-2xl border border-taro/20 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-taro/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

            {/* Testimonial content */}
            <div className="relative z-10">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Quote */}
                <div className="mb-8">
                  <svg
                    className="w-12 h-12 text-taro/30 mx-auto mb-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                  </svg>
                  <p className="text-2xl md:text-3xl font-medium text-ink leading-relaxed">
                    &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  {/* Avatar with pearl effect */}
                  <motion.div
                    className="relative"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), ${testimonials[currentTestimonial].color})`,
                        boxShadow: `0 4px 20px ${testimonials[currentTestimonial].color}40`,
                      }}
                    >
                      {testimonials[currentTestimonial].author[0]}
                    </div>
                  </motion.div>

                  <div className="text-left">
                    <p className="font-bold text-ink text-lg">
                      {testimonials[currentTestimonial].author}
                    </p>
                    <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>

              {/* Navigation dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-taro w-8' : 'bg-taro/30 hover:bg-taro/50'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
