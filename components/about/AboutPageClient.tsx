'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';
import Lottie from 'lottie-react';
import { useState, useEffect } from 'react';

// Floating Pearl Component with accessibility support
const FloatingPearl = ({
  size,
  delay,
  duration,
  startPosition,
  color,
}: {
  size: number;
  delay: number;
  duration: number;
  startPosition: { x: string; y: string };
  color: string;
}) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <motion.div
      className={`absolute rounded-full ${color} pointer-events-none`}
      style={{
        width: size,
        height: size,
        left: startPosition.x,
        bottom: startPosition.y,
      }}
      animate={
        prefersReducedMotion
          ? {}
          : {
              y: [-10, -60, -10],
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1.2, 0.8],
            }
      }
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Team Photo with Animated Pearls
const TeamPhotoWithPearls = ({ src, alt, name }: { src: string; alt: string; name: string }) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Pearl configurations for natural floating effect
  const pearls = [
    { size: 8, delay: 0, duration: 4, startPosition: { x: '10%', y: '20%' }, color: 'bg-taro/40' },
    {
      size: 6,
      delay: 1,
      duration: 5,
      startPosition: { x: '80%', y: '10%' },
      color: 'bg-matcha/50',
    },
    {
      size: 10,
      delay: 2,
      duration: 4.5,
      startPosition: { x: '15%', y: '70%' },
      color: 'bg-milk-tea/60',
    },
    {
      size: 7,
      delay: 0.5,
      duration: 5.5,
      startPosition: { x: '85%', y: '60%' },
      color: 'bg-taro/30',
    },
    {
      size: 12,
      delay: 1.5,
      duration: 4.2,
      startPosition: { x: '5%', y: '45%' },
      color: 'bg-matcha/40',
    },
    {
      size: 9,
      delay: 2.5,
      duration: 4.8,
      startPosition: { x: '90%', y: '35%' },
      color: 'bg-milk-tea/50',
    },
  ];

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Floating Pearls Container */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {!prefersReducedMotion &&
          pearls.map((pearl, index) => <FloatingPearl key={index} {...pearl} />)}
      </div>

      {/* Profile Image */}
      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
        <Image
          src={src}
          alt={alt}
          width={192}
          height={192}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

// Logo Animation Component
const LogoAnimation = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Load the animation JSON file
    fetch('/PIxel Boba Final Logo Animation 2.json')
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error('Error loading animation:', error));
  }, []);

  if (!animationData) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="w-8 h-8 bg-taro/20 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      style={{ width: '100%', height: 'auto' }}
    />
  );
};

