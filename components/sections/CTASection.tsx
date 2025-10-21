'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CTASection() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="relative text-center bg-white border-[6px] border-ink rounded-[32px] shadow-[16px_16px_0px_0px_rgba(58,0,29,1)] p-12 md:p-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-ink mb-8 leading-tight">
            Ready for More Customers?
          </h2>

          <p className="text-2xl md:text-3xl text-ink/70 font-bold mb-12 max-w-3xl mx-auto leading-tight">
            Get a website that actually brings in business. Fast turnaround, zero hassle, real
            results.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link
              href="/start"
              className="inline-flex items-center justify-center px-12 py-5 bg-gradient-to-br from-taro to-deep-taro text-white text-xl font-black rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              Get Your Free Quote (2 Min) →
            </Link>

            <Link
              href="/work"
              className="inline-flex items-center justify-center px-12 py-5 bg-white text-ink text-xl font-black rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              See Real Examples
            </Link>
          </div>

          <div className="border-t-4 border-ink/20 pt-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
              <div className="text-center">
                <p className="text-base font-black text-ink/60 mb-2">CALL</p>
                <a
                  href="tel:+17542434766"
                  className="text-3xl font-black text-ink hover:text-[#7C3AED] transition-colors"
                >
                  (754) 243-4766
                </a>
              </div>
              <div className="hidden sm:block w-px h-16 bg-ink/20"></div>
              <div className="text-center">
                <p className="text-base font-black text-ink/60 mb-2">EMAIL</p>
                <a
                  href="mailto:hello@pixelboba.com"
                  className="text-2xl font-black text-ink hover:text-[#7C3AED] transition-colors"
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
