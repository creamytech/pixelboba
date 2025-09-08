'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Pixel Boba created a healthcare platform that truly puts patients first. Their focus on accessibility and user experience has transformed how we deliver care.',
    author: 'Dr. Maria Rodriguez',
    role: 'Founder, Care On Call',
    avatar: 'MR',
  },
  {
    quote:
      'Working with the Pixel Boba team felt like having an extension of our own team. They truly understood our vision and brought it to life beautifully.',
    author: 'Marcus Johnson',
    role: 'Founder, TechStart SaaS',
    avatar: 'MJ',
  },
  {
    quote:
      'Not only did they create a stunning portfolio site, but the performance improvements made such a difference for my visitors. Highly recommend!',
    author: 'Elena Rodriguez',
    role: 'Owner, Artisan Studio',
    avatar: 'ER',
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-milk-tea to-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-6">
            what our clients say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            don&apos;t just take our word for it—hear from the amazing businesses we&apos;ve had the
            pleasure of working with.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Testimonial Card */}
            <motion.div
              key={currentIndex}
              className="bg-white rounded-lg shadow-xl p-8 md:p-12 text-center relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-taro rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                &ldquo;{testimonials[currentIndex].quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-taro rounded-full flex items-center justify-center text-white font-bold">
                  {testimonials[currentIndex].avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-ink">{testimonials[currentIndex].author}</div>
                  <div className="text-gray-600 text-sm">{testimonials[currentIndex].role}</div>
                </div>
              </div>

              {/* Decorative pearls */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-matcha/40 rounded-full" />
              <div className="absolute bottom-4 left-4 w-4 h-4 bg-brown-sugar/30 rounded-full" />
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-taro hover:text-white transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentIndex ? 'bg-taro' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-taro hover:text-white transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
