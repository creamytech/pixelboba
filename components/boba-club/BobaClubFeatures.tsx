'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Infinity as InfinityIcon,
  Zap,
  RefreshCw,
  Clock,
  Share2,
  Palette,
  Sparkles,
  Monitor,
  Globe,
  Mail,
  FileText,
  Users,
  Download,
  PauseCircle,
  X,
} from 'lucide-react';

const includedFeatures = [
  { icon: InfinityIcon, text: 'Unlimited dev + design requests' },
  { icon: Zap, text: 'One request at a time (two for Enterprise)' },
  { icon: RefreshCw, text: 'Unlimited revisions' },
  { icon: Clock, text: '24-72 hour delivery (based on tier)' },
  { icon: Globe, text: 'Full web development (React, Next.js, TypeScript)' },
  { icon: Monitor, text: 'Webflow development & custom features' },
  { icon: Palette, text: 'Branding, logos, and visual systems' },
  { icon: Sparkles, text: 'Custom UI/UX design & illustrations' },
  { icon: Share2, text: 'Social graphics, marketing materials, and carousels' },
  { icon: Mail, text: 'Email templates, pitch decks, and landing pages' },
  { icon: FileText, text: 'API integrations & database development' },
  { icon: Users, text: '1-5 users (based on tier)' },
  { icon: Download, text: 'Full ownership of all code & files' },
  { icon: PauseCircle, text: 'Pause or cancel anytime' },
];

const notIncluded = [
  { icon: X, text: '3D rendering or complex animations' },
  { icon: X, text: 'Long-form video production' },
  { icon: X, text: 'Native mobile app development (iOS/Android)' },
  { icon: X, text: 'Copywriting or photography services' },
];

export default function BobaClubFeatures() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-white via-milk-tea/20 to-white"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
            Everything Your Brand Needs to Build & Grow
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            All the flavor, no limits. Get unlimited access to professional web development and
            design services.
          </p>
        </motion.div>

        {/* Included Features Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl font-bold text-ink mb-8 text-center"
          >
            Included
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {includedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className="group relative bg-white rounded-xl p-6 shadow-md border border-taro/10 hover:border-taro/30 hover:shadow-xl transition-all duration-300"
              >
                {/* Animated background pearl */}
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 bg-gradient-radial from-taro/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                <div className="flex items-start gap-4 relative z-10">
                  {/* Icon with micro-animation */}
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-lg flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>

                  <div className="flex-1">
                    <p className="text-gray-700 font-medium leading-relaxed">{feature.text}</p>
                  </div>
                </div>

                {/* Sparkle effect on hover */}
                <motion.div
                  className="absolute top-4 right-4 text-matcha"
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Not Included Section */}
        <div className="max-w-4xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl font-bold text-ink mb-8 text-center"
          >
            Not Included
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notIncluded.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <item.icon className="w-5 h-5 text-gray-400" />
                <p className="text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
