'use client';

import { motion } from 'framer-motion';

const platforms = [
  {
    name: 'Next.js',
    description: 'full-stack react framework for modern web apps',
    icon: <span className="text-3xl font-black">N</span>,
    color: 'from-slate-700 to-black',
  },
  {
    name: 'Shopify',
    description: 'e-commerce platform for online stores',
    icon: <span className="text-3xl font-black">S</span>,
    color: 'from-green-600 to-green-800',
  },
  {
    name: 'WordPress',
    description: 'flexible cms for content-driven sites',
    icon: <span className="text-3xl font-black">W</span>,
    color: 'from-blue-600 to-blue-800',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function PlatformsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-6 lowercase">
            platforms we love
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto lowercase leading-relaxed">
            from e-commerce to custom web apps, we work with the best tools to bring your vision to
            life
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              variants={cardVariants}
              whileHover={{
                y: -8,
                transition: { type: 'spring', stiffness: 400, damping: 30 },
              }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Background gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              <div className="flex flex-col items-center text-center">
                {/* Icon with gradient background */}
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                >
                  {platform.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-ink mb-3 lowercase group-hover:text-gray-800 transition-colors">
                  {platform.name}
                </h3>

                <p className="text-gray-600 lowercase leading-relaxed group-hover:text-gray-700 transition-colors">
                  {platform.description}
                </p>
              </div>

              {/* Decorative pearl */}
              <div className="absolute top-6 right-6 w-2 h-2 bg-taro/20 rounded-full group-hover:bg-taro/40 transition-colors duration-300" />

              {/* Bottom accent line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${platform.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Pearl divider */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-taro/40 rounded-full"></div>
            <div className="w-3 h-3 bg-matcha/50 rounded-full"></div>
            <div className="w-2 h-2 bg-milk-tea/60 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
