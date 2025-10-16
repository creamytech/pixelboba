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
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 z-[100] pointer-events-none"
          >
            <div className="bg-white text-ink px-5 py-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] border-4 border-ink relative">
              <p className="text-sm leading-relaxed font-semibold">{text}</p>
              {/* Arrow */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-2px]">
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-ink" />
                <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
