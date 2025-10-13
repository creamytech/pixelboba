'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkFilterProps {
  categories: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function WorkFilter({ categories, activeFilter, onFilterChange }: WorkFilterProps) {
  return (
    <div className="mb-12">
      <div className="flex flex-wrap justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange('all')}
          className={`px-6 py-3 rounded-full font-semibold lowercase transition-all duration-300 ${
            activeFilter === 'all'
              ? 'bg-taro text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-taro/50'
          }`}
        >
          all projects
        </motion.button>
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(category)}
            className={`px-6 py-3 rounded-full font-semibold lowercase transition-all duration-300 ${
              activeFilter === category
                ? 'bg-taro text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-taro/50'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
