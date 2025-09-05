'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { siteConfig } from '@/lib/seo';

// Custom X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const footerNavigation = {
  main: [
    { name: 'work', href: '/work' },
    { name: 'services', href: '/services' },
    { name: 'process', href: '/process' },
    { name: 'about', href: '/about' },
    { name: 'contact', href: '/contact' },
  ],
  legal: [
    { name: 'privacy policy', href: '/legal/privacy' },
    { name: 'terms of service', href: '/legal/terms' },
  ],
  social: [
    { name: 'X', href: siteConfig.links.twitter, icon: XIcon },
    { name: 'Instagram', href: siteConfig.links.instagram, icon: Instagram },
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
              <h3 className="font-display text-3xl font-bold mb-4">stay in the loop</h3>
              <p className="text-gray-400 mb-8">
                get updates on our latest work, industry insights, and exclusive behind-the-scenes
                content.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
                <Button className="bg-taro hover:bg-deep-taro text-white whitespace-nowrap">
                  subscribe
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
              <Image
                src="/brand/Pixel_Boba_Logo_White.png"
                alt="pixel boba"
                width={180}
                height={60}
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              design-first websites with delightful details and boba-smooth interactions. we create
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
            <h4 className="font-semibold text-lg mb-4">navigation</h4>
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
            <h4 className="font-semibold text-lg mb-4">get in touch</h4>
            <div className="space-y-2 text-gray-400">
              <p>ready to make your project pop?</p>
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
              © {new Date().getFullYear()} pixel boba llc. all rights reserved.
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
