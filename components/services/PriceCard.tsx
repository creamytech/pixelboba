'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`
        relative rounded-3xl p-6 border shadow-md w-full min-w-0
        hover:shadow-2xl transition-all duration-300
        ${badge || highlighted ? 'mt-6' : ''}
        ${
          isPremium
            ? 'bg-gradient-to-br from-deep-taro via-taro to-deep-taro border-deep-taro ring-4 ring-taro/20 shadow-taro/30 hover:shadow-taro/50'
            : highlighted
              ? 'bg-white border-taro ring-2 ring-taro/30 bg-gradient-to-br from-white to-taro/5 shadow-taro/20 hover:shadow-taro/30'
              : 'bg-white border-ink/10 hover:border-taro/50 hover:ring-2 hover:ring-taro/10'
        }
      `}
    >
      {/* Premium sparkle effect */}
      {isPremium && (
        <>
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div className="absolute top-4 right-4">
            <Sparkles className="w-6 h-6 text-white/60" />
          </div>
        </>
      )}

      {highlighted && !isPremium && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-taro text-white px-4 py-2 rounded-full text-sm font-semibold lowercase shadow-lg">
            most popular
          </div>
        </div>
      )}

      {badge && !highlighted && !isPremium && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-matcha text-white px-4 py-2 rounded-full text-sm font-semibold lowercase shadow-lg">
            {badge}
          </div>
        </div>
      )}

      {/* Pearl decoration for non-premium cards */}
      {!deliveryTime && !isPremium && (
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-taro/40 rounded-full"></div>
        </div>
      )}

      <div className="mb-6 relative">
        <h3
          className={`font-display text-2xl font-bold mb-4 lowercase break-words ${
            isPremium ? 'text-white' : 'text-ink'
          }`}
        >
          {title}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <div
            className={`text-3xl md:text-4xl lg:text-5xl font-black lowercase leading-none break-words ${
              isPremium ? 'text-white' : 'text-taro'
            }`}
          >
            {price}
          </div>
        </div>
        {deliveryTime && (
          <div className="flex items-center gap-2 mb-2">
            <svg
              className={`w-4 h-4 flex-shrink-0 ${isPremium ? 'text-white/80' : 'text-matcha'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span
              className={`text-sm font-medium lowercase break-words ${
                isPremium ? 'text-white/90' : 'text-gray-600'
              }`}
            >
              {deliveryTime}
            </span>
          </div>
        )}
        {description && (
          <p
            className={`mt-3 text-sm lowercase leading-relaxed break-words ${
              isPremium ? 'text-white/90' : 'text-gray-600'
            }`}
          >
            {description}
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-2">
              <div
                className={`w-2 h-2 rounded-full ${isPremium ? 'bg-white/80' : 'bg-matcha'}`}
              ></div>
            </div>
            <span
              className={`lowercase leading-relaxed break-words ${
                isPremium ? 'text-white/90' : 'text-gray-600'
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
