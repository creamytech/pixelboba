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
  { name: 'process', href: '/process' },
  { name: 'about', href: '/about' },
  { name: 'contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border' : 'bg-transparent'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
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
              className="h-12 w-auto"
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
              className="text-taro hover:text-deep-taro hover:bg-taro/10"
            >
              <Link href="/login">client sign in</Link>
            </Button>
            <Button asChild className="bg-taro hover:bg-deep-taro text-white">
              <Link href="/services#start">start a project</Link>
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
            <Button asChild className="bg-taro hover:bg-deep-taro text-white text-xs px-3 py-2">
              <Link href="/services#start">start project</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                    className="text-taro hover:text-deep-taro hover:bg-taro/10 w-full"
                  >
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      client sign in
                    </Link>
                  </Button>
                  <Button asChild className="bg-taro hover:bg-deep-taro text-white w-full">
                    <Link href="/services#start" onClick={() => setIsMobileMenuOpen(false)}>
                      start a project
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
