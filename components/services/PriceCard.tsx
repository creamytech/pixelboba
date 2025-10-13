'use client';

import { motion } from 'framer-motion';

interface PriceCardProps {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  deliveryTime?: string;
  badge?: string;
  description?: string;
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`
        relative bg-white rounded-xl p-8 border shadow-sm
        hover:shadow-lg transition-all duration-300
        ${
          highlighted
            ? 'border-taro ring-2 ring-taro/20 bg-gradient-to-br from-white to-taro/5'
            : 'border-ink/10 hover:border-taro/30'
        }
      `}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-taro text-white px-4 py-2 rounded-full text-sm font-semibold lowercase">
            most popular
          </div>
        </div>
      )}

      {badge && !highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-matcha text-white px-4 py-2 rounded-full text-sm font-semibold lowercase">
            {badge}
          </div>
        </div>
      )}

      {/* Pearl decoration */}
      {!deliveryTime && (
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-taro/40 rounded-full"></div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-display text-2xl font-bold text-ink mb-4 lowercase">{title}</h3>
        <div className="flex items-baseline gap-2 mb-3">
          <div className="text-4xl md:text-5xl font-black text-taro lowercase leading-none">
            {price}
          </div>
        </div>
        {deliveryTime && (
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-matcha"
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
            <span className="text-sm font-medium text-gray-600 lowercase">{deliveryTime}</span>
          </div>
        )}
        {description && (
          <p className="text-gray-600 mt-3 text-sm lowercase leading-relaxed">{description}</p>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0 mt-2">
              <div className="w-2 h-2 bg-matcha rounded-full"></div>
            </div>
            <span className="ml-3 text-gray-600 lowercase">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
