'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = searchParams.get('token');

  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setMessage('Invalid invitation link. No token provided.');
      return;
    }

    // If not authenticated, redirect to sign in with callback
    if (status === 'unauthenticated') {
      signIn(undefined, {
        callbackUrl: `/team/accept-invite?token=${token}`,
      });
      return;
    }

    // If authenticated, accept the invitation
    if (status === 'authenticated') {
      acceptInvitation();
    }
  }, [token, status]);

  const acceptInvitation = async () => {
    try {
      setState('loading');
      console.log('[Accept Invite Page] Sending accept request with token:', token);

      const response = await fetch('/api/portal/team/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      console.log('[Accept Invite Page] Response:', { ok: response.ok, data });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept invitation');
      }

      setOrganizationName(data.organization.name);
      setState('success');
      setMessage(data.message);

      console.log('[Accept Invite Page] Success! Refreshing session and redirecting...');

      // CRITICAL: Force session refresh to get updated user data
      // Use window.location instead of router.push to force a full page reload
      // This ensures NextAuth fetches the updated user with organizationId
      setTimeout(() => {
        window.location.href = '/portal';
      }, 3000);
    } catch (error) {
      console.error('[Accept Invite Page] Error:', error);
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Failed to accept invitation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-milk-tea/20 via-white to-taro/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-taro to-deep-taro p-8 text-center border-b-4 border-ink">
            <Icon icon="game-icons:boba" className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="font-black text-2xl text-white uppercase">Team Invitation</h1>
          </div>

          {/* Content */}
          <div className="p-8">
            {state === 'loading' && (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-taro animate-spin mx-auto mb-4" />
                <p className="font-bold text-ink">
                  {status === 'loading' ? 'Loading...' : 'Accepting invitation...'}
                </p>
              </div>
            )}

            {state === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-matcha rounded-full flex items-center justify-center mx-auto mb-4 border-3 border-ink">
                  <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
                <h2 className="font-black text-2xl text-ink uppercase mb-3">Success! 🎉</h2>
                <p className="text-ink font-bold mb-2">
                  You&apos;ve successfully joined <strong>{organizationName}</strong>!
                </p>
                <p className="text-ink/70 font-bold text-sm mb-6">
                  Redirecting you to the portal...
                </p>
                <div className="w-full h-2 bg-cream rounded-full overflow-hidden border-2 border-ink">
                  <motion.div
                    className="h-full bg-gradient-to-r from-taro to-deep-taro"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            )}

            {state === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-strawberry/20 rounded-full flex items-center justify-center mx-auto mb-4 border-3 border-strawberry">
                  {message.includes('expired') ? (
                    <AlertCircle className="w-8 h-8 text-strawberry" strokeWidth={3} />
                  ) : (
                    <XCircle className="w-8 h-8 text-strawberry" strokeWidth={3} />
                  )}
                </div>
                <h2 className="font-black text-2xl text-ink uppercase mb-3">
                  {message.includes('expired')
                    ? 'Invitation Expired'
                    : message.includes('already used')
                      ? 'Already Used'
                      : 'Error'}
                </h2>
                <p className="text-ink font-bold mb-6">{message}</p>

                <div className="space-y-3">
                  {message.includes('expired') && (
                    <p className="text-ink/70 font-bold text-sm">
                      Please ask the team owner to send you a new invitation.
                    </p>
                  )}
                  <button
                    onClick={() => router.push('/')}
                    className="w-full px-6 py-3 bg-gradient-to-r from-taro to-deep-taro text-white font-black rounded-xl border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
                  >
                    Go to Homepage
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-ink/70 font-bold text-sm">
            Need help?{' '}
            <a href="mailto:hello@pixelboba.com" className="text-taro font-black hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
