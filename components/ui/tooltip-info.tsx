'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface TooltipInfoProps {
  text: string;
  className?: string;
}

export function TooltipInfo({ text, className = '' }: TooltipInfoProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-taro/20 hover:bg-taro/30 transition-colors duration-200 ${className}`}
        aria-label="More information"
        type="button"
      >
        <HelpCircle className="w-3.5 h-3.5 text-taro" />
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 z-50"
          >
            <div className="bg-ink text-white px-4 py-3 rounded-xl shadow-xl border-2 border-taro/30 relative">
              <p className="text-sm leading-relaxed">{text}</p>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                <div className="border-8 border-transparent border-t-ink" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
