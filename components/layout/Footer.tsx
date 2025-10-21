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

      <div className="max-w-[900px] mx-auto px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/brand/Pixel_Boba_Icon_H_Black1.svg"
                alt="Pixel Boba"
                width={140}
                height={42}
                className="w-auto h-9"
              />
            </Link>
            <p className="text-sm text-ink/60 mb-4">
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
                    className="text-ink/60 hover:text-ink transition-colors"
                    aria-label={item.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-ink mb-4">Navigation</h3>
            <ul className="space-y-2">
              {footerNavigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink/60 hover:text-ink transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-ink mb-4">Get In Touch</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+17542434766" className="text-ink/60 hover:text-ink transition-colors">
                  (754) 243-4766
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@pixelboba.com"
                  className="text-ink/60 hover:text-ink transition-colors"
                >
                  hello@pixelboba.com
                </a>
              </li>
              <li className="text-ink/60">Fort Lauderdale, FL</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink/5 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-ink/60">
            <div>© {new Date().getFullYear()} Pixel Boba. All rights reserved.</div>
            <div className="flex gap-6">
              {footerNavigation.legal.map((item) => (
                <Link key={item.name} href={item.href} className="hover:text-ink transition-colors">
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
