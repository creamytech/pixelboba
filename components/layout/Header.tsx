'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
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
    icon: 'game-icons:boba',
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

  // Handle ESC key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

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
                    <>
                      {/* Backdrop overlay - clickable to close */}
                      <motion.div
                        className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMenuOpen(false)}
                      />

                      <motion.div
                        className="absolute top-full left-0 mt-4 w-[600px] bg-gradient-to-b from-[#FFF8F6] to-[#FFF1EC] backdrop-blur-md border-[5px] border-ink rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.15),12px_12px_0px_0px_rgba(58,0,29,1)] z-50 overflow-hidden"
                        style={{
                          boxShadow:
                            '0 8px 24px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.2), 12px 12px 0px 0px rgba(58,0,29,1)',
                        }}
                        initial={{ y: -20, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -20, opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        {/* Floating boba bubbles background */}
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute rounded-full bg-gradient-to-br from-taro/5 to-deep-taro/10"
                              style={{
                                width: `${20 + i * 8}px`,
                                height: `${20 + i * 8}px`,
                                left: `${15 + i * 15}%`,
                                bottom: `-${20 + i * 10}px`,
                              }}
                              animate={{
                                y: [0, -400],
                                opacity: [0, 0.3, 0.5, 0.3, 0],
                              }}
                              transition={{
                                duration: 8 + i * 2,
                                repeat: Infinity,
                                delay: i * 1.5,
                                ease: 'easeInOut',
                              }}
                            />
                          ))}
                        </div>

                        {/* Taro cat peeking from corner */}
                        <motion.div
                          className="absolute bottom-2 right-2 w-16 h-16 pointer-events-none"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                        >
                          <motion.div
                            animate={{
                              rotate: [-5, 5, -5],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            <Image
                              src="/01.svg"
                              alt=""
                              width={64}
                              height={64}
                              className="opacity-40"
                            />
                          </motion.div>
                        </motion.div>

                        <div className="p-5 relative z-10">
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
                                    className={`bg-cream border-[4px] border-ink rounded-[1.5rem] shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-5 transition-all duration-250 ${
                                      pathname === item.href
                                        ? 'bg-[#7C3AED]/10 ring-2 ring-[#7C3AED]'
                                        : 'hover:shadow-[0_6px_12px_rgba(0,0,0,0.12),6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-y-[-3px] hover:ring-2 hover:ring-taro/50'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                  >
                                    <motion.div
                                      whileHover={{
                                        scale: 1.15,
                                        rotate: item.name === 'Work' ? [0, -5, 5, -5, 0] : 5,
                                        y: item.name === 'Boba Club' ? [0, -3, 0] : 0,
                                      }}
                                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                    >
                                      <Icon
                                        icon={item.icon}
                                        className="w-11 h-11 text-[#5A2CA0] mb-2"
                                      />
                                    </motion.div>
                                    <h3 className="text-lg font-black text-ink mb-1.5 group-hover:text-[#8C4EFF] transition-colors">
                                      {item.name}
                                    </h3>
                                    <p className="text-xs text-[#3A001D]/85 font-bold leading-snug">
                                      {item.description}
                                    </p>
                                  </motion.div>
                                </Link>
                              </motion.div>
                            ))}
                          </nav>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Logo - perfectly centered, half on/half off the card */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none translate-y-7 sm:-translate-y-.01 md:-translate-y-1">
                <Link href="/" className="pointer-events-auto">
                  <Image
                    src="/brand/Pixel_Boba_Icon_Header2.png"
                    alt="Pixel Boba"
                    width={700}
                    height={300}
                    className="w-auto h-24 sm:h-28 md:h-32 lg:h-36"
                    priority
                  />
                </Link>
              </div>

              {/* Action buttons - Desktop only */}
              <div className="hidden md:flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/portal"
                    className="inline-flex items-center justify-center min-h-[44px] bg-white text-ink px-5 py-2.5 rounded-full font-black border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all text-sm whitespace-nowrap"
                  >
                    CLIENT LOGIN
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/start"
                    className="inline-flex items-center justify-center min-h-[44px] bg-[#7C3AED] text-white px-5 py-2.5 rounded-full font-black border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all text-sm whitespace-nowrap"
                  >
                    GET STARTED
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Mobile Full-Screen Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="fixed inset-0 z-[100] bg-gradient-to-b from-[#FFF8F6] to-[#FFF1EC] backdrop-blur-md md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="h-full overflow-y-auto pb-32 pt-6 sm:pt-8 px-4 sm:px-6">
                    <nav className="flex flex-col gap-4">
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
                              className={`bg-white border-3 sm:border-4 border-ink rounded-[1.5rem] shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] p-4 sm:p-5 transition-all ${
                                pathname === item.href
                                  ? 'bg-[#7C3AED]/10 ring-2 ring-[#7C3AED]'
                                  : 'active:shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px]'
                              }`}
                            >
                              <Icon
                                icon={item.icon}
                                className="w-11 h-11 sm:w-12 sm:h-12 text-[#5A2CA0] mb-2"
                              />
                              <h3 className="text-lg sm:text-xl font-black text-ink mb-1.5 group-active:text-[#8C4EFF] transition-colors">
                                {item.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-[#3A001D]/85 font-bold leading-snug">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                      {/* Client Login Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + navigation.length * 0.05 }}
                      >
                        <Link
                          href="/portal"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full px-6 py-4 bg-white text-ink font-black rounded-2xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all text-center uppercase text-base"
                        >
                          CLIENT LOGIN
                        </Link>
                      </motion.div>
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
