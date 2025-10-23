'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { X, Sparkles, Check, TrendingUp, Loader2 } from 'lucide-react';

const TIERS = [
  {
    name: 'Lite Brew',
    icon: 'game-icons:boba',
    price: 1500,
    priceId: process.env.NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID || '',
    description: 'Perfect for solo founders or startups',
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
    borderColor: 'border-brown-sugar',
  },
  {
    name: 'Signature Blend',
    icon: 'ph:drop-duotone',
    price: 3000,
    priceId: process.env.NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID || '',
    description: 'Our most popular — built for growing teams',
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
    gradient: 'from-thai-tea to-strawberry',
    borderColor: 'border-thai-tea',
    popular: true,
  },
  {
    name: 'Taro Cloud',
    icon: 'ph:cloud-duotone',
    price: 6000,
    priceId: process.env.NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID || '',
    description: 'Full creative power, unlimited brands, and real-time collaboration',
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
  },
];

interface TierSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: string | null;
}

export default function TierSelectionModal({
  isOpen,
  onClose,
  currentTier,
}: TierSelectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectTier = async (priceId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Redirect to Stripe checkout
      const response = await fetch('/api/boba-club/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-cream rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-milk-tea to-cream border-b-4 border-ink p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="font-black text-3xl text-ink uppercase mb-2">Choose Your Plan</h2>
                <p className="text-ink/70 font-bold">
                  Select a Boba Club tier to unlock full portal access
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full border-3 border-ink bg-white hover:bg-cream transition-colors shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                <X className="w-6 h-6 mx-auto" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-6 bg-strawberry/20 border-3 border-strawberry rounded-lg p-4">
                <p className="text-strawberry font-bold">{error}</p>
              </div>
            )}

            {/* Tiers Grid */}
            <div className="p-6 grid md:grid-cols-3 gap-6">
              {TIERS.map((tier) => {
                const isCurrent = tier.name === currentTier;

                return (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    {/* Popular Badge */}
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                        <div className="bg-thai-tea border-3 border-ink rounded-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]">
                          <p className="font-black text-ink text-xs uppercase flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" strokeWidth={3} />
                            Most Popular
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tier Card */}
                    <div
                      className={`bg-white rounded-xl border-4 ${tier.borderColor} shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all p-6 h-full flex flex-col ${
                        isCurrent ? 'ring-4 ring-matcha' : ''
                      }`}
                    >
                      {/* Icon */}
                      <div className="mb-4">
                        <Icon icon={tier.icon} className="w-16 h-16 text-taro" />
                      </div>

                      {/* Tier Name */}
                      <h3 className="font-black text-2xl text-ink uppercase mb-2">{tier.name}</h3>
                      <p className="text-ink/70 font-bold text-sm mb-4">{tier.description}</p>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="font-black text-4xl text-ink">
                            ${tier.price.toLocaleString()}
                          </span>
                          <span className="text-lg text-ink/70 font-bold">/month</span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 mb-6 flex-1">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check
                              className="w-5 h-5 text-matcha flex-shrink-0 mt-0.5"
                              strokeWidth={3}
                            />
                            <span className="text-ink font-bold text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      {isCurrent ? (
                        <div className="px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] uppercase text-center">
                          Current Plan
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSelectTier(tier.priceId)}
                          disabled={loading}
                          className="px-6 py-3 bg-taro text-white font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              Select Plan
                              <TrendingUp className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t-4 border-ink p-6 bg-gradient-to-r from-milk-tea to-cream">
              <div className="flex items-center justify-center gap-3 text-center">
                <Icon icon="ph:seal-check-duotone" className="w-6 h-6 text-matcha" />
                <p className="font-black text-ink uppercase text-sm">
                  75% Money Back Guarantee • Pause or Cancel Anytime
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
