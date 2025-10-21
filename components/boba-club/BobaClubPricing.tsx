'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, Sparkles } from 'lucide-react';
import CheckoutButton from './CheckoutButton';
import { Icon } from '@iconify/react';

const tiers = [
  {
    name: 'Classic Milk Tea',
    icon: 'ph:coffee-duotone',
    price: 1995,
    description: 'Perfect for small businesses and startups',
    features: [
      'One project at a time',
      'Get work in 3 days',
      'Unlimited revisions',
      'Website pages, updates & fixes',
      'Graphics for social media & marketing',
      'Custom landing pages',
      'Logo & branding design',
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
    icon: 'ph:drop-duotone',
    price: 3995,
    description: 'Best for growing businesses and agencies',
    features: [
      'One project at a time',
      'Priority delivery in 2 days',
      'Unlimited revisions',
      'Full websites & online stores',
      'Advanced branding & illustrations',
      'Custom animations',
      'Connect your favorite tools',
      'Customer portals & login areas',
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
    icon: 'ph:cloud-duotone',
    price: 6995,
    description: 'Enterprise solution for maximum growth',
    features: [
      'Two projects at a time',
      'Express delivery in 24 hours',
      'Unlimited revisions',
      'Full SEO services & Google ranking',
      'Complex websites & custom systems',
      'Works perfect on all devices',
      'Lightning-fast performance',
      'Accessible for everyone',
      'Custom animations & effects',
      'Any platform or technology',
      'Connect all your tools',
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
      className="py-32 bg-cream relative overflow-hidden scroll-mt-20"
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
            Choose Your
            <br />
            <span className="italic text-taro">Flavor</span>
          </h2>
          <p className="text-xl md:text-2xl text-ink/70 font-bold max-w-3xl mx-auto">
            Unlimited web development + design for one flat monthly rate.
          </p>
        </motion.div>

        {/* Stacked pricing cards */}
        <div className="max-w-4xl mx-auto space-y-12 mb-20">
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
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-[#FDB97A] border-4 border-ink rounded-full px-6 py-3 shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
                    <p className="font-black text-ink text-sm uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </p>
                  </div>
                </div>
              )}

              {/* Pricing card */}
              <div
                className={`bg-white border-4 border-ink rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:shadow-[10px_10px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all ${
                  tier.popular ? 'border-[#FDB97A]' : ''
                }`}
              >
                <div className="grid md:grid-cols-2 gap-10">
                  {/* Left column - Header and Price */}
                  <div className="flex flex-col justify-center">
                    <div className="mb-6">
                      <Icon icon={tier.icon} className="w-24 h-24 text-deep-taro mb-6" />
                      <h3 className="font-display text-4xl md:text-5xl font-black text-ink mb-4">
                        {tier.name}
                      </h3>
                      <p className="text-ink/70 font-bold text-lg mb-8">{tier.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-6xl md:text-7xl font-black text-ink">
                          ${tier.price.toLocaleString()}
                        </span>
                        <span className="text-2xl text-ink/70 font-bold">/month</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <CheckoutButton
                      size="lg"
                      className="w-full bg-matcha hover:bg-matcha/90 text-ink py-6 text-xl font-black rounded-full border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
                    >
                      Get Started
                    </CheckoutButton>

                    <p className="text-center text-ink/50 text-base font-bold mt-5">
                      Pause or cancel anytime
                    </p>
                  </div>

                  {/* Right column - Features */}
                  <div>
                    <ul className="space-y-4">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Icon
                            icon="ph:check-circle-duotone"
                            className="w-7 h-7 text-matcha flex-shrink-0 mt-0.5"
                          />
                          <span className="text-ink font-bold text-lg leading-relaxed">
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
          className="max-w-4xl mx-auto mb-20 text-center"
        >
          <div className="bg-[#A78BFA]/10 border-4 border-ink rounded-3xl p-10 md:p-12 shadow-[8px_8px_0px_0px_rgba(58,0,29,1)]">
            <h3 className="font-display text-3xl md:text-4xl font-black text-ink mb-6">
              Why Boba Club Beats Hiring In-House
            </h3>
            <p className="text-lg md:text-xl text-ink/70 font-bold max-w-2xl mx-auto leading-relaxed">
              Hiring a senior developer{' '}
              <span className="font-black text-ink">+ designer costs $150K+/year</span> plus
              benefits. Boba Club starts at just{' '}
              <span className="font-black text-taro">$24K/year</span>—pause or cancel anytime.
            </p>
          </div>
        </motion.div>

        {/* Bottom perks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8"
        >
          <div className="bg-white rounded-3xl p-10 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-[#A78BFA]/20 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-ink">
                <Icon icon="ph:pause-circle-duotone" className="w-8 h-8 text-deep-taro" />
              </div>
              <div>
                <h4 className="font-display text-2xl md:text-3xl font-black text-ink mb-3">
                  Pause Anytime
                </h4>
                <p className="text-ink/70 font-bold text-base md:text-lg">
                  Temporarily pause your subscription anytime, no sweat.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-matcha/20 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-ink">
                <Icon icon="ph:check-circle-duotone" className="w-8 h-8 text-matcha" />
              </div>
              <div>
                <h4 className="font-display text-2xl md:text-3xl font-black text-ink mb-3">
                  Try It for a Week
                </h4>
                <p className="text-ink/70 font-bold text-base md:text-lg">
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
