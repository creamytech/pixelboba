'use client';

import { Icon } from '@iconify/react';

const tiers = [
  { name: 'Starter Brew', price: '$1,500' },
  { name: 'Custom Blend', price: '$3,500', popular: true },
  { name: 'Full Flavor', price: '$8,000' },
];

const features = [
  { name: 'Works perfectly on phones & tablets', starter: true, custom: true, full: true },
  { name: 'Live previews as we build', starter: true, custom: true, full: true },
  { name: 'Fully custom design', starter: false, custom: true, full: true },
  { name: 'Easy content management', starter: false, custom: true, full: true },
  { name: 'Contact forms & visitor tracking', starter: true, custom: true, full: true },
  { name: 'Advanced features & functionality', starter: false, custom: false, full: true },
  { name: 'Connect your tools & services', starter: false, custom: false, full: true },
  { name: 'Custom animations & effects', starter: false, custom: false, full: true },
  { name: 'User login & accounts', starter: false, custom: false, full: true },
  { name: 'Custom databases & data', starter: false, custom: false, full: true },
  { name: 'Design changes included', starter: '2 rounds', custom: '3 rounds', full: 'Unlimited' },
  { name: 'Free support after launch', starter: 'At launch', custom: '1 month', full: '3 months' },
];

export default function ComparisonTable() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 md:px-8 bg-cream">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-ink mb-4 sm:mb-6">
            compare <span className="italic text-[#7C3AED]">tiers</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-ink/70">
            find the perfect brew for your needs
          </p>
        </div>

        {/* Mobile View - Cards */}
        <div className="block lg:hidden space-y-10">
          {tiers.map((tier, tierIndex) => (
            <div
              key={tier.name}
              className={`relative bg-white rounded-3xl p-8 md:p-10 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] ${
                tier.popular ? 'border-[#FDB97A]' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-matcha px-6 py-2 rounded-full border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
                    <span className="font-black text-sm text-white uppercase">most popular</span>
                  </div>
                </div>
              )}
              <h3 className="text-3xl md:text-4xl font-black text-ink mb-3">{tier.name}</h3>
              <div className="text-4xl md:text-5xl font-black text-[#7C3AED] mb-8">
                {tier.price}
              </div>
              <div className="space-y-4">
                {features.map((feature) => {
                  const value =
                    tierIndex === 0
                      ? feature.starter
                      : tierIndex === 1
                        ? feature.custom
                        : feature.full;
                  return (
                    <div key={feature.name} className="flex items-start gap-3">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <Icon
                            icon="ph:check-circle-duotone"
                            className="w-7 h-7 text-matcha flex-shrink-0 mt-0.5"
                          />
                        ) : (
                          <Icon
                            icon="ph:x-circle-duotone"
                            className="w-7 h-7 text-ink/30 flex-shrink-0 mt-0.5"
                          />
                        )
                      ) : (
                        <Icon
                          icon="ph:sparkle-duotone"
                          className="w-7 h-7 text-deep-taro flex-shrink-0 mt-0.5"
                        />
                      )}
                      <div className="flex-1">
                        <span className="text-lg font-bold text-ink block leading-snug">
                          {feature.name}
                        </span>
                        {typeof value !== 'boolean' && (
                          <span className="text-lg font-black text-[#7C3AED] block mt-1">
                            {value}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-3xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-cream border-b-4 border-ink">
                  <th className="p-8 text-left text-2xl font-black text-ink">feature</th>
                  {tiers.map((tier) => (
                    <th key={tier.name} className="p-8 text-center relative">
                      {tier.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <div className="bg-matcha px-6 py-2 rounded-full border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
                            <span className="font-black text-sm text-white uppercase">popular</span>
                          </div>
                        </div>
                      )}
                      <div className="text-3xl font-black text-ink mb-3">{tier.name}</div>
                      <div className="text-4xl font-black text-[#7C3AED]">{tier.price}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={feature.name}
                    className={`border-b-2 border-ink/10 hover:bg-cream/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-cream/30'
                    }`}
                  >
                    <td className="p-8 text-lg font-bold text-ink">{feature.name}</td>
                    <td className="p-6 text-center">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? (
                          <Icon
                            icon="ph:check-circle-duotone"
                            className="w-10 h-10 text-matcha mx-auto"
                          />
                        ) : (
                          <Icon
                            icon="ph:x-circle-duotone"
                            className="w-10 h-10 text-ink/30 mx-auto"
                          />
                        )
                      ) : (
                        <div>
                          <Icon
                            icon="ph:sparkle-duotone"
                            className="w-8 h-8 text-deep-taro mx-auto mb-1"
                          />
                          <span className="text-lg font-black text-[#7C3AED]">
                            {feature.starter}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-6 text-center bg-[#7C3AED]/5">
                      {typeof feature.custom === 'boolean' ? (
                        feature.custom ? (
                          <Icon
                            icon="ph:check-circle-duotone"
                            className="w-10 h-10 text-matcha mx-auto"
                          />
                        ) : (
                          <Icon
                            icon="ph:x-circle-duotone"
                            className="w-10 h-10 text-ink/30 mx-auto"
                          />
                        )
                      ) : (
                        <div>
                          <Icon
                            icon="ph:sparkle-duotone"
                            className="w-8 h-8 text-deep-taro mx-auto mb-1"
                          />
                          <span className="text-lg font-black text-[#7C3AED]">
                            {feature.custom}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {typeof feature.full === 'boolean' ? (
                        feature.full ? (
                          <Icon
                            icon="ph:check-circle-duotone"
                            className="w-10 h-10 text-matcha mx-auto"
                          />
                        ) : (
                          <Icon
                            icon="ph:x-circle-duotone"
                            className="w-10 h-10 text-ink/30 mx-auto"
                          />
                        )
                      ) : (
                        <div>
                          <Icon
                            icon="ph:sparkle-duotone"
                            className="w-8 h-8 text-deep-taro mx-auto mb-1"
                          />
                          <span className="text-lg font-black text-[#7C3AED]">{feature.full}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
