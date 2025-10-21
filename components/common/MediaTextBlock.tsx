'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaTextBlockProps {
  media: ReactNode;
  title: string;
  description: string;
  features?: string[];
  mediaPosition?: 'left' | 'right';
  size?: 'standard' | 'large';
  className?: string;
}

export default function MediaTextBlock({
  media,
  title,
  description,
  features,
  mediaPosition = 'left',
  size = 'standard',
  className,
}: MediaTextBlockProps) {
  return (
    <motion.div
      className={cn(
        'flex flex-col gap-8 md:gap-12',
        mediaPosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse',
        size === 'large' && 'gap-12 md:gap-16',
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-50px' }}
    >
      <div className="flex-1">{media}</div>

      <div className="flex-1 flex flex-col justify-center">
        <h3
          className={cn(
            'font-bold mb-4 text-ink',
            size === 'large' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
          )}
        >
          {title}
        </h3>
        <p className="text-gray-600 mb-6 text-lg">{description}</p>

        {features && features.length > 0 && (
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Check className="w-5 h-5 text-matcha flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
