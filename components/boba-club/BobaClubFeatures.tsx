'use client';

import { Icon } from '@iconify/react';

const includedFeatures = [
  {
    icon: 'ph:infinity-duotone',
    text: 'Unlimited design & website requests',
    color: 'text-deep-taro',
  },
  { icon: 'ph:lightning-duotone', text: 'Fast turnaround every time', color: 'text-matcha' },
  {
    icon: 'ph:arrows-clockwise-duotone',
    text: 'Unlimited revisions until perfect',
    color: 'text-deep-taro',
  },
  { icon: 'ph:clock-duotone', text: 'Fast turnaround times', color: 'text-matcha' },
  { icon: 'ph:globe-duotone', text: 'Custom websites built from scratch', color: 'text-deep-taro' },
  { icon: 'ph:storefront-duotone', text: 'Online stores & e-commerce sites', color: 'text-matcha' },
  {
    icon: 'ph:palette-duotone',
    text: 'Logos, branding & visual identity',
    color: 'text-deep-taro',
  },
  { icon: 'ph:sparkle-duotone', text: 'Beautiful designs & illustrations', color: 'text-matcha' },
  {
    icon: 'ph:device-mobile-duotone',
    text: 'Social media graphics & marketing materials',
    color: 'text-deep-taro',
  },
  {
    icon: 'ph:envelope-simple-duotone',
    text: 'Email designs, presentations & landing pages',
    color: 'text-matcha',
  },
  { icon: 'ph:link-duotone', text: 'Custom features & integrations', color: 'text-deep-taro' },
  { icon: 'ph:users-duotone', text: '1-5 team members included', color: 'text-matcha' },
  { icon: 'ph:folder-duotone', text: 'You own everything we create', color: 'text-deep-taro' },
  {
    icon: 'ph:pause-circle-duotone',
    text: 'Pause or cancel anytime, no contracts',
    color: 'text-matcha',
  },
];

const notIncluded = [
  { icon: 'ph:x-circle-duotone', text: '3D animations or video production' },
  { icon: 'ph:x-circle-duotone', text: 'Mobile apps (iOS/Android apps)' },
  { icon: 'ph:x-circle-duotone', text: 'Copywriting or photography' },
  { icon: 'ph:x-circle-duotone', text: 'Print design or physical products' },
];

export default function BobaClubFeatures() {
  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-ink mb-4">
            everything your brand needs to{' '}
            <span className="italic text-[#7C3AED]">build & grow</span>
          </h2>
          <p className="text-xl md:text-2xl text-ink/70 font-bold max-w-2xl mx-auto">
            All the flavor, no limits. Get unlimited access to professional web development and
            design services.
          </p>
        </div>

        {/* Included Features Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-3xl font-black text-ink mb-8 text-center">included</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {includedFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <Icon icon={feature.icon} className={`w-10 h-10 ${feature.color}`} />
                  </div>

                  <div className="flex-1">
                    <p className="text-ink font-bold leading-relaxed">{feature.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Not Included Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-black text-ink mb-8 text-center">not included</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notIncluded.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white rounded-2xl p-4 border-2 border-ink/20"
              >
                <Icon icon={item.icon} className="w-8 h-8 text-ink/30" />
                <p className="text-ink/60 font-bold">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
