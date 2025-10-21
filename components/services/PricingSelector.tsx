'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import PriceCard from './PriceCard';

const pricingTiers = [
  {
    id: 'starter',
    title: 'starter brew',
    price: 'starting at $1,500',
    deliveryTime: '1–2 weeks',
    badge: 'quick start',
    description: 'refresh your existing site with modern design and improved performance',
    features: [
      'mobile-optimized',
      '1:1 code preview updates',
      'launch-ready in 1–2 weeks',
      'modern design refresh',
      'speed improvements',
      'seo audit included',
    ],
  },
  {
    id: 'custom',
    title: 'custom blend',
    price: 'starting at $3,500',
    deliveryTime: '3–4 weeks',
    highlighted: true,
    description: 'brand new website built from scratch with custom features',
    features: [
      'mobile-optimized',
      '1:1 code preview updates',
      'launch-ready in 3–4 weeks',
      'custom design & development',
      'cms integration',
      'contact forms & analytics',
      '1 month free support',
    ],
  },
  {
    id: 'full',
    title: 'full flavor',
    price: 'starting at $8,000',
    deliveryTime: '6–8 weeks',
    description: 'complex websites with advanced features and integrations',
    features: [
      'mobile-optimized',
      '1:1 code preview updates',
      'launch-ready in 6–8 weeks',
      'everything in custom blend',
      'advanced functionality',
      'third-party integrations',
      'custom animations',
      'user authentication',
      '3 months free support',
    ],
  },
  {
    id: 'refills',
    title: 'refills',
    price: 'starting at $99/month',
    badge: 'peace of mind',
    description: 'keep your website updated, secure, and performing at its best',
    features: [
      'monthly updates & backups',
      'security monitoring',
      'performance optimization',
      'content updates (2 hours)',
      'priority support',
      'uptime monitoring',
      'monthly reports',
    ],
  },
];

export default function PricingSelector() {
  const [selectedTier, setSelectedTier] = useState('custom'); // Default to highlighted tier

  const currentTier = pricingTiers.find((tier) => tier.id === selectedTier) || pricingTiers[1];

  return (
    <section className="pb-20 bg-cream">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Desktop: Tier selector + single card */}
        <div className="hidden lg:block py-8">
          {/* Tier selector buttons */}
          <div className="flex justify-center gap-4 mb-12">
            {pricingTiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`px-8 py-4 rounded-full font-black border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] transition-all ${
                  selectedTier === tier.id
                    ? 'bg-[#7C3AED] text-white scale-105 shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]'
                    : 'bg-white text-ink hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                }`}
              >
                {tier.title}
              </button>
            ))}
          </div>

          {/* Selected tier card - centered and larger */}
          <div className="max-w-xl mx-auto">
            <PriceCard
              title={currentTier.title}
              price={currentTier.price}
              deliveryTime={currentTier.deliveryTime}
              badge={currentTier.badge}
              highlighted={currentTier.highlighted}
              description={currentTier.description}
              features={currentTier.features}
            />
          </div>
        </div>

        {/* Mobile/Tablet: Carousel */}
        <div className="lg:hidden py-8">
          <div className="relative overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 snap-x snap-mandatory px-4 -mx-4">
              {pricingTiers.map((tier) => (
                <div key={tier.id} className="snap-start flex-shrink-0 w-[85vw] max-w-md">
                  <PriceCard
                    title={tier.title}
                    price={tier.price}
                    deliveryTime={tier.deliveryTime}
                    badge={tier.badge}
                    highlighted={tier.highlighted}
                    description={tier.description}
                    features={tier.features}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Scroll indicator */}
          <div className="flex justify-center gap-2 mt-8">
            <div className="flex items-center gap-2 text-ink/50 text-sm font-bold">
              <Icon icon="ph:swipe-right-duotone" className="w-5 h-5" />
              <span>swipe to see all options</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
