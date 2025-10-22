'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

const navigation = [
  {
    name: 'Work',
    href: '/work',
    icon: 'ph:palette-duotone',
    description: 'Browse our portfolio of scroll-stopping websites',
  },
  {
    name: 'Services',
    href: '/services',
    icon: 'ph:lightning-duotone',
    description: 'Custom design & development that delivers results',
  },
  {
    name: 'Boba Club',
    href: '/boba-club',
    icon: 'ph:coffee-duotone',
    description: 'Ongoing support & unlimited design requests',
  },
  {
    name: 'Process',
    href: '/process',
    icon: 'ph:rocket-duotone',
    description: 'See your site live from day one, no mockups',
  },
  {
    name: 'About',
    href: '/about',
    icon: 'ph:sparkle-duotone',
    description: 'Meet the team behind the pixels & pearls',
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: 'ph:chat-circle-dots-duotone',
    description: "Let's brew up something special together",
  },
];

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="pt-20 sm:pt-24 md:pt-16 pb-0 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto relative">
          {/* Main card with 3 stacked solid color bars */}
          <motion.div
            className="relative bg-white border-3 sm:border-4 border-ink rounded-2xl sm:rounded-3xl md:rounded-[32px] shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] sm:shadow-[12px_12px_0px_0px_rgba(58,0,29,1)] md:shadow-[16px_16px_0px_0px_rgba(58,0,29,1)] overflow-visible"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Desktop: Buttons and logo - positioned ABOVE card, half on/half off */}
            {/* Mobile: Only logo at top */}
            <div className="absolute -top-8 sm:-top-10 md:-top-8 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 flex items-start justify-between">
              {/* Menu button - Desktop only */}
              <div className="relative hidden md:block">
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="bg-white text-ink px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-black border-3 sm:border-4 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] sm:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] flex items-center gap-2 text-sm min-h-[44px]"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '6px 6px 0px 0px rgba(58,0,29,1)',
                    x: -2,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  <span>{isMenuOpen ? 'CLOSE' : 'LEARN MORE'}</span>
                </motion.button>

                {/* Dropdown menu - Desktop */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      className="absolute top-full left-0 mt-4 w-[600px] bg-white border-[5px] border-ink rounded-3xl shadow-[12px_12px_0px_0px_rgba(58,0,29,1)]"
                      initial={{ y: -10, opacity: 0, scale: 0.95 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -10, opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <div className="p-6">
                        <nav className="grid grid-cols-2 gap-4">
                          {navigation.map((item, index) => (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 + index * 0.03 }}
                            >
                              <Link
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="block group"
                              >
                                <motion.div
                                  className={`bg-cream border-[4px] border-ink rounded-2xl shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6 transition-all ${
                                    pathname === item.href
                                      ? 'bg-[#7C3AED]/10'
                                      : 'hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <Icon
                                    icon={item.icon}
                                    className="w-12 h-12 text-deep-taro mb-3"
                                  />
                                  <h3 className="text-xl font-black text-ink mb-2 group-hover:text-[#7C3AED] transition-colors">
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-ink/70 font-bold leading-snug">
                                    {item.description}
                                  </p>
                                </motion.div>
                              </Link>
                            </motion.div>
                          ))}
                        </nav>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Logo - perfectly centered, half on/half off the card */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-y-8 sm:-translate-y-10 md:-translate-y-12">
                <Link href="/" className="pointer-events-auto">
                  <Image
                    src="/brand/Pixel_Boba_Icon_Header2.png"
                    alt="Pixel Boba"
                    width={700}
                    height={210}
                    className="w-auto h-24 sm:h-28 md:h-32 lg:h-36"
                    priority
                  />
                </Link>
              </div>

              {/* Get Started button - Desktop only */}
              <motion.div
                className="hidden md:block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/start"
                  className="inline-flex items-center justify-center min-h-[44px] bg-[#7C3AED] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-black border-3 sm:border-4 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] sm:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all text-sm whitespace-nowrap"
                >
                  GET STARTED
                </Link>
              </motion.div>
            </div>

            {/* Mobile Full-Screen Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="fixed inset-0 z-[100] bg-cream md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="h-full overflow-y-auto pb-32 pt-6 sm:pt-8 px-4 sm:px-6">
                    <nav className="flex flex-col gap-3 sm:gap-4">
                      {navigation.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block group"
                          >
                            <div
                              className={`bg-white border-3 sm:border-4 border-ink rounded-2xl sm:rounded-3xl shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] p-5 sm:p-6 transition-all min-h-[100px] ${
                                pathname === item.href
                                  ? 'bg-[#7C3AED]/10'
                                  : 'active:shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px]'
                              }`}
                            >
                              <Icon
                                icon={item.icon}
                                className="w-12 h-12 sm:w-14 sm:h-14 text-deep-taro mb-3"
                              />
                              <h3 className="text-xl sm:text-2xl font-black text-ink mb-2 group-active:text-[#7C3AED] transition-colors">
                                {item.name}
                              </h3>
                              <p className="text-sm sm:text-base text-ink/70 font-bold leading-snug">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </nav>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* First bar - medium taro */}
            <div className="h-10 sm:h-12 bg-[#A78BFA] rounded-t-2xl sm:rounded-t-3xl md:rounded-t-[28px]" />

            {/* Second bar - deep taro */}
            <div className="h-10 sm:h-12 bg-[#7C3AED]" />

            {/* Content area */}
            <div className="bg-cream rounded-b-2xl sm:rounded-b-3xl">{children}</div>
          </motion.div>
        </div>
      </header>

      {/* Spacer for footer */}
      <div className="h-20 sm:h-24"></div>

      {/* Mobile Floating Side Buttons */}
      <div className="md:hidden">
        {/* Menu Button - Left Side */}
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed left-3 sm:left-4 bottom-6 sm:bottom-8 z-[110] bg-white text-ink p-4 sm:p-5 rounded-full font-black border-3 sm:border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] min-w-[56px] min-h-[56px] flex items-center justify-center"
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7" />
          ) : (
            <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
          )}
        </motion.button>

        {/* Get Started Button - Right Side */}
        <motion.div
          className="fixed right-3 sm:right-4 bottom-6 sm:bottom-8 z-[110]"
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/start"
            className="bg-[#7C3AED] text-white p-4 sm:p-5 rounded-full font-black border-3 sm:border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center min-w-[56px] min-h-[56px]"
          >
            <Icon icon="ph:rocket-duotone" className="w-6 h-6 sm:w-7 sm:h-7" />
          </Link>
        </motion.div>
      </div>
    </>
  );
}
