'use client';

import { useRouter } from 'next/navigation';
import { usePageTransition } from '@/components/providers/PageTransitionProvider';

export function useNavigation() {
  const router = useRouter();
  const { startTransition } = usePageTransition();

  const navigateTo = (href: string, options?: { replace?: boolean }) => {
    startTransition();

    if (options?.replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  };

  const goBack = () => {
    startTransition();
    router.back();
  };

  const goForward = () => {
    startTransition();
    router.forward();
  };

  return {
    navigateTo,
    goBack,
    goForward,
  };
}
