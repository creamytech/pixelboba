'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin } from 'lucide-react';
import { siteConfig } from '@/lib/seo';
import CatIllustration from '@/components/decorative/CatIllustration';

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/pixel-boba/', icon: Linkedin },
    { name: 'X', href: siteConfig.links.twitter, icon: XIcon },
    { name: 'Instagram', href: siteConfig.links.instagram, icon: Instagram },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-cream overflow-hidden">
      <CatIllustration
        src="/01.svg"
        position="top-center"
        size="sm"
        opacity={0.4}
        flipHorizontal
        hideOnMobile
      />

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/brand/Pixel_Boba_Icon_H_Black1.svg"
                alt="Pixel Boba"
                width={140}
                height={42}
                className="w-auto h-8 sm:h-9"
              />
            </Link>
            <p className="text-sm sm:text-base text-ink/60 mb-4 leading-relaxed">
              Fort Lauderdale&apos;s creative web studio. Building websites that actually convert.
            </p>
            <div className="flex gap-4">
              {footerNavigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink/60 hover:text-ink transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -ml-3"
                    aria-label={item.name}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-base sm:text-lg text-ink mb-3 sm:mb-4">Navigation</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerNavigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm sm:text-base text-ink/60 hover:text-ink transition-colors inline-block min-h-[44px] flex items-center"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base sm:text-lg text-ink mb-3 sm:mb-4">
              Get In Touch
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <a
                  href="tel:+17542434766"
                  className="text-ink/60 hover:text-ink transition-colors inline-block min-h-[44px] flex items-center"
                >
                  (754) 243-4766
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@pixelboba.com"
                  className="text-ink/60 hover:text-ink transition-colors inline-block min-h-[44px] flex items-center break-all sm:break-normal"
                >
                  hello@pixelboba.com
                </a>
              </li>
              <li className="text-ink/60">Fort Lauderdale, FL</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink/5 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-ink/60">
            <div>© {new Date().getFullYear()} Pixel Boba. All rights reserved.</div>
            <div className="flex gap-4 sm:gap-6">
              {footerNavigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="hover:text-ink transition-colors min-h-[44px] flex items-center"
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
