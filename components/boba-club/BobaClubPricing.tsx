'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, Sparkles } from 'lucide-react';
import CheckoutButton from './CheckoutButton';

const tiers = [
  {
    name: 'Classic Milk Tea',
    emoji: '🥛',
    price: 1995,
    description: 'Perfect for small businesses and startups',
    features: [
      'One request at a time',
      'Average 72-hour delivery',
      'Unlimited revisions',
      'Web development (landing pages, updates, bug fixes)',
      'Graphic design (social media, branding, marketing)',
      'Webflow development',
      'Basic React/Next.js development',
      '1 brand',
      'Unlimited stock photos',
      '1 user',
    ],
    gradient: 'from-gray-100 to-gray-200',
    borderColor: 'border-gray-300',
    buttonColor: 'bg-gray-800 hover:bg-gray-700',
    popular: false,
  },
  {
    name: 'Brown Sugar Boba',
    emoji: '🧋',
    price: 3995,
    description: 'Best for growing businesses and agencies',
    features: [
      'One request at a time',
      'Priority 48-hour delivery',
      'Unlimited revisions',
      'Advanced web development (full apps, e-commerce, custom features)',
      'Advanced design (branding, UI/UX, illustrations, animations)',
      'Webflow development',
      'React/Next.js/TypeScript development',
      'API integrations',
      'Unlimited brands',
      'Unlimited stock photos',
      'Up to 3 users',
    ],
    gradient: 'from-amber-700 to-amber-900',
    borderColor: 'border-amber-600',
    buttonColor: 'bg-matcha hover:bg-matcha/90',
    popular: true,
  },
  {
    name: 'Taro Cloud',
    emoji: '☁️',
    price: 6995,
    description: 'Enterprise solution with SEO services',
    features: [
      'Two requests at a time',
      'Express 24-hour delivery',
      'Unlimited revisions',
      'Full SEO services (technical SEO, content optimization, keyword research, reporting)',
      'Advanced full-stack development (databases, auth, complex backends)',
      'Mobile-responsive design & development',
      'Performance optimization',
      'Accessibility (WCAG) compliance',
      'Custom animations & motion graphics',
      'Webflow + React/Next.js + any framework',
      'API development & integrations',
      'Unlimited brands',
      'Unlimited stock photos',
      'Up to 5 users',
      'Dedicated account manager',
      'Monthly strategy calls',
    ],
    gradient: 'from-deep-taro to-taro',
    borderColor: 'border-taro',
    buttonColor: 'bg-matcha hover:bg-matcha/90',
    popular: false,
  },
];

export default function BobaClubPricing() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="py-32 bg-milk-tea relative overflow-hidden scroll-mt-20"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-5xl md:text-7xl font-black text-ink mb-6">
            choose your
            <br />
            <span className="italic text-taro">flavor</span>
          </h2>
          <p className="text-xl md:text-2xl text-ink/70 font-medium max-w-3xl mx-auto">
            unlimited web development + design for one flat monthly rate
          </p>
        </motion.div>

        {/* Three-column pricing grid */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-matcha border-4 border-ink rounded-full px-6 py-2 shadow-lg">
                    <p className="font-black text-ink text-sm uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </p>
                  </div>
                </div>
              )}

              {/* Pricing card */}
              <div
                className={`bg-white border-4 ${tier.borderColor} rounded-3xl p-8 h-full flex flex-col shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] ${
                  tier.popular ? 'scale-105 md:scale-110' : ''
                }`}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{tier.emoji}</div>
                  <h3 className="font-display text-3xl font-black text-ink mb-2">{tier.name}</h3>
                  <p className="text-ink/60 font-medium text-sm">{tier.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="font-display text-5xl font-black text-ink">
                      ${tier.price.toLocaleString()}
                    </span>
                    <span className="text-xl text-ink/60 font-medium">/month</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="flex-grow mb-8">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-matcha rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-ink" />
                        </div>
                        <span className="text-ink/80 font-medium text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <CheckoutButton
                    size="lg"
                    className={`w-full ${tier.buttonColor} text-ink py-6 text-lg font-bold rounded-full transition-all duration-200 shadow-md hover:shadow-lg`}
                  >
                    Get Started
                  </CheckoutButton>
                </motion.div>

                <p className="text-center text-ink/40 text-xs font-medium mt-4">
                  pause or cancel anytime
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Value Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-16 text-center"
        >
          <div className="bg-gradient-to-r from-taro/10 via-matcha/10 to-taro/10 border-4 border-ink rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-taro/20 rounded-bl-full" />
            <h3 className="font-display text-2xl md:text-3xl font-black text-ink mb-4">
              Why Boba Club Beats Hiring In-House
            </h3>
            <p className="text-lg md:text-xl text-ink/70 font-medium max-w-2xl mx-auto">
              Hiring a senior developer{' '}
              <span className="font-bold text-ink">+ designer costs $150K+/year</span> plus
              benefits. Boba Club starts at just{' '}
              <span className="font-bold text-taro">$24K/year</span> — pause or cancel anytime.
            </p>
          </div>
        </motion.div>

        {/* Bottom perks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-3xl p-10 border-4 border-ink">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-milk-tea rounded-full flex items-center justify-center flex-shrink-0 text-2xl border-4 border-ink">
                ⏸️
              </div>
              <div>
                <h4 className="font-display text-2xl font-black text-ink mb-2">pause anytime</h4>
                <p className="text-ink/60 font-medium text-base">
                  temporarily pause your subscription anytime, no sweat.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 border-4 border-ink">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-milk-tea rounded-full flex items-center justify-center flex-shrink-0 text-2xl border-4 border-ink">
                ✓
              </div>
              <div>
                <h4 className="font-display text-2xl font-black text-ink mb-2">
                  try it for a week
                </h4>
                <p className="text-ink/60 font-medium text-base">
                  not loving it after a week? get 75% back, no questions asked.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
