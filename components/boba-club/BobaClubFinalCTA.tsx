'use client';

import CheckoutButton from './CheckoutButton';
import { Icon } from '@iconify/react';

export default function BobaClubFinalCTA() {
  return (
    <section className="py-40 bg-ink relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Big icon */}
          <Icon
            icon="game-icons:boba"
            className="w-32 h-32 md:w-40 md:h-40 text-deep-taro mx-auto mb-12"
          />

          {/* Headline */}
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.9]">
            ready when
            <br />
            <span className="italic text-[#A78BFA]">you are.</span>
          </h2>

          {/* Subheadline */}
          <p className="text-2xl md:text-3xl text-white/70 mb-8 font-bold max-w-2xl mx-auto">
            join boba club and start getting unlimited design work today
          </p>

          {/* Urgency badge */}
          <div className="inline-flex items-center gap-2 bg-[#FDB97A]/20 border-4 border-[#FDB97A] rounded-full px-6 py-3 mb-16">
            <Icon icon="ph:lightning-fill" className="w-6 h-6 text-[#FDB97A]" />
            <span className="text-white font-black text-sm uppercase">
              Limited spots available — we only take 5 new members per month
            </span>
          </div>

          {/* Big CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <CheckoutButton
              size="lg"
              className="group bg-[#FDB97A] hover:bg-[#FDB97A]/90 text-ink px-14 py-8 text-xl font-black rounded-full border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:shadow-[10px_10px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
            >
              Get Started →
            </CheckoutButton>

            <a
              href="mailto:hello@pixelboba.com"
              className="bg-white hover:bg-white/90 border-4 border-ink text-ink px-14 py-8 text-xl font-black rounded-full shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:shadow-[10px_10px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
            >
              Contact Us
            </a>
          </div>

          {/* Trust note */}
          <p className="text-white/50 font-bold text-sm">
            no contracts • pause or cancel anytime • 75% refund in first week
          </p>
        </div>
      </div>
    </section>
  );
}
