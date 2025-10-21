'use client';

import { Icon } from '@iconify/react';

const steps = [
  {
    number: '01',
    icon: 'ph:note-duotone',
    title: 'fill out our quick form',
    description: 'tell us about your project in just 2 minutes',
  },
  {
    number: '02',
    icon: 'ph:chat-circle-dots-duotone',
    title: 'share your vision & budget',
    description: 'let us know what you need and your budget range',
  },
  {
    number: '03',
    icon: 'ph:envelope-duotone',
    title: 'get your custom proposal',
    description: 'receive pricing and timeline within 24 hours',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-ink mb-4">
              how it <span className="italic text-[#7C3AED]">works</span>
            </h2>
            <p className="text-xl md:text-2xl text-ink/70 font-bold">
              simple, transparent, no phone calls required
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-cream rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all text-center"
              >
                <Icon icon={step.icon} className="w-16 h-16 text-deep-taro mx-auto mb-4" />
                <div className="inline-block bg-[#7C3AED] text-white px-4 py-2 rounded-full font-black text-lg mb-4 border-[3px] border-ink">
                  {step.number}
                </div>
                <h3 className="text-2xl font-black text-ink mb-3">{step.title}</h3>
                <p className="text-lg font-bold text-ink/70 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg font-bold text-ink/60 flex items-center justify-center gap-2">
              <Icon icon="ph:lightbulb-duotone" className="w-6 h-6 text-matcha" />
              no phone calls, no meetings, no pressure—just clear email communication
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
