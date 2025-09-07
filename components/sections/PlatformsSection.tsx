'use client';

import { motion } from 'framer-motion';

const platforms = [
  {
    name: 'Next.js',
    description: 'full-stack react framework for modern web apps',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.096-.0633c.8518-.5536 1.7525-1.3418 2.4657-2.1627 1.5179-1.7429 2.4963-3.868 2.8247-6.134.0961-.6591.1078-.8538.1078-1.7475 0-.8937-.012-1.0884-.1078-1.7476C22.8982 4.4 19.6711.751 15.5589.1573 14.9338.0528 12.5995.0051 11.5725 0z" />
        <path d="M14.8765 8.7789c.1337 0 .1736.0187.2369.1125.0446.061.0493.1174.0493 2.5022V13.972l-1.4453-2.2047-1.4479-2.2047V8.7789h1.4453z" />
      </svg>
    ),
    color: 'from-slate-600 to-black',
  },
  {
    name: 'Shopify',
    description: 'e-commerce platform for online stores',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M15.337 2.136c-.168-.043-.336-.043-.336-.043s-2.107-.211-3.564.632c-.654.379-1.264.758-1.873 1.264-.043 0-.043 0-.085.043-.253-.042-.546-.042-.883.043-1.053.253-1.769 1.053-1.896 2.527-.042.632-.042 1.348-.042 2.106 0 .168 0 .337-.042.506-1.39.674-2.359 1.137-2.359 1.137-.632.253-1.432.464-1.727 1.727-.211 1.053-5.054 38.828-5.054 38.828l39.881-6.738S16.812 2.39 15.337 2.136zM11.1 4.663c-.296.127-.632.253-.968.421V4.62c0-.421.043-.8.127-1.137.211.085.464.169.716.295v.885zm-1.348-.968c-.085.296-.127.674-.127 1.137v.295c-.506.253-1.053.506-1.6.8.085-.674.253-1.137.464-1.432.296-.506.674-.716 1.263-.8zm-1.938 10.435c.042.421 3.606 1.769 3.606 1.769v7.286s-2.4-.969-3.227-1.348c-.8-.379-1.726-1.221-1.726-2.611V14.13h1.347zm4.663-11.572c.296 0 .546 0 .758.043V4.705c.674-.379 1.39-.716 2.106-1.053-.253-.253-.59-.421-.968-.506-.8-.169-1.558.127-1.896.885z" />
      </svg>
    ),
    color: 'from-green-500 to-green-700',
  },
  {
    name: 'WordPress',
    description: 'flexible cms for content-driven sites',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.584-.03-.661.854-.075.884 0 0 .537.045 1.104.075l1.644 4.479-2.316 6.944-3.86-11.423c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 5.15 8.235 3.1 12.001 3.1c2.809 0 5.365 1.07 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014z" />
        <path d="M12.001.5C5.645.5.5 5.645.5 12.001s5.145 11.501 11.501 11.501S23.501 18.357 23.501 12.001 18.357.5 12.001.5zM12 21.983c-5.498 0-9.982-4.484-9.982-9.982S6.502 2.019 12 2.019s9.982 4.484 9.982 9.982S17.498 21.983 12 21.983z" />
      </svg>
    ),
    color: 'from-blue-500 to-blue-700',
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
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-white mb-6 shadow-lg`}
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
