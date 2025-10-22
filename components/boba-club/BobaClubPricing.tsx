'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, Sparkles } from 'lucide-react';
import CheckoutButton from './CheckoutButton';
import { Icon } from '@iconify/react';

const tiers = [
  {
    name: 'Lite Brew',
    icon: 'ph:coffee-duotone',
    price: 1500,
    priceId: process.env.NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID || '',
    description: 'Perfect for solo founders or startups.',
    features: [
      'Access to the Pixel Boba Dashboard (1 user)',
      '1 active request at a time',
      'Website pages, landing pages, and updates',
      'Social media and marketing graphics',
      'Light branding (logos, color palettes, typography)',
      '3–4 day turnaround per request',
      'Unlimited revisions',
      'Pause or cancel anytime',
    ],
    gradient: 'from-milk-tea to-warm-cream',
    borderColor: 'border-brown-sugar/30',
    buttonColor: 'bg-brown-sugar hover:bg-brown-sugar/90',
    popular: false,
  },
  {
    name: 'Signature Blend',
    icon: 'ph:drop-duotone',
    price: 3000,
    priceId: process.env.NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID || '',
    description: 'Our most popular — built for growing teams.',
    features: [
      'Access to Premium Dashboard features',
      'Real-time project tracking',
      'Comment threads & file uploads',
      'Task queue management',
      'Up to 3 users',
      '2 active requests at a time',
      'Priority delivery (2-day average turnaround)',
      'Full websites & online stores',
      'Advanced branding systems & illustrations',
      'Custom animations',
      'Monthly mini-UX review',
      'Unlimited revisions',
    ],
    gradient: 'from-[#FDB97A] to-thai-tea',
    borderColor: 'border-[#FDB97A]',
    buttonColor: 'bg-matcha hover:bg-matcha/90',
    popular: true,
  },
  {
    name: 'Taro Cloud',
    icon: 'ph:cloud-duotone',
    price: 6000,
    priceId: process.env.NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID || '',
    description: 'Full creative power, unlimited brands, and real-time collaboration.',
    features: [
      'Enterprise Dashboard Suite',
      'Manage multiple brands or sub-accounts',
      'Priority queueing (jump to top of the line)',
      'Admin panel for your internal team',
      'Access for up to 5 users',
      '3 active requests at a time',
      '24-hour express delivery',
      'Dedicated creative manager',
      'Monthly strategy & performance calls',
      'Performance, SEO & accessibility optimization',
      'Complex websites, web apps & custom systems',
      'Unlimited revisions',
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
      className="py-16 sm:py-24 md:py-32 bg-cream relative overflow-hidden scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink mb-4 sm:mb-6">
            Your design team
            <br />
            <span className="italic text-taro">in a dashboard</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-ink/70 font-bold max-w-3xl mx-auto px-4">
            Submit requests, track progress, and sip while we design.
          </p>
        </motion.div>

        {/* Stacked pricing cards */}
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 mb-12 sm:mb-16 md:mb-20">
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
                <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-[#FDB97A] border-3 sm:border-4 border-ink rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] sm:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
                    <p className="font-black text-ink text-xs sm:text-sm uppercase flex items-center gap-1 sm:gap-2">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                      Most Popular
                    </p>
                  </div>
                </div>
              )}

              {/* Pricing card */}
              <div
                className={`bg-white border-3 sm:border-4 border-ink rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] md:hover:shadow-[10px_10px_0px_0px_rgba(58,0,29,1)] md:hover:translate-x-[-2px] md:hover:translate-y-[-2px] transition-all ${
                  tier.popular ? 'border-[#FDB97A]' : ''
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                  {/* Left column - Header and Price */}
                  <div className="flex flex-col justify-center">
                    <div className="mb-4 sm:mb-6">
                      <Icon
                        icon={tier.icon}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-deep-taro mb-4 sm:mb-6"
                      />
                      <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-ink mb-3 sm:mb-4">
                        {tier.name}
                      </h3>
                      <p className="text-ink/70 font-bold text-base sm:text-lg mb-6 sm:mb-8">
                        {tier.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-5xl sm:text-6xl md:text-7xl font-black text-ink">
                          ${tier.price.toLocaleString()}
                        </span>
                        <span className="text-xl sm:text-2xl text-ink/70 font-bold">/month</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <CheckoutButton
                      priceId={tier.priceId}
                      size="lg"
                      className="w-full min-h-[56px] bg-matcha hover:bg-matcha/90 text-ink py-5 sm:py-6 text-lg sm:text-xl font-black rounded-full border-3 sm:border-4 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] sm:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] active:shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] md:hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] md:hover:translate-x-[-2px] md:hover:translate-y-[-2px] transition-all uppercase"
                    >
                      Join & Get Dashboard Access
                    </CheckoutButton>

                    <p className="text-center text-ink/50 text-sm sm:text-base font-bold mt-4 sm:mt-5">
                      Pause or cancel anytime
                    </p>
                  </div>

                  {/* Right column - Features */}
                  <div>
                    <ul className="space-y-3 sm:space-y-4">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 sm:gap-3">
                          <Icon
                            icon="ph:check-circle-duotone"
                            className="w-6 h-6 sm:w-7 sm:h-7 text-matcha flex-shrink-0 mt-0.5"
                          />
                          <span className="text-ink font-bold text-base sm:text-lg leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Value Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20 text-center"
        >
          <div className="bg-[#A78BFA]/10 border-3 sm:border-4 border-ink rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)]">
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-ink mb-4 sm:mb-6">
              Why Boba Club Beats Hiring In-House
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-ink/70 font-bold max-w-2xl mx-auto leading-relaxed px-4">
              Hiring a senior developer{' '}
              <span className="font-black text-ink">+ designer costs $150K+/year</span> plus
              benefits. Boba Club starts at just{' '}
              <span className="font-black text-taro">$18K/year</span>—pause or cancel anytime.
            </p>
          </div>
        </motion.div>

        {/* Bottom perks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border-3 sm:border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] md:hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] md:hover:translate-x-[-2px] md:hover:translate-y-[-2px] transition-all">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#A78BFA]/20 rounded-full flex items-center justify-center flex-shrink-0 border-3 sm:border-4 border-ink">
                <Icon
                  icon="ph:pause-circle-duotone"
                  className="w-7 h-7 sm:w-8 sm:h-8 text-deep-taro"
                />
              </div>
              <div>
                <h4 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-ink mb-2 sm:mb-3">
                  Pause Anytime
                </h4>
                <p className="text-ink/70 font-bold text-sm sm:text-base md:text-lg leading-relaxed">
                  Temporarily pause your subscription anytime, no sweat.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border-3 sm:border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] md:hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] md:hover:translate-x-[-2px] md:hover:translate-y-[-2px] transition-all">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-matcha/20 rounded-full flex items-center justify-center flex-shrink-0 border-3 sm:border-4 border-ink">
                <Icon
                  icon="ph:check-circle-duotone"
                  className="w-7 h-7 sm:w-8 sm:h-8 text-matcha"
                />
              </div>
              <div>
                <h4 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-ink mb-2 sm:mb-3">
                  Try It for a Week
                </h4>
                <p className="text-ink/70 font-bold text-sm sm:text-base md:text-lg leading-relaxed">
                  Not loving it after a week? Get 75% back, no questions asked.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
