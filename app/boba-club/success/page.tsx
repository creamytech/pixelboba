'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Icon } from '@iconify/react';

export default function BobaClubSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsAccount, setNeedsAccount] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setError('Invalid checkout session');
      setLoading(false);
      return;
    }

    // Check if user is already logged in
    if (status === 'authenticated') {
      // User already has account, redirect to portal
      setTimeout(() => {
        router.push('/portal');
      }, 3000);
      setLoading(false);
    } else if (status === 'unauthenticated') {
      // User needs to create account
      setNeedsAccount(true);
      setLoading(false);
    }
  }, [searchParams, session, status, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <Icon icon="ph:warning-duotone" className="w-20 h-20 text-red-500 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/boba-club')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Boba Club
          </button>
        </div>
      </div>
    );
  }

  if (needsAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <Icon icon="ph:confetti-duotone" className="w-24 h-24 text-taro mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Boba Club!</h1>
          <p className="text-gray-600 mb-6">
            Your subscription is active! Check your email for login credentials and payment
            confirmation. You can now access your dashboard.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors w-full mb-3"
          >
            Go to Login
          </button>
          <p className="text-sm text-gray-500">An account has been created with your email</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-4">
          <Icon icon="ph:sparkle-duotone" className="w-24 h-24 text-taro mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">You&apos;re all set!</h1>
        <p className="text-gray-600 mb-6">
          Your Boba Club subscription is active. Redirecting you to the dashboard...
        </p>
        <div className="animate-pulse text-purple-600">Loading your workspace...</div>
      </div>
    </div>
  );
}