export default function AboutPageClient() {
  return (
    <main className="pt-20">
      {/* Logo Animation Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <LogoAnimation />
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-8 md:py-16 bg-gradient-to-br from-milk-tea via-background to-taro/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-ink mb-8 lowercase leading-tight">
              design + code that tastes better together.
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed lowercase max-w-3xl mx-auto">
              pixel boba is a small but mighty fort lauderdale studio mixing code and creativity. we
              build custom websites that feel as fresh as your favorite drink—smooth, fun, and
              designed to pop.
            </p>
          </div>
        </div>
      </section>

      {/* Pearl Divider */}
      <div className="flex justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-taro/40 rounded-full"></div>
          <div className="w-3 h-3 bg-matcha/50 rounded-full"></div>
          <div className="w-2 h-2 bg-milk-tea/60 rounded-full"></div>
        </div>
      </div>

      {/* Our Approach Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-8 lowercase text-center">
              our approach
            </h2>
            <div className="prose prose-lg max-w-none text-center">
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed lowercase mb-0">
                we don&apos;t waste time with endless mockups or long meetings. from day one
                you&apos;ll see your site in action, not on a slideshow. everything is streamlined
                and simple—updates through your client portal, previews you can click through, and
                progress that speaks for itself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pearl Divider */}
      <div className="flex justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-matcha/40 rounded-full"></div>
          <div className="w-3 h-3 bg-taro/50 rounded-full"></div>
          <div className="w-2 h-2 bg-milk-tea/60 rounded-full"></div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 bg-gradient-to-br from-taro/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-8 lowercase text-center">
              our story
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed lowercase mb-6">
                pixel boba started with a simple idea: web design doesn&apos;t have to be
                complicated. we were tired of seeing clients stuck in endless revision cycles,
                waiting weeks for mockups that didn&apos;t match the final product.
              </p>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed lowercase">
                so we brewed up something different—a code-first approach where clients see real,
                working websites from day one. no smoke and mirrors, no surprises. just clean code,
                honest timelines, and websites that actually work the way they should.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pearl Divider */}
      <div className="flex justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-taro/40 rounded-full"></div>
          <div className="w-3 h-3 bg-matcha/50 rounded-full"></div>
          <div className="w-2 h-2 bg-milk-tea/60 rounded-full"></div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <section className="py-16 bg-gradient-to-b from-transparent to-milk-tea/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-12 lowercase text-center">
              what makes us different
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-2xl flex-shrink-0">👀</div>
                <p className="text-gray-600 text-lg leading-relaxed lowercase">
                  <strong className="text-ink">previews, not promises</strong>—you see the real
                  thing as it&apos;s built.
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl flex-shrink-0">⚡</div>
                <p className="text-gray-600 text-lg leading-relaxed lowercase">
                  <strong className="text-ink">fewer hoops to jump through</strong>—clear process,
                  clean results.
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl flex-shrink-0">🚀</div>
                <p className="text-gray-600 text-lg leading-relaxed lowercase">
                  <strong className="text-ink">built to last</strong>—fast, accessible, and ready
                  for whatever comes next.
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl flex-shrink-0">📊</div>
                <p className="text-gray-600 text-lg leading-relaxed lowercase">
                  <strong className="text-ink">our custom client dashboard</strong> keeps everything
                  in one place—progress, messages, and payments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pearl Divider */}
      <div className="flex justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-taro/40 rounded-full"></div>
          <div className="w-3 h-3 bg-matcha/50 rounded-full"></div>
          <div className="w-2 h-2 bg-milk-tea/60 rounded-full"></div>
        </div>
      </div>

      {/* Team Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-16 text-center lowercase">
              meet the tea makers
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Scott Benjamin - Founder */}
              <div className="text-center">
                <div className="mb-8">
                  <TeamPhotoWithPearls
                    src="/Scott.jpg"
                    alt="Scott Benjamin, founder and developer"
                    name="Scott Benjamin"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600 text-lg leading-relaxed lowercase">
                    <strong className="text-ink">scott benjamin</strong> — founder & developer, fort
                    lauderdale. coding since middle school, still fueled by curiosity (and boba).
                    specializes in react, next.js, and making complex things simple.
                  </p>
                </div>
              </div>

              {/* Joel Armenta - Artist */}
              <div className="text-center">
                <div className="mb-8">
                  <TeamPhotoWithPearls
                    src="/Jojo.jpg"
                    alt="Joel Armenta, artist and designer"
                    name="Joel Armenta"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600 text-lg leading-relaxed lowercase">
                    <strong className="text-ink">joel armenta</strong> — artist & designer, ciudad
                    obregón. the creative eye behind the visuals, blending illustration with design
                    that feels alive. specializes in brand identity and bringing personality to
                    digital experiences.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://www.behance.net/jojopdesign"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center text-taro hover:text-deep-taro font-semibold lowercase transition-all duration-200 px-4 py-2 rounded-lg hover:bg-taro/10"
                    >
                      view portfolio
                      <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pearl Divider */}
      <div className="flex justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-matcha/40 rounded-full"></div>
          <div className="w-3 h-3 bg-taro/50 rounded-full"></div>
          <div className="w-2 h-2 bg-milk-tea/60 rounded-full"></div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-8 lowercase">
              let&apos;s make something together
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed lowercase mb-8">
              your idea, our brew.
            </p>
            <a
              href="mailto:hello@pixelboba.com"
              className="group inline-flex items-center bg-taro text-white px-8 py-4 rounded-xl font-semibold hover:bg-deep-taro transition-all duration-300 lowercase shadow-lg hover:shadow-2xl hover:shadow-taro/30 hover:scale-105"
            >
              hello@pixelboba.com
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
