'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import BobaLoader from '@/components/loading/BobaLoader';

interface PageTransitionContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
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
  const router = useRouter();

  // Track navigation loading state
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleStart = () => {
      // Add a small delay to avoid flash for very quick navigations
      timeoutId = setTimeout(() => {
        setIsLoading(true);
      }, 150);
    };

    const handleComplete = () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };

    // Listen for route changes using the pathname
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    // Override router methods to trigger loading
    router.push = (...args: Parameters<typeof router.push>) => {
      handleStart();
      return originalPush.apply(router, args);
    };

    router.replace = (...args: Parameters<typeof router.replace>) => {
      handleStart();
      return originalReplace.apply(router, args);
    };

    router.back = () => {
      handleStart();
      return originalBack.apply(router);
    };

    router.forward = () => {
      handleStart();
      return originalForward.apply(router);
    };

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;
    };
  }, [router]);

  // Stop loading when pathname changes (navigation complete)
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  // Handle browser back/forward buttons and direct navigation
  useEffect(() => {
    const handlePopState = () => {
      setIsLoading(true);
      // Set a timeout to hide loading in case the event doesn't fire
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const contextValue = {
    isLoading,
    setLoading: setIsLoading,
  };

  return (
    <PageTransitionContext.Provider value={contextValue}>
      {children}
      <BobaLoader isVisible={isLoading} />
    </PageTransitionContext.Provider>
  );
}
