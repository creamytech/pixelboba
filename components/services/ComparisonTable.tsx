'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const tiers = [
  { name: 'Starter Brew', price: '$1,500' },
  { name: 'Custom Blend', price: '$3,500', popular: true },
  { name: 'Full Flavor', price: '$8,000' },
];

const features = [
  { name: 'Mobile-Optimized Design', starter: true, custom: true, full: true },
  { name: '1:1 Code Preview Updates', starter: true, custom: true, full: true },
  { name: 'Custom Design & Development', starter: false, custom: true, full: true },
  { name: 'CMS Integration', starter: false, custom: true, full: true },
  { name: 'Contact Forms & Analytics', starter: true, custom: true, full: true },
  { name: 'Advanced Functionality', starter: false, custom: false, full: true },
  { name: 'Third-Party Integrations', starter: false, custom: false, full: true },
  { name: 'Custom Animations', starter: false, custom: false, full: true },
  { name: 'User Authentication', starter: false, custom: false, full: true },
  { name: 'Database Integration', starter: false, custom: false, full: true },
  { name: 'Revision Rounds', starter: '2', custom: '3', full: 'Unlimited' },
  { name: 'Free Support Period', starter: 'Launch', custom: '1 Month', full: '3 Months' },
];

export default function ComparisonTable() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4 lowercase">
            compare tiers
          </h2>
          <p className="text-xl text-gray-600 lowercase">find the perfect brew for your needs</p>
        </motion.div>

        {/* Mobile View - Cards */}
        <div className="block lg:hidden space-y-8">
          {tiers.map((tier, tierIndex) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: tierIndex * 0.1 }}
              className={`relative bg-white rounded-2xl p-6 border-2 shadow-lg ${
                tier.popular ? 'border-taro ring-2 ring-taro/20' : 'border-ink/10'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-taro text-white px-4 py-2 rounded-full text-sm font-semibold lowercase">
                    most popular
                  </div>
                </div>
              )}
              <h3 className="font-display text-2xl font-bold text-ink mb-2 lowercase">
                {tier.name}
              </h3>
              <div className="text-3xl font-bold text-taro mb-6 lowercase">{tier.price}</div>
              <div className="space-y-3">
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
                          <Check className="w-5 h-5 text-taro flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )
                      ) : (
                        <div className="w-5 h-5 flex-shrink-0 mt-0.5"></div>
                      )}
                      <span className="text-gray-700 text-sm">
                        {feature.name}
                        {typeof value !== 'boolean' && `: ${value}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block overflow-x-auto">
          <motion.table
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full border-collapse"
          >
            <thead>
              <tr>
                <th className="p-4 text-left font-display text-lg text-gray-600 lowercase border-b-2 border-ink/10">
                  feature
                </th>
                {tiers.map((tier) => (
                  <th
                    key={tier.name}
                    className={`p-4 text-center border-b-2 ${
                      tier.popular ? 'border-taro' : 'border-ink/10'
                    }`}
                  >
                    <div className="relative">
                      {tier.popular && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-taro text-white px-3 py-1 rounded-full text-xs font-semibold lowercase">
                            most popular
                          </div>
                        </div>
                      )}
                      <div className="font-display text-2xl font-bold text-ink mb-2 lowercase">
                        {tier.name}
                      </div>
                      <div className="text-xl font-bold text-taro lowercase">{tier.price}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <motion.tr
                  key={feature.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-ink/5 hover:bg-taro/5 transition-colors"
                >
                  <td className="p-4 text-gray-700 lowercase">{feature.name}</td>
                  <td className="p-4 text-center">
                    {typeof feature.starter === 'boolean' ? (
                      feature.starter ? (
                        <Check className="w-5 h-5 text-taro mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-700 font-medium">{feature.starter}</span>
                    )}
                  </td>
                  <td className="p-4 text-center bg-taro/5">
                    {typeof feature.custom === 'boolean' ? (
                      feature.custom ? (
                        <Check className="w-5 h-5 text-taro mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-700 font-medium">{feature.custom}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {typeof feature.full === 'boolean' ? (
                      feature.full ? (
                        <Check className="w-5 h-5 text-taro mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-700 font-medium">{feature.full}</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      </div>
    </section>
  );
}
