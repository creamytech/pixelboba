'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  CreditCard,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import TierSelectionModal from './TierSelectionModal';

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
  },
];

interface Subscription {
  id: string;
  status: string;
  stripePriceId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  pausedAt?: string;
}

export default function BillingCenter() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTierSelectionModal, setShowTierSelectionModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portal/subscription');
      if (!response.ok) throw new Error('Failed to fetch subscription');
      const data = await response.json();
      setSubscription(data.subscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTier = () => {
    if (!subscription) return null;
    return TIERS.find((tier) => tier.priceId === subscription.stripePriceId);
  };

  const handleChangePlan = async (newPriceId: string) => {
    try {
      setActionLoading(true);
      const response = await fetch('/api/portal/subscription/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPriceId }),
      });

      if (!response.ok) throw new Error('Failed to change plan');

      await fetchSubscription();
      setShowChangePlanModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setActionLoading(true);
      const response = await fetch('/api/portal/subscription/cancel', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to cancel subscription');

      await fetchSubscription();
      setShowCancelModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeSubscription = async () => {
    try {
      setActionLoading(true);
      const response = await fetch('/api/portal/subscription/resume', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to resume subscription');

      await fetchSubscription();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const currentTier = getCurrentTier();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-taro animate-spin" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <>
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-8 text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] mx-auto mb-6 flex items-center justify-center">
            <Icon icon="ph:empty-duotone" className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-black text-2xl text-ink uppercase mb-3">No Active Subscription</h3>
          <p className="text-ink/70 font-bold mb-6">
            You don&apos;t have an active Boba Club subscription. Choose a plan below to unlock
            premium features.
          </p>
        </div>

        {/* Tier Selection for Non-Subscribers */}
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-8">
          <h3 className="font-black text-2xl text-ink uppercase mb-6 text-center">
            Choose Your Plan
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`bg-white rounded-xl border-4 ${tier.gradient.includes('thai-tea') ? 'border-thai-tea' : tier.gradient.includes('taro') ? 'border-taro' : 'border-brown-sugar'} shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all p-6 flex flex-col relative`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-matcha text-ink font-black text-xs rounded-full border-2 border-ink uppercase">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}
                <Icon icon={tier.icon} className="w-16 h-16 text-taro mb-4" />
                <h4 className="font-black text-2xl text-ink uppercase mb-2">{tier.name}</h4>
                <p className="text-ink/70 font-bold text-sm mb-4">{tier.description}</p>

                <div className="mb-6">
                  <span className="font-black text-4xl text-ink">
                    ${tier.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-ink/70 font-bold">/month</span>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Icon
                        icon="ph:check-circle-duotone"
                        className="w-5 h-5 text-matcha flex-shrink-0 mt-0.5"
                      />
                      <span className="text-ink font-bold text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setShowTierSelectionModal(true)}
                  className="w-full px-6 py-3 bg-taro text-white font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase flex items-center justify-center gap-2"
                >
                  Select Plan
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <TierSelectionModal
          isOpen={showTierSelectionModal}
          onClose={() => setShowTierSelectionModal(false)}
          currentTier={null}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-strawberry/20 border-3 border-strawberry rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-strawberry flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-strawberry font-bold">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-strawberry hover:text-strawberry/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Current Plan Card */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-black text-2xl text-ink uppercase mb-2">Current Plan</h2>
            <p className="text-ink/70 font-bold">Manage your Boba Club subscription</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {currentTier && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Plan Details */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Icon icon={currentTier.icon} className="w-12 h-12 text-taro" />
                <div>
                  <h3 className="font-black text-xl text-ink uppercase">{currentTier.name}</h3>
                  <p className="text-ink/70 font-bold text-sm">{currentTier.description}</p>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-black text-4xl text-ink">
                  ${currentTier.price.toLocaleString()}
                </span>
                <span className="text-lg text-ink/70 font-bold">/month</span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-4">
                {subscription.status === 'ACTIVE' && !subscription.cancelAtPeriodEnd && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-matcha text-ink font-black text-xs rounded-full border-2 border-ink uppercase">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                )}
                {subscription.cancelAtPeriodEnd && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-thai-tea text-ink font-black text-xs rounded-full border-2 border-ink uppercase">
                    <AlertCircle className="w-3 h-3" />
                    Cancels on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                )}
                {subscription.pausedAt && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream text-ink font-black text-xs rounded-full border-2 border-ink uppercase">
                    <Icon icon="ph:pause-circle-duotone" className="w-3 h-3" />
                    Paused
                  </span>
                )}
              </div>

              {/* Billing Period */}
              <div className="bg-cream rounded-lg border-3 border-ink p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-taro" />
                  <span className="font-black text-xs text-ink uppercase">Current Period</span>
                </div>
                <p className="text-ink font-bold">
                  {new Date(subscription.currentPeriodStart).toLocaleDateString()} -{' '}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {!subscription.cancelAtPeriodEnd && (
                <>
                  <button
                    onClick={() => setShowChangePlanModal(true)}
                    className="w-full px-6 py-3 bg-taro text-white font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
                  >
                    Change Plan
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full px-6 py-3 bg-white text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
                  >
                    Cancel Subscription
                  </button>
                </>
              )}
              {subscription.cancelAtPeriodEnd && (
                <button
                  onClick={handleResumeSubscription}
                  disabled={actionLoading}
                  className="w-full px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Resume Subscription'
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Change Plan Modal */}
      {showChangePlanModal && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b-4 border-ink p-6 flex items-center justify-between z-10">
              <h3 className="font-black text-2xl text-ink uppercase">Change Your Plan</h3>
              <button
                onClick={() => setShowChangePlanModal(false)}
                className="w-10 h-10 rounded-full border-3 border-ink hover:bg-cream transition-colors"
              >
                <X className="w-5 h-5 mx-auto" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {TIERS.map((tier) => {
                const isCurrent = tier.priceId === subscription?.stripePriceId;
                const isUpgrade = tier.price > (currentTier?.price || 0);
                const isDowngrade = tier.price < (currentTier?.price || 0);

                return (
                  <div
                    key={tier.name}
                    className={`bg-white rounded-xl border-3 border-ink p-6 ${
                      isCurrent ? 'bg-cream/30' : ''
                    }`}
                  >
                    <div className="grid md:grid-cols-3 gap-4 items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Icon icon={tier.icon} className="w-8 h-8 text-taro" />
                          <h4 className="font-black text-lg text-ink uppercase">{tier.name}</h4>
                        </div>
                        <p className="text-ink/70 font-bold text-sm mb-3">{tier.description}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="font-black text-3xl text-ink">
                            ${tier.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-ink/70 font-bold">/month</span>
                        </div>
                      </div>

                      <div className="md:col-span-2 flex items-center justify-between gap-4">
                        <ul className="space-y-2 flex-1">
                          {tier.features.slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Icon
                                icon="ph:check-circle-duotone"
                                className="w-5 h-5 text-matcha flex-shrink-0"
                              />
                              <span className="text-ink font-bold">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {isCurrent ? (
                          <span className="px-4 py-2 bg-matcha text-ink font-black text-sm rounded-full border-2 border-ink uppercase whitespace-nowrap">
                            Current Plan
                          </span>
                        ) : (
                          <button
                            onClick={() => handleChangePlan(tier.priceId)}
                            disabled={actionLoading}
                            className={`px-6 py-3 font-black rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase whitespace-nowrap disabled:opacity-50 flex items-center gap-2 ${
                              isUpgrade ? 'bg-matcha text-ink' : 'bg-white text-ink'
                            }`}
                          >
                            {actionLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                {isUpgrade ? (
                                  <>
                                    Upgrade <TrendingUp className="w-4 h-4" />
                                  </>
                                ) : (
                                  <>
                                    Downgrade <TrendingDown className="w-4 h-4" />
                                  </>
                                )}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] max-w-md w-full"
          >
            <div className="border-b-4 border-ink p-6">
              <h3 className="font-black text-2xl text-ink uppercase">Cancel Subscription</h3>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-strawberry/20 rounded-full border-3 border-strawberry flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-strawberry" />
              </div>
              <p className="text-ink font-bold text-center mb-6">
                Are you sure you want to cancel your subscription? You&apos;ll continue to have
                access until{' '}
                <span className="font-black">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
                .
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-6 py-3 bg-white text-ink font-black rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
                >
                  Keep Plan
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-strawberry text-white font-black rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Cancel'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
