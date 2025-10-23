'use client';

import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface LockedFeatureProps {
  title: string;
  description: string;
  requiredTier?: string;
  children?: React.ReactNode;
}

export default function LockedFeature({
  title,
  description,
  requiredTier = 'any Boba Club tier',
  children,
}: LockedFeatureProps) {
  return (
    <div className="relative">
      {/* Blurred content (if children provided) */}
      {children && (
        <div className="pointer-events-none select-none blur-sm opacity-30">{children}</div>
      )}

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${children ? 'absolute inset-0' : ''} flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-8`}
      >
        <div className="text-center max-w-md">
          {/* Lock Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>

          {/* Title */}
          <h3 className="font-black text-xl text-ink uppercase mb-2">{title}</h3>

          {/* Description */}
          <p className="text-ink/70 font-bold mb-4">{description}</p>

          {/* Required Tier Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-taro/10 rounded-full border-2 border-taro mb-6">
            <Sparkles className="w-4 h-4 text-taro" strokeWidth={2.5} />
            <span className="font-black text-xs text-taro uppercase">Requires {requiredTier}</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/boba-club"
              className="px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
            >
              View Plans
            </Link>
            <Link
              href="/billing"
              className="px-6 py-3 bg-white text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
            >
              Manage Subscription
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
