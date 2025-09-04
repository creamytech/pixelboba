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
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  const startTransition = () => {
    setIsLoading(true);
  };

  const completeTransition = () => {
    // Keep loading visible for at least 800ms for nice UX
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Listen for pathname changes to complete transition
  useEffect(() => {
    if (pathname !== lastPathname && isLoading) {
      completeTransition();
    }
    setLastPathname(pathname);
  }, [pathname, lastPathname, isLoading]);

  // Handle link clicks to start transitions
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (link && link.href) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        // Check if it's an internal navigation (same origin, different pathname)
        if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
          // Don't start transition if it's opening in a new tab
          if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
            startTransition();
          }
        }
      }
    };

    // Handle browser back/forward buttons
    const handlePopState = () => {
      startTransition();
    };

    document.addEventListener('click', handleLinkClick);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Fallback: hide loading after 3 seconds if something goes wrong
  useEffect(() => {
    if (isLoading) {
      const fallbackTimer = setTimeout(() => {
        setIsLoading(false);
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
      {children}
      <BobaLoader isVisible={isLoading} />
    </PageTransitionContext.Provider>
  );
}
