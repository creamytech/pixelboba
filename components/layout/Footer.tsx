'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Twitter, Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { siteConfig } from '@/lib/seo';

const footerNavigation = {
  main: [
    { name: 'Work', href: '/work' },
    { name: 'Services', href: '/services' },
    { name: 'Process', href: '/process' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
  ],
  social: [
    { name: 'Twitter', href: siteConfig.links.twitter, icon: Twitter },
    { name: 'Instagram', href: siteConfig.links.instagram, icon: Instagram },
    { name: 'GitHub', href: siteConfig.links.github, icon: Github },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-bg text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-display text-3xl font-bold mb-4">Stay in the Loop</h3>
              <p className="text-gray-400 mb-8">
                Get updates on our latest work, industry insights, and exclusive behind-the-scenes
                content.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
                <Button className="bg-taro hover:bg-deep-taro text-white whitespace-nowrap">
                  Subscribe
                </Button>
              </div>

              {/* Floating pearls animation */}
              <div className="relative mt-8 h-16 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-taro rounded-full"
                    style={{ left: `${20 + i * 15}%` }}
                    animate={{
                      y: [-20, -40, -20],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="font-display font-bold text-2xl">
                Pixel Boba
                <span className="inline-block w-2 h-2 bg-taro rounded-full ml-1" />
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Design-first websites with delightful details and boba-smooth interactions. We create
              digital experiences that truly pop.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {footerNavigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="p-2 bg-gray-800 hover:bg-taro rounded-lg transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Navigation</h4>
            <ul className="space-y-2">
              {footerNavigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Get in Touch</h4>
            <div className="space-y-2 text-gray-400">
              <p>Ready to make your project pop?</p>
              <Link
                href="mailto:hello@pixelboba.com"
                className="flex items-center space-x-2 hover:text-white transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>hello@pixelboba.com</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Pixel Boba LLC. All rights reserved.
            </div>

            <div className="flex space-x-6">
              {footerNavigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
