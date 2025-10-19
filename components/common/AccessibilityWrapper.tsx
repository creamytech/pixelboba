'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useScreenReaderAnnouncement } from '@/hooks/useKeyboardNav';

/**
 * Accessibility wrapper component
 * Provides skip links, route announcements, and other a11y features
 */

export default function AccessibilityWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { announce } = useScreenReaderAnnouncement();

  // Announce route changes to screen readers
  useEffect(() => {
    const pageName = getPageName(pathname);
    announce(`Navigated to ${pageName} page`, 'polite');
  }, [pathname, announce]);

  const handleSkipToContent = (e: React.MouseEvent) => {
    e.preventDefault();
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      (mainContent as HTMLElement).focus();
      mainContent.removeAttribute('tabindex');
    }
  };

  return (
    <>
      {/* Skip Links - Only visible when focused */}
      <div className="sr-only-focusable">
        <a
          href="#main-content"
          onClick={handleSkipToContent}
          className="fixed top-4 left-4 z-[9999] bg-taro text-white px-4 py-2 rounded-lg focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-taro/50"
        >
          Skip to main content
        </a>
      </div>

      {/* Main Content */}
      <div id="main-content" role="main">
        {children}
      </div>

      {/* Live Region for Announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="sr-announcements"
      />
    </>
  );
}

function getPageName(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname === '/admin') return 'admin dashboard';
  if (pathname === '/portal') return 'client portal';
  if (pathname.includes('/auth')) return 'authentication';

  // Remove leading slash and capitalize
  const name = pathname.replace(/^\//, '').replace(/-/g, ' ');
  return name || 'page';
}
