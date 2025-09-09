'use client';

import { motion } from 'framer-motion';

export default function CTABanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-gradient-to-r from-taro/10 to-matcha/10 rounded-xl p-8 mb-12"
    >
      <p className="text-lg text-gray-600 mb-6 lowercase">
        transparent pricing, no surprise costs, no discovery calls needed
      </p>
      <motion.button
        onClick={() => {
          document.getElementById('start-project')?.scrollIntoView({
            behavior: 'smooth',
          });
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center bg-taro text-white px-8 py-4 rounded-xl font-semibold hover:bg-taro/90 transition-colors duration-200 lowercase shadow-lg"
      >
        <span>start your project</span>
        <svg
          className="ml-2 w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {/* Decorative pearls - Hidden on mobile */}
      <div className="absolute top-4 right-8 hidden md:flex space-x-2">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 bg-taro/30 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="w-2 h-2 bg-matcha/30 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          className="w-2 h-2 bg-taro/30 rounded-full"
        />
      </div>
    </motion.div>
  );
}
