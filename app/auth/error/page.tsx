'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const errorMessages = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'An error occurred during authentication.',
};

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') as keyof typeof errorMessages;

  const message = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-milk-tea/5 via-background to-taro/5 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-ink/10 p-8 text-center">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-taro to-brown-sugar rounded-full"></div>
              <span className="font-display font-bold text-2xl text-ink">pixel boba</span>
            </div>

            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>

            <h1 className="text-xl font-semibold text-ink mb-2">Authentication Error</h1>
            <p className="text-ink/70">{message}</p>
          </div>

          {/* Action */}
          <Link
            href="/auth/signin"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-taro to-brown-sugar hover:from-taro/90 hover:to-brown-sugar/90 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02]"
          >
            <ArrowLeft size={18} />
            <span>Try Again</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
