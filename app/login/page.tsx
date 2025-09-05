'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/signin');
  }, [router]);

  return (
    <div className="min-h-screen bg-milk-tea flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-taro border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-ink/60">redirecting to sign in...</p>
      </div>
    </div>
  );
}
