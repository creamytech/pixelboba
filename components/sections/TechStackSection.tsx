'use client';

import { motion } from 'framer-motion';

const techStack = [
  { name: 'next.js', description: 'react framework' },
  { name: 'vercel', description: 'deployment' },
  { name: 'typescript', description: 'type safety' },
  { name: 'tailwind css', description: 'styling' },
  { name: 'framer motion', description: 'animations' },
  { name: 'three.js', description: '3d graphics' },
  { name: 'resend', description: 'email api' },
  { name: 'google analytics', description: 'analytics' },
];

export default function TechStackSection() {
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
            built with modern tech
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            we use cutting-edge technologies to ensure your website is fast, secure, and
            future-proof.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              className="group bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative">
                <h3 className="font-display text-lg font-bold text-ink mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.description}</p>

                {/* Pearl decoration */}
                <motion.div
                  className="absolute -top-2 -right-2 w-3 h-3 bg-taro rounded-full opacity-0 group-hover:opacity-100"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our tech stack is carefully chosen for performance, scalability, and developer
            experience. Each tool serves a specific purpose in creating exceptional digital
            experiences.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
