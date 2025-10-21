'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

const testimonials = [
  {
    quote:
      'We went from 10 calls a month to 50+ new bookings. The new site completely transformed our business.',
    author: 'Sarah M.',
    role: 'Healthcare Services',
    rating: 5,
    metric: '5X more bookings',
  },
  {
    quote:
      'Got our online store live in 3 weeks. Sales doubled in the first month. Worth every penny.',
    author: 'Mike R.',
    role: 'E-commerce Store',
    rating: 5,
    metric: '2X sales increase',
  },
  {
    quote:
      'Finally a web team that gets it done fast. No endless meetings, just a beautiful site that works.',
    author: 'Jessica L.',
    role: 'Marketing Agency',
    rating: 5,
    metric: 'Done in 2 weeks',
  },
  {
    quote:
      'Our traffic tripled after launch. The site loads lightning fast and looks incredible on phones.',
    author: 'David K.',
    role: 'Local Business',
    rating: 5,
    metric: '3X more visitors',
  },
];

export default function SocialProofSection() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <div className="inline-block bg-[#7C3AED]/10 text-[#7C3AED] px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-[#7C3AED]/20 mb-4 sm:mb-6">
            <span className="font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
              <Icon icon="ph:star-fill" className="w-4 h-4" />
              Trusted by South Florida
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink mb-4 sm:mb-6 leading-tight px-2">
            What Our Clients Say
          </h2>
        </motion.div>

        {/* Testimonial cards grid */}
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mb-12 sm:mb-16 md:mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-[3px] sm:border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] h-full active:shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] md:hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] md:hover:translate-x-[-2px] md:hover:translate-y-[-2px] transition-all">
                {/* Rating stars and metric badge */}
                <div className="flex items-start sm:items-center justify-between mb-5 sm:mb-6 gap-2 flex-wrap">
                  <div className="flex gap-0.5 sm:gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon
                        key={i}
                        icon="ph:star-fill"
                        className="w-5 h-5 sm:w-6 sm:h-6 text-matcha"
                      />
                    ))}
                  </div>
                  <div className="bg-matcha px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] sm:shadow-none">
                    <span className="font-black text-xs sm:text-sm text-white whitespace-nowrap">
                      {testimonial.metric}
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-base sm:text-lg md:text-xl font-bold text-ink/80 mb-5 sm:mb-6 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t-2 border-ink/10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] rounded-full border-2 sm:border-[3px] border-ink flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-base sm:text-lg">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-black text-ink text-sm sm:text-base">{testimonial.author}</p>
                    <p className="text-xs sm:text-sm font-bold text-ink/60">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Value props - bold cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {[
            {
              icon: 'ph:coffee-duotone',
              text: 'Smooth Process, Zero Stress',
              color: 'text-deep-taro',
            },
            {
              icon: 'ph:lightning-duotone',
              text: 'Fast Responses, Faster Delivery',
              color: 'text-matcha',
            },
            {
              icon: 'ph:chart-line-duotone',
              text: 'Lighthouse Perfect Scores',
              color: 'text-deep-taro',
            },
            { icon: 'ph:eye-duotone', text: 'Live Previews Day One', color: 'text-matcha' },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-[3px] sm:border-4 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] sm:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] text-center active:shadow-[1px_1px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all min-h-[120px] sm:min-h-0"
            >
              <Icon
                icon={item.icon}
                className={`w-12 h-12 sm:w-16 sm:h-16 ${item.color} mx-auto mb-2 sm:mb-3`}
              />
              <p className="text-xs sm:text-sm font-black text-ink leading-tight">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
