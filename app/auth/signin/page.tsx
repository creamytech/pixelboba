'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Chrome, Mail, Lock } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  type: string;
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);

  useEffect(() => {
    const getAuthProviders = async () => {
      const authProviders = await getProviders();
      setProviders(authProviders);
    };
    getAuthProviders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-milk-tea/5 via-background to-taro/5 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-ink/10 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Image
                src="/brand/Pixel_Boba_Logo_Black.svg"
                alt="pixel boba"
                width={200}
                height={67}
                className="h-16 w-auto"
                priority
              />
            </div>
            <h1 className="text-xl font-semibold text-ink mb-2">welcome back</h1>
            <p className="text-ink/60">sign in to access your portal</p>
          </div>

          {/* Sign-in Options */}
          <div className="space-y-4">
            {/* Google Sign In */}
            {providers?.google && (
              <button
                onClick={() => signIn('google', { callbackUrl: '/portal' })}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Chrome size={20} />
                <span>Continue with Google</span>
              </button>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ink/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-ink/60">or</span>
              </div>
            </div>

            {/* Email Sign In */}
            {providers?.credentials && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  signIn('credentials', {
                    email: formData.get('email'),
                    password: formData.get('password'),
                    callbackUrl: '/portal',
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink/40"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-ink/20 rounded-lg focus:ring-2 focus:ring-taro/50 focus:border-taro outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-ink mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink/40"
                      size={18}
                    />
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-ink/20 rounded-lg focus:ring-2 focus:ring-taro/50 focus:border-taro outline-none transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <a
                    href="/forgot-password"
                    className="text-sm text-taro hover:text-taro/80 font-medium"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-taro to-brown-sugar hover:from-taro/90 hover:to-brown-sugar/90 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02]"
                >
                  Sign In
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-ink/60">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => signIn('google', { callbackUrl: '/portal' })}
                className="text-taro hover:text-taro/80 font-medium"
              >
                Sign up with Google
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
