'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterSlideshowProps {
  beforeImages: string[];
  afterImages: string[];
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function BeforeAfterSlideshow({
  beforeImages,
  afterImages,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = '',
}: BeforeAfterSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAfter, setShowAfter] = useState(false);

  // Create pairs of before/after images
  const maxLength = Math.max(beforeImages.length, afterImages.length);
  const slides = Array.from({ length: maxLength }, (_, index) => ({
    before: beforeImages[index] || beforeImages[0],
    after: afterImages[index] || afterImages[0],
  }));

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setShowAfter(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setShowAfter(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setShowAfter(false);
  };

  return (
    <div className={`relative w-full max-w-[90rem] mx-auto ${className}`}>
      {/* Main Slideshow Container */}
      <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl">
        {/* Toggle Buttons */}
        <div className="absolute top-6 right-6 z-20 flex bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
          <button
            onClick={() => setShowAfter(false)}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              !showAfter
                ? 'bg-taro text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {beforeLabel}
          </button>
          <button
            onClick={() => setShowAfter(true)}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              showAfter
                ? 'bg-taro text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {afterLabel}
          </button>
        </div>

        {/* Image Container */}
        <div className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentSlide}-${showAfter ? 'after' : 'before'}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={showAfter ? slides[currentSlide].after : slides[currentSlide].before}
                alt={`${showAfter ? afterLabel : beforeLabel} - Slide ${currentSlide + 1}`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1440px"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-105 transition-all duration-200 z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-105 transition-all duration-200 z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-taro' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center mt-6">
        <p className="text-gray-600 text-sm">
          Use the {beforeLabel}/{afterLabel} toggle to compare, or navigate between pages with the
          arrows
        </p>
      </div>
    </div>
  );
}
