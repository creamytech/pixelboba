'use client';

import { motion } from 'framer-motion';

const platforms = [
  {
    name: 'Next.js',
    description: 'full-stack react framework for modern web apps',
    icon: (
      <svg viewBox="0 0 180 180" className="w-10 h-10" fill="currentColor">
        <mask
          height="180"
          id=":r8:mask0_408_134"
          maskUnits="userSpaceOnUse"
          width="180"
          x="0"
          y="0"
        >
          <circle cx="90" cy="90" fill="black" r="90"></circle>
        </mask>
        <g mask="url(#:r8:mask0_408_134)">
          <circle cx="90" cy="90" fill="currentColor" r="90"></circle>
          <path
            d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
            fill="url(#:r8:paint0_linear_408_134)"
          ></path>
          <rect fill="url(#:r8:paint1_linear_408_134)" height="72" width="12" x="115" y="54"></rect>
        </g>
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id=":r8:paint0_linear_408_134"
            x1="109"
            x2="144.5"
            y1="116.5"
            y2="160.5"
          >
            <stop stopColor="white"></stop>
            <stop offset="1" stopColor="white" stopOpacity="0"></stop>
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id=":r8:paint1_linear_408_134"
            x1="121"
            x2="120.799"
            y1="54"
            y2="106.875"
          >
            <stop stopColor="white"></stop>
            <stop offset="1" stopColor="white" stopOpacity="0"></stop>
          </linearGradient>
        </defs>
      </svg>
    ),
    color: 'from-slate-700 to-black',
  },
  {
    name: 'Shopify',
    description: 'e-commerce platform for online stores',
    icon: (
      <svg viewBox="0 0 32 32" className="w-10 h-10" fill="currentColor">
        <path d="M21.958 7.417c-.026-.078-.052-.078-.104-.078s-1.169-.13-1.169-.13-.806-.806-1.039-1.039c-.104-.104-.234-.104-.312-.078-.026 0-.182.052-.442.13-.286-.832-.806-1.612-1.716-1.612h-.078c-.234-.338-.546-.494-.832-.494-2.052 0-3.038 2.572-3.35 3.87-.962.286-1.638.494-1.716.52-.52.156-.546.182-.598.676-.052.364-1.326 10.205-1.326 10.205L20.633 21.28l4.784-1.014S21.984 7.469 21.958 7.417zM18.92 6.299c-.182.052-.416.104-.676.182v-.156c0-.624-.078-1.117-.208-1.508.364.078.676.754.884 1.482zm-1.56-2.052c.156.364.286.988.286 1.768v.052c-.624.182-1.326.364-2.028.572.39-1.508 1.117-2.236 1.742-2.392zm-.65-.442c.052 0 .104.026.182.052-.832.39-1.742 1.456-2.132 3.558-.546.156-1.066.312-1.586.468.416-1.924 1.794-4.078 3.536-4.078z"></path>
        <path d="M21.854 7.339c-.052 0-1.169-.13-1.169-.13s-.806-.806-1.039-1.039c-.052-.052-.13-.078-.182-.104l-2.522 15.49 4.784-1.014s-3.428-12.902-3.454-12.98c-.026-.078-.052-.078-.104-.078l-.364.026.05-.171z"></path>
      </svg>
    ),
    color: 'from-green-600 to-green-800',
  },
  {
    name: 'WordPress',
    description: 'flexible cms for content-driven sites',
    icon: (
      <svg viewBox="0 0 32 32" className="w-10 h-10" fill="currentColor">
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
