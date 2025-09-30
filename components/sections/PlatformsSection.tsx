'use client';

import { motion } from 'framer-motion';

const platforms = [
  {
    name: 'Next.js',
    description: 'full-stack react framework for modern web apps',
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12" fill="currentColor">
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 01-.364.033C7.443.346 4.25 2.185 2.228 5.012A11.875 11.875 0 000 12.035c0 1.048.206 2.051.58 2.965.212.516.53 1.132.949 1.827.16.267.497.771.659.994.071.097.202.27.29.383.31.401.97 1.147 1.572 1.777a11.856 11.856 0 008.202 3.815c.265.03.519.038.763.038.176 0 .433-.01.492-.016 1.872-.183 3.592-.88 5.008-2.032a11.858 11.858 0 002.228-2.145l.001-.001-.077-.061c-.188-.147-1.207-1.607-1.955-2.797l-1.919-3.068-2.405-3.557a4093.17 4093.17 0 00-2.421-3.557c-.01 0-.019 1.578-.024 3.507-.006 3.381-.01 3.517-.052 3.597a.757.757 0 01-.312.406c-.095.057-.177.066-.495.066h-.406l-.108-.068a.844.844 0 01-.157-.171l-.05-.106.005-4.703.007-4.705.072-.092a.793.793 0 01.174-.143c.096-.047.134-.052.54-.052.478 0 .558.019.683.155.035.038 1.337 1.999 2.895 4.361a10759.843 10759.843 0 004.734 7.17l1.9 2.879.096-.063a11.935 11.935 0 002.466-2.163 11.94 11.94 0 002.824-6.134c.096-.659.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695A12.045 12.045 0 0011.572 0zm2.945 8.78c.134 0 .174.019.237.113.045.061.049.117.049 2.502v2.44l-1.445-2.205-1.448-2.205V8.78h1.445z" />
      </svg>
    ),
    color: 'from-slate-700 to-black',
  },
  {
    name: 'Shopify',
    description: 'e-commerce platform for online stores',
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12" fill="currentColor">
        <path d="M14.52 2.469c-.17-.043-.34-.043-.34-.043s-2.062-.212-3.488.637c-.638.373-1.235.745-1.831 1.232-.043 0-.043 0-.085.042-.255-.042-.553-.042-.892.043-1.021.255-1.723 1.063-1.85 2.551-.042.638-.042 1.361-.042 2.126 0 .17 0 .34-.043.51-1.361.68-2.297 1.148-2.297 1.148-.638.255-1.403.468-1.703 1.744-.213 1.063-5.084 39.172-5.084 39.172L37.6 45l-21.869-42.445c-.17-.085-.34-.128-.638-.255l.427.169zm-3.36 2.383c-.298.127-.638.255-.98.425v-.298c0-.425.043-.807.128-1.148.213.085.468.17.723.298.213.127.468.255.638.425-.213.17-.34.34-.51.468zM9.809 3.892c-.085.298-.128.68-.128 1.148v.298c-.51.255-1.063.51-1.616.808.085-.68.255-1.148.468-1.446.298-.51.68-.723 1.276-.808zm-1.894 10.51c.042.425 3.53 1.786 3.53 1.786v7.358s-2.382-.978-3.19-1.361c-.808-.383-1.703-1.234-1.703-2.637V14.32l1.363.084z" />
      </svg>
    ),
    color: 'from-green-600 to-green-800',
  },
  {
    name: 'WordPress',
    description: 'flexible cms for content-driven sites',
    icon: (
      <svg viewBox="0 0 32 32" className="w-12 h-12" fill="currentColor">
        <path d="M2.8 16c0 5.159 2.958 9.631 7.271 11.797l-6.156-16.864c-.719 1.573-1.115 3.313-1.115 5.068zM24.531 15.333c0-1.609-.578-2.724-1.073-3.588-.661-1.073-1.281-1.979-1.281-3.052 0-1.193.901-2.307 2.182-2.307.057 0 .115.007.172.011-2.313-2.12-5.391-3.396-8.755-3.396-4.537 0-8.531 2.333-10.859 5.869.307.011.593.016.839.016 1.359 0 3.469-.167 3.469-.167.703-.043.787.995.084 1.077 0 0-.708.083-1.489.125l4.739 14.093 2.844-8.521-2.021-5.573c-.703-.043-1.365-.125-1.365-.125-.703-.041-.619-1.12.084-1.077 0 0 2.156.167 3.437.167 1.359 0 3.469-.167 3.469-.167.703-.043.787.995.084 1.077 0 0-.703.083-1.489.125l4.704 13.989 1.297-4.333c.557-1.817 0.989-3.12 0.989-4.24zM16.281 17.271l-3.901 11.333c1.161.339 2.395.537 3.677.537 1.515 0 2.968-.26 4.323-.735-.037-.057-.072-.12-.099-.188zM27.463 9.859c.057.421.093.875.093 1.364 0 1.344-.251 2.859-1.011 4.749l-4.063 11.74c3.948-2.307 6.599-6.593 6.599-11.511 0-2.26-.563-4.391-1.557-6.26zM16 0c-8.833 0-16 7.167-16 16s7.167 16 16 16 16-7.167 16-16-7.167-16-16-16zM16 31.333c-8.463 0-15.333-6.869-15.333-15.333s6.869-15.333 15.333-15.333c8.463 0 15.333 6.869 15.333 15.333s-6.869 15.333-15.333 15.333z"></path>
      </svg>
    ),
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
