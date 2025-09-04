'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const featuredProjects = [
  {
    title: 'EcoFlow Commerce',
    slug: 'ecoflow-commerce',
    summary: 'Sustainable e-commerce platform with seamless checkout',
    category: 'E-commerce',
    color: 'from-matcha to-matcha/60',
    stats: { lighthouse: 99, conversion: '+34%', bounce: '-18%' },
  },
  {
    title: 'TechStart SaaS',
    slug: 'techstart-saas',
    summary: 'Modern SaaS dashboard with real-time analytics',
    category: 'SaaS',
    color: 'from-taro to-deep-taro',
    stats: { lighthouse: 98, conversion: '+42%', bounce: '-25%' },
  },
  {
    title: 'Artisan Studio',
    slug: 'artisan-studio',
    summary: 'Creative portfolio showcasing handcrafted works',
    category: 'Portfolio',
    color: 'from-brown-sugar to-brown-sugar/60',
    stats: { lighthouse: 100, conversion: '+28%', bounce: '-15%' },
  },
];

export default function FeaturedWorkSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-6">
            Featured Work
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each project tells a unique story of collaboration, creativity, and results-driven
            design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project, index) => (
            <Link
              key={project.title}
              href={`/work/${project.slug}`}
              className="group cursor-pointer block"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Project Image/Preview */}
                  <div
                    className={`aspect-video bg-gradient-to-br ${project.color} p-8 flex items-center justify-center relative overflow-hidden`}
                  >
                    <div className="text-white text-center z-10">
                      <h3 className="font-display text-2xl font-bold mb-2">{project.title}</h3>
                      <p className="opacity-90">{project.summary}</p>
                    </div>

                    {/* Floating pearls */}
                    <motion.div
                      className="absolute top-4 right-4 w-6 h-6 bg-white/30 rounded-full"
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <motion.div
                      className="absolute bottom-6 left-6 w-4 h-4 bg-white/20 rounded-full"
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.2, 0.6, 0.2],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                      }}
                    />
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-milk-tea text-brown-sugar text-sm rounded-full">
                        {project.category}
                      </span>
                      <div className="text-sm text-gray-500">View Case Study →</div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="font-bold text-matcha text-lg">
                          {project.stats.lighthouse}
                        </div>
                        <div className="text-xs text-gray-500">Lighthouse</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-taro text-lg">
                          {project.stats.conversion}
                        </div>
                        <div className="text-xs text-gray-500">Conversion</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-brown-sugar text-lg">
                          {project.stats.bounce}
                        </div>
                        <div className="text-xs text-gray-500">Bounce Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* View All Work CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/work"
            className="inline-block bg-taro text-white px-8 py-3 rounded-lg font-semibold hover:bg-deep-taro transition-colors duration-300"
          >
            View All Work
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
