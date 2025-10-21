'use client';

import { Icon } from '@iconify/react';

interface PriceCardProps {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  deliveryTime?: string;
  badge?: string;
  description?: string;
  isPremium?: boolean;
}

export default function PriceCard({
  title,
  price,
  features,
  highlighted = false,
  deliveryTime,
  badge,
  description,
}: PriceCardProps) {
  const isPremium = title === 'full flavor';

  return (
    <div className="relative">
      {/* Badge for highlighted or special cards */}
      {(highlighted || badge) && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-matcha px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border-3 sm:border-4 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] sm:shadow-none">
            <span className="font-black text-xs sm:text-sm text-white uppercase tracking-wider">
              {highlighted ? 'MOST POPULAR' : badge}
            </span>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div
        className={`h-full bg-white rounded-3xl p-8 md:p-10 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:shadow-[10px_10px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all ${
          highlighted ? 'border-[#FDB97A]' : ''
        } ${isPremium ? 'bg-gradient-to-br from-[#C4B5FD] to-[#A78BFA] text-white' : ''}`}
      >
        {/* Title & Price */}
        <div className="mb-8">
          <h3
            className={`text-3xl md:text-4xl font-black mb-4 ${isPremium ? 'text-white' : 'text-ink'}`}
          >
            {title}
          </h3>
          <div
            className={`text-4xl md:text-5xl font-black mb-4 ${isPremium ? 'text-white' : 'text-[#7C3AED]'}`}
          >
            {price}
          </div>
          {deliveryTime && (
            <div className="flex items-center gap-3 mb-4">
              <Icon icon="ph:timer-duotone" className="w-12 h-12 text-deep-taro" />
              <span className={`text-lg font-bold ${isPremium ? 'text-white/90' : 'text-ink/70'}`}>
                {deliveryTime}
              </span>
            </div>
          )}
          {description && (
            <p
              className={`text-lg font-bold leading-relaxed ${isPremium ? 'text-white/90' : 'text-ink/70'}`}
            >
              {description}
            </p>
          )}
        </div>

        {/* Features List */}
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Icon
                icon="ph:check-circle-duotone"
                className="w-7 h-7 text-matcha flex-shrink-0 mt-0.5"
              />
              <span
                className={`text-lg font-bold leading-snug ${isPremium ? 'text-white/90' : 'text-ink'}`}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
