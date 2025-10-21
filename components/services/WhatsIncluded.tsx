'use client';

import { Icon } from '@iconify/react';

const universalFeatures = [
  {
    icon: 'ph:devices-duotone',
    title: 'Perfect on All Devices',
    description: 'Looks great on phones, tablets & computers',
  },
  {
    icon: 'ph:eye-duotone',
    title: 'See It Live',
    description: 'Watch your site come to life in real-time',
  },
  {
    icon: 'ph:lightning-duotone',
    title: 'Lightning Fast',
    description: 'Quick loading for happy visitors',
  },
  {
    icon: 'ph:lock-duotone',
    title: 'Secure & Safe',
    description: 'Protected and reliable',
  },
  {
    icon: 'ph:chat-circle-dots-duotone',
    title: 'Easy Communication',
    description: 'No endless meetings required',
  },
  {
    icon: 'ph:chart-line-up-duotone',
    title: 'Track Your Visitors',
    description: 'See who visits and what they do',
  },
];

export default function WhatsIncluded() {
  return (
    <section className="py-16 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-ink mb-4">
              included in <span className="italic text-[#7C3AED]">every project</span>
            </h2>
            <p className="text-xl md:text-2xl text-ink/70 font-bold max-w-2xl mx-auto">
              no matter which package you choose, you get these essentials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {universalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border-[3px] md:border-[4px] border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] md:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] md:hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all h-full flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon
                    icon={feature.icon}
                    className="w-12 h-12 md:w-14 md:h-14 text-deep-taro flex-shrink-0"
                  />
                  <Icon
                    icon="ph:check-circle-duotone"
                    className="w-6 h-6 md:w-7 md:h-7 text-matcha flex-shrink-0"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-black text-ink mb-3 leading-tight lowercase">
                  {feature.title}
                </h3>
                <p className="text-ink/70 font-bold text-sm md:text-base leading-relaxed lowercase">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
