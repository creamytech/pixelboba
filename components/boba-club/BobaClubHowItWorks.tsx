'use client';

import { Icon } from '@iconify/react';

const steps = [
  {
    number: '01',
    icon: 'ph:target-duotone',
    title: 'Subscribe',
    description: 'Pick a plan and get started today.',
  },
  {
    number: '02',
    icon: 'ph:note-duotone',
    title: 'Request',
    description: 'Tell us what you need—unlimited requests.',
  },
  {
    number: '03',
    icon: 'ph:lightning-duotone',
    title: 'Receive',
    description: 'Get beautiful work delivered fast.',
  },
  {
    number: '04',
    icon: 'ph:arrows-clockwise-duotone',
    title: 'Revise',
    description: 'Tweak it until it is perfect.',
  },
  {
    number: '05',
    icon: 'ph:confetti-duotone',
    title: 'Repeat',
    description: 'Keep going or pause anytime.',
  },
];

export default function BobaClubHowItWorks() {
  return (
    <section className="py-32 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-ink mb-4">
            simple as
            <br />
            <span className="italic text-[#7C3AED]">boba.</span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white border-4 border-ink rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex flex-col"
            >
              {/* Icon */}
              <Icon icon={step.icon} className="w-16 h-16 text-deep-taro mx-auto mb-4" />

              {/* Number badge */}
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#7C3AED] text-white rounded-full font-black text-xl mb-4 shadow-lg self-center border-[3px] border-ink">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-black text-ink lowercase mb-2 text-center">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-ink/70 font-bold text-base leading-snug text-center">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
