'use client';

import { Icon } from '@iconify/react';

const platforms = [
  {
    name: 'Custom Websites',
    description: 'beautiful sites built exactly how you want',
    icon: 'ph:globe-duotone',
  },
  {
    name: 'Online Stores',
    description: 'sell your products online with ease',
    icon: 'ph:shopping-cart-duotone',
  },
  {
    name: 'Easy Updates',
    description: 'update your site yourself anytime',
    icon: 'ph:sparkle-duotone',
  },
];

export default function PlatformsSection() {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-ink mb-6">
            what we <span className="italic text-[#7C3AED]">create</span>
          </h2>
          <p className="text-xl md:text-2xl text-ink/70 font-bold max-w-3xl mx-auto leading-relaxed">
            from online stores to custom websites, we make it all
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all text-center"
            >
              {/* Icon */}
              <div className="mb-6">
                <Icon icon={platform.icon} className="w-16 h-16 text-deep-taro mx-auto" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-black text-ink mb-3">{platform.name}</h3>

              <p className="text-lg font-bold text-ink/70 leading-relaxed">
                {platform.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
