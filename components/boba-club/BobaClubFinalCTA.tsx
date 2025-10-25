'use client';

import CheckoutButton from './CheckoutButton';
import { Icon } from '@iconify/react';
import Image from 'next/image';

export default function BobaClubFinalCTA() {
  return (
    <section className="py-20 md:py-32 px-4 md:px-8 bg-cream relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative">
        {/* Cat peeking over */}
        <div className="absolute -top-[110px] left-1/2 -translate-x-1/2 z-10">
          <Image
            src="/01.svg"
            alt=""
            width={160}
            height={160}
            className="w-36 h-36 sm:w-40 sm:h-40"
          />
        </div>

        {/* Main card */}
        <div className="relative bg-white border-4 border-ink rounded-3xl shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] p-8 md:p-16 pt-20">
          {/* Boba icon at top */}
          <div className="mb-8">
            <Icon
              icon="game-icons:boba"
              className="w-24 h-24 md:w-32 md:h-32 text-deep-taro mx-auto"
            />
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-ink mb-6 leading-tight text-center">
            ready when
            <br />
            <span className="italic text-[#7C3AED]">you are.</span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-ink/70 mb-8 font-bold max-w-2xl mx-auto text-center">
            join boba club and start getting unlimited design work today
          </p>

          {/* Urgency badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#FDB97A] border-4 border-ink rounded-full px-6 py-3 shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
              <Icon icon="ph:lightning-fill" className="w-6 h-6 text-ink" />
              <span className="text-ink font-black text-sm uppercase">
                Limited spots available — we only take 5 new members per month
              </span>
            </div>
          </div>

          {/* Big CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <CheckoutButton
              size="lg"
              className="group bg-gradient-to-r from-taro to-deep-taro hover:from-deep-taro hover:to-taro text-white px-12 py-6 text-xl font-black rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
            >
              Get Started →
            </CheckoutButton>

            <a
              href="mailto:hello@pixelboba.com"
              className="bg-white hover:bg-milk-tea/20 border-4 border-ink text-ink px-12 py-6 text-xl font-black rounded-full shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
            >
              Contact Us
            </a>
          </div>

          {/* Trust note */}
          <p className="text-ink/60 font-bold text-sm text-center">
            no contracts • pause or cancel anytime • 75% refund in first week
          </p>
        </div>
      </div>
    </section>
  );
}
