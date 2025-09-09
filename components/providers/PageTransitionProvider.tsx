'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import BobaLoader from '@/components/loading/BobaLoader';

interface PageTransitionContextType {
  isLoading: boolean;
  startTransition: () => void;
  completeTransition: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (context === undefined) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
}

interface PageTransitionProviderProps {
  children: React.ReactNode;
}

export default function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  const startTransition = () => {
    // Hide page content immediately and show loading
    setPageVisible(false);
    setIsLoading(true);
  };

  const completeTransition = () => {
    // Shorter loading time on mobile devices
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const loadingDuration = isMobile ? 300 : 600;

    setTimeout(() => {
      setIsLoading(false);
      // Show page content after loading disappears
      setTimeout(() => {
        setPageVisible(true);
      }, 100);
    }, loadingDuration);
  };

  // Listen for pathname changes to complete transition
  useEffect(() => {
    if (pathname !== lastPathname) {
      if (isLoading) {
        // Navigation in progress, complete it
        completeTransition();
      } else {
        // Direct navigation (browser back/forward), show brief loading
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const loadingDuration = isMobile ? 200 : 400;

        setPageVisible(false);
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => setPageVisible(true), 100);
        }, loadingDuration);
      }
    }
    setLastPathname(pathname);
  }, [pathname, lastPathname, isLoading]);

  // Handle link clicks to start transitions
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Only handle left clicks without modifiers
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;

      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (link && link.href) {
        try {
          const url = new URL(link.href);
          const currentUrl = new URL(window.location.href);

          // Check if it's an internal navigation to a different page
          if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
            // Start transition immediately on click
            startTransition();
          }
        } catch (e) {
          // Invalid URL, ignore
        }
      }
    };

    // Handle browser back/forward buttons
    const handlePopState = () => {
      startTransition();
    };

    // Use capture phase to ensure we get the event before Next.js
    document.addEventListener('click', handleLinkClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Fallback: hide loading after 3 seconds if something goes wrong
  useEffect(() => {
    if (isLoading) {
      const fallbackTimer = setTimeout(() => {
        setIsLoading(false);
        setPageVisible(true);
      }, 3000);

      return () => clearTimeout(fallbackTimer);
    }
  }, [isLoading]);

  const contextValue = {
    isLoading,
    startTransition,
    completeTransition,
  };

  return (
    <PageTransitionContext.Provider value={contextValue}>
      <div
        style={{
          opacity: pageVisible ? 1 : 0,
          transition: 'opacity 0.15s ease-in-out',
          position: pageVisible ? 'static' : 'fixed',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
      <BobaLoader isVisible={isLoading} />
    </PageTransitionContext.Provider>
  );
}
