'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CTASection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-cream">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative">
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

        <div className="relative text-center bg-white border-4 sm:border-[5px] md:border-[6px] border-ink rounded-2xl sm:rounded-3xl md:rounded-[32px] shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] sm:shadow-[12px_12px_0px_0px_rgba(58,0,29,1)] md:shadow-[16px_16px_0px_0px_rgba(58,0,29,1)] p-8 sm:p-10 md:p-12 lg:p-16 pt-12 sm:pt-14 md:pt-16 lg:pt-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-ink mb-6 sm:mb-8 leading-tight">
            Ready for More Customers?
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-ink/70 font-bold mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-tight px-4">
            Get a website that actually brings in business. Fast turnaround, zero hassle, real
            results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-10 md:mb-12">
            <Link
              href="/start"
              className="inline-flex items-center justify-center min-h-[56px] px-8 sm:px-10 md:px-12 py-5 bg-gradient-to-br from-taro to-deep-taro text-white text-lg sm:text-xl font-black rounded-full border-3 sm:border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] active:shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] md:hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] md:hover:translate-x-[-2px] md:hover:translate-y-[-2px] transition-all"
            >
              Get Your Free Quote (2 Min) →
            </Link>

            <Link
              href="/work"
              className="inline-flex items-center justify-center min-h-[56px] px-8 sm:px-10 md:px-12 py-5 bg-white text-ink text-lg sm:text-xl font-black rounded-full border-3 sm:border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] active:shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] md:hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] md:hover:translate-x-[-2px] md:hover:translate-y-[-2px] transition-all"
            >
              See Real Examples
            </Link>
          </div>

          <div className="border-t-3 sm:border-t-4 border-ink/20 pt-6 sm:pt-8 md:pt-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12">
              <div className="text-center min-h-[44px] flex flex-col justify-center">
                <p className="text-sm sm:text-base font-black text-ink/60 mb-2">CALL</p>
                <a
                  href="tel:+17542434766"
                  className="text-2xl sm:text-3xl font-black text-ink hover:text-[#7C3AED] transition-colors"
                >
                  (754) 243-4766
                </a>
              </div>
              <div className="hidden sm:block w-px h-12 sm:h-16 bg-ink/20"></div>
              <div className="w-full sm:w-px h-px sm:h-auto bg-ink/20 sm:hidden"></div>
              <div className="text-center min-h-[44px] flex flex-col justify-center">
                <p className="text-sm sm:text-base font-black text-ink/60 mb-2">EMAIL</p>
                <a
                  href="mailto:hello@pixelboba.com"
                  className="text-lg sm:text-xl md:text-2xl font-black text-ink hover:text-[#7C3AED] transition-colors break-all sm:break-normal"
                >
                  hello@pixelboba.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
