'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function BobaClubPromo() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-deep-taro via-taro to-[#A78BFA] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Card container */}
          <div className="bg-white border-4 sm:border-[5px] border-ink rounded-2xl sm:rounded-3xl md:rounded-[32px] shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] sm:shadow-[12px_12px_0px_0px_rgba(58,0,29,1)] md:shadow-[16px_16px_0px_0px_rgba(58,0,29,1)] p-8 sm:p-10 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5">
              <div className="bg-[#FDB97A] border-4 border-ink rounded-full px-5 sm:px-6 py-2.5 sm:py-3 shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] rotate-12">
                <p className="font-black text-ink text-xs sm:text-sm uppercase flex items-center gap-1.5 sm:gap-2">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Most Popular
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left side - Content */}
              <div>
                {/* Boba Club Card Image */}
                <div className="mb-6 md:mb-8">
                  <Image
                    src="/boba-club-card.png"
                    alt="Boba Club Membership Card"
                    width={400}
                    height={250}
                    className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] h-auto rounded-xl sm:rounded-2xl border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]"
                    priority
                  />
                </div>

                {/* Heading */}
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-ink mb-4 leading-tight">
                  Join Boba Club
                </h2>

                {/* Subheading */}
                <p className="text-xl sm:text-2xl md:text-3xl text-taro font-black mb-6">
                  Unlimited Web Design + Dev
                </p>

                {/* Description */}
                <p className="text-base sm:text-lg md:text-xl text-ink/70 font-bold mb-8 leading-relaxed">
                  One flat monthly rate. Pause or cancel anytime. No contracts, no surprises. Just
                  unlimited design &amp; development for your growing business.
                </p>

                {/* Features */}
                <ul className="space-y-3 sm:space-y-4 mb-8">
                  {[
                    'Unlimited requests & revisions',
                    'Pause or cancel anytime',
                    'Average 2-3 day delivery',
                    'Fixed monthly rate',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Icon
                        icon="ph:check-circle-duotone"
                        className="w-6 h-6 sm:w-7 sm:h-7 text-matcha flex-shrink-0 mt-0.5"
                      />
                      <span className="text-base sm:text-lg font-bold text-ink">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href="/boba-club"
                  className="inline-flex items-center gap-3 bg-matcha text-ink px-8 sm:px-10 py-4 sm:py-5 rounded-full font-black text-base sm:text-lg border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all uppercase min-h-[56px]"
                >
                  See Pricing & Plans
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
              </div>

              {/* Right side - Pricing highlight */}
              <div className="bg-gradient-to-br from-cream to-[#FDB97A]/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border-4 border-ink/10">
                {/* Starting price */}
                <div className="text-center mb-6">
                  <p className="text-sm sm:text-base font-bold text-ink/60 mb-2 uppercase tracking-wide">
                    Plans Starting At
                  </p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="font-display text-5xl sm:text-6xl md:text-7xl font-black text-ink">
                      $1,500
                    </span>
                    <span className="text-xl sm:text-2xl text-ink/70 font-bold">/mo</span>
                  </div>
                </div>

                {/* Comparison */}
                <div className="bg-white/60 rounded-xl p-4 sm:p-6 border-3 sm:border-4 border-ink/10 mb-6">
                  <p className="text-xs sm:text-sm font-bold text-ink/50 mb-3 uppercase text-center">
                    Compare To
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base font-bold text-ink/70">
                        In-house designer
                      </span>
                      <span className="text-base sm:text-lg font-black text-ink line-through">
                        $80K+/yr
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base font-bold text-ink/70">
                        Design agency
                      </span>
                      <span className="text-base sm:text-lg font-black text-ink line-through">
                        $150/hr+
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base font-bold text-ink/70">
                        Freelancers
                      </span>
                      <span className="text-base sm:text-lg font-black text-ink line-through">
                        $50-100/hr
                      </span>
                    </div>
                  </div>
                </div>

                {/* Money back guarantee */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-matcha/20 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border-2 border-matcha/30">
                    <Icon
                      icon="ph:seal-check-duotone"
                      className="w-5 h-5 sm:w-6 sm:h-6 text-matcha"
                    />
                    <span className="text-xs sm:text-sm font-black text-ink">
                      75% Money Back Guarantee
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
