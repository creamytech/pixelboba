'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Sparkles, Lock } from 'lucide-react';
import TierSelectionModal from './TierSelectionModal';

const TIER_CONFIG = {
  'Lite Brew': {
    icon: 'game-icons:boba',
    gradient: 'from-milk-tea to-warm-cream',
    borderColor: 'border-brown-sugar',
    bgColor: 'bg-milk-tea/20',
  },
  'Signature Blend': {
    icon: 'ph:drop-duotone',
    gradient: 'from-thai-tea to-strawberry',
    borderColor: 'border-thai-tea',
    bgColor: 'bg-thai-tea/20',
    popular: true,
  },
  'Taro Cloud': {
    icon: 'ph:cloud-duotone',
    gradient: 'from-deep-taro to-taro',
    borderColor: 'border-taro',
    bgColor: 'bg-taro/20',
  },
};

interface SubscriptionBadgeProps {
  tierName: string | null;
  isActive: boolean;
}

export default function SubscriptionBadge({ tierName, isActive }: SubscriptionBadgeProps) {
  const [showModal, setShowModal] = useState(false);

  // No subscription - show upgrade prompt
  if (!tierName || !isActive) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cream rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group cursor-pointer"
        >
          <Lock
            className="w-4 h-4 text-ink/70 group-hover:text-taro transition-colors"
            strokeWidth={2.5}
          />
          <span className="font-black text-xs text-ink/70 uppercase group-hover:text-taro transition-colors">
            One-Time Client
          </span>
          <div className="w-px h-4 bg-ink/20" />
          <span className="font-bold text-xs text-taro uppercase">Upgrade</span>
        </button>
        <TierSelectionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          currentTier={null}
        />
      </>
    );
  }

  const config = TIER_CONFIG[tierName as keyof typeof TIER_CONFIG];

  if (!config) {
    return null;
  }

  const isPopular = 'popular' in config && config.popular;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 ${config.bgColor} rounded-full border-3 ${config.borderColor} shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group cursor-pointer`}
      >
        <Icon icon={config.icon} className="w-5 h-5 text-ink" />
        <span className="font-black text-xs text-ink uppercase">{tierName}</span>
        {isPopular && (
          <>
            <div className="w-px h-4 bg-ink/20" />
            <Sparkles className="w-3 h-3 text-taro" strokeWidth={3} />
          </>
        )}
      </button>
      <TierSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        currentTier={tierName}
      />
    </>
  );
}
