'use client';

import { useRouter } from 'next/navigation';
import { usePageTransition } from '@/components/providers/PageTransitionProvider';

export function useNavigation() {
  const router = useRouter();
  const { setLoading } = usePageTransition();

  const navigateTo = (href: string, options?: { replace?: boolean }) => {
    setLoading(true);

    if (options?.replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  };

  const goBack = () => {
    setLoading(true);
    router.back();
  };

  const goForward = () => {
    setLoading(true);
    router.forward();
  };

  return {
    navigateTo,
    goBack,
    goForward,
  };
}
