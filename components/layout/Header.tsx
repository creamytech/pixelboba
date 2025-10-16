'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'work', href: '/work' },
  { name: 'services', href: '/services' },
  { name: 'boba club', href: '/boba-club' },
  { name: 'process', href: '/process' },
  { name: 'about', href: '/about' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Calculate scroll progress
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-lg border-b border-border shadow-sm'
          : 'bg-background/80 backdrop-blur-sm'
      )}
      style={{ marginTop: 0, paddingTop: 0 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/brand/Pixel_Boba_Icon_H_Black1.svg"
              alt="pixel boba"
              width={200}
              height={60}
              className="w-auto h-12"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200 relative group lowercase',
                    isActive ? 'text-taro' : 'text-gray-600 hover:text-ink'
                  )}
                >
                  {item.name}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 h-0.5 bg-taro transition-all duration-200',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center justify-end space-x-3">
            <Button
              asChild
              variant="ghost"
              className="text-taro hover:text-deep-taro hover:bg-taro/10 transition-all duration-200"
            >
              <Link href="/login">client sign in</Link>
            </Button>
            <Button
              asChild
              className="group bg-gradient-to-r from-taro to-deep-taro hover:from-deep-taro hover:to-taro text-white transition-all duration-300 hover:shadow-lg hover:shadow-taro/30 relative overflow-hidden"
            >
              <Link href="/start">
                <span className="relative z-10">start now</span>
                <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1 text-sm relative z-10">
                  →
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-matcha/20 to-taro/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </Button>
          </div>

          {/* Medium screen navigation (hidden on lg+ where grid takes over) */}
          <nav className="hidden md:flex lg:hidden items-center space-x-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200 relative group lowercase',
                    isActive ? 'text-taro' : 'text-gray-600 hover:text-ink'
                  )}
                >
                  {item.name}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 h-0.5 bg-taro transition-all duration-200',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Medium screen CTA buttons */}
          <div className="hidden md:flex lg:hidden items-center space-x-3">
            <Button
              asChild
              className="group bg-gradient-to-r from-taro to-deep-taro hover:from-deep-taro hover:to-taro text-white text-xs px-3 py-2 transition-all duration-300 hover:shadow-md"
            >
              <Link href="/start">
                start now
                <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-0.5 text-xs">
                  →
                </span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-taro/10 rounded-lg transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-taro" />
            ) : (
              <Menu className="w-6 h-6 text-taro" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'text-lg font-medium transition-colors duration-200 lowercase',
                        isActive ? 'text-taro' : 'text-gray-600 hover:text-ink'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                <div className="pt-4 space-y-3">
                  <Button
                    asChild
                    variant="ghost"
                    className="text-taro hover:text-deep-taro hover:bg-taro/10 w-full transition-all duration-200"
                  >
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      client sign in
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="group bg-gradient-to-r from-taro to-deep-taro hover:from-deep-taro hover:to-taro text-white w-full transition-all duration-300 hover:shadow-lg"
                  >
                    <Link href="/start" onClick={() => setIsMobileMenuOpen(false)}>
                      start now
                      <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-taro via-matcha to-taro"
        style={{ width: `${scrollProgress}%` }}
      />
    </header>
  );
}
