'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const values = [
  {
    icon: 'ph:eye-duotone',
    title: 'Previews Not Promises',
    desc: 'You see the real thing as we build it',
  },
  { icon: 'ph:lightning-duotone', title: 'Fewer Hoops', desc: 'Clear process, clean results' },
  {
    icon: 'ph:rocket-launch-duotone',
    title: 'Built to Last',
    desc: 'Fast, accessible, ready for anything',
  },
  {
    icon: 'ph:chart-bar-duotone',
    title: 'Client Dashboard',
    desc: 'Progress, messages, and payments in one place',
  },
];

export default function AboutPageClient() {
  return (
    <div className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero */}
        <div className="text-center mb-24">
          <div className="inline-block bg-[#7C3AED]/10 text-[#7C3AED] px-6 py-3 rounded-full border-2 border-[#7C3AED]/20 mb-8">
            <span className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <Icon icon="ph:sparkle-duotone" className="w-4 h-4" />
              About Us
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-ink mb-8 leading-tight">
            Design + Code That <span className="italic text-[#7C3AED]">Tastes</span> Better Together
          </h1>
          <p className="text-2xl md:text-3xl text-ink/70 font-bold leading-tight max-w-3xl mx-auto">
            Pixel Boba is a small but mighty Fort Lauderdale studio mixing code and creativity. We
            build custom websites that feel as fresh as your favorite drink.
          </p>
        </div>

        {/* Approach */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="bg-white rounded-3xl p-12 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
            <h2 className="text-4xl md:text-5xl font-black text-ink mb-6 text-center">
              Our Approach
            </h2>
            <p className="text-xl md:text-2xl text-ink/70 font-bold leading-relaxed text-center">
              We don&apos;t waste time with endless mockups or long meetings. From day one
              you&apos;ll see your site in action, not on a slideshow. Everything is streamlined and
              simple.
            </p>
          </div>
        </motion.div>

        {/* What Makes Us Different */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-5xl md:text-6xl font-black text-ink mb-12 text-center">
            What Makes Us <span className="italic text-[#7C3AED]">Different</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] h-full">
                  <Icon icon={value.icon} className="w-16 h-16 text-deep-taro mb-4" />
                  <h3 className="text-2xl font-black text-ink mb-3">{value.title}</h3>
                  <p className="text-lg font-bold text-ink/70">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-5xl md:text-6xl font-black text-ink mb-12 text-center">
            Meet the <span className="italic text-[#7C3AED]">Team</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Scott */}
            <div className="bg-gradient-to-br from-[#C4B5FD] to-[#A78BFA] rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src="/Scott.jpg"
                    alt="Scott Benjamin"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-white text-center">
                <h3 className="text-3xl font-black mb-2">Scott Benjamin</h3>
                <p className="text-xl font-bold mb-4 opacity-90">Founder & Developer</p>
                <p className="font-bold mb-4 opacity-90">
                  Fort Lauderdale • Coding since middle school, still fueled by curiosity (and
                  boba).
                </p>
                <p className="text-sm font-bold opacity-75 flex items-center justify-center gap-2">
                  <Icon icon="game-icons:boba" className="w-5 h-5" />
                  Classic milk tea, 50% sweet, extra pearls
                </p>
              </div>
            </div>

            {/* Joel */}
            <div className="bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src="/Jojo.jpg"
                    alt="Joel Armenta"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-white text-center">
                <h3 className="text-3xl font-black mb-2">Joel Armenta</h3>
                <p className="text-xl font-bold mb-4 opacity-90">Artist & Designer</p>
                <p className="font-bold mb-4 opacity-90">
                  Ciudad Obregón • The creative eye behind the visuals, blending illustration with
                  design.
                </p>
                <p className="text-sm font-bold opacity-75 mb-4 flex items-center justify-center gap-2">
                  <Icon icon="game-icons:boba" className="w-5 h-5" />
                  Taro milk tea with mango jelly
                </p>
                <a
                  href="https://www.behance.net/jojopdesign"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-[#7C3AED] px-6 py-3 rounded-full font-black border-2 border-white hover:bg-[#FDB97A] hover:text-ink transition-all"
                >
                  View Portfolio →
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA with cat */}
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute -top-[110px] left-1/2 -translate-x-1/2 z-10">
            <Image
              src="/01.svg"
              alt=""
              width={160}
              height={160}
              className="w-36 h-36 sm:w-40 sm:h-40"
            />
          </div>

          <div className="text-center bg-white border-4 border-ink rounded-3xl shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] p-12 pt-20">
            <h2 className="text-5xl md:text-6xl font-black text-ink mb-6 leading-tight">
              Let&apos;s Make Something Together
            </h2>
            <p className="text-2xl text-ink/70 font-bold mb-8">Your idea, our brew.</p>
            <a
              href="/start"
              className="inline-flex items-center px-12 py-6 bg-[#FDB97A] text-ink text-xl font-black rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              START YOUR PROJECT →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
