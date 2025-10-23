'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Provider {
  id: string;
  name: string;
  type: string;
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAuthProviders = async () => {
      const authProviders = await getProviders();
      setProviders(authProviders);
    };
    getAuthProviders();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/portal' });
  };

  const handleCredentialSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      callbackUrl: '/portal',
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Boba Pearls */}
      <div
        className="absolute top-10 left-10 w-16 h-16 bg-taro rounded-full border-4 border-ink opacity-20 animate-bounce"
        style={{ animationDelay: '0s', animationDuration: '3s' }}
      />
      <div
        className="absolute top-40 right-20 w-12 h-12 bg-matcha rounded-full border-4 border-ink opacity-20 animate-bounce"
        style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-20 h-20 bg-strawberry rounded-full border-4 border-ink opacity-20 animate-bounce"
        style={{ animationDelay: '1s', animationDuration: '3.5s' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/brand/Pixel_Boba_Logo_Black.svg"
              alt="pixel boba"
              width={200}
              height={67}
              className="h-16 w-auto"
              priority
            />
          </Link>
          <h1 className="font-black text-4xl text-ink uppercase mb-2">Welcome Back</h1>
          <p className="text-ink/70 font-bold">Sign in to access your client portal</p>
        </div>

        {/* Sign-in Card */}
        <div className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] p-8">
          <div className="space-y-4">
            {/* Google Sign In */}
            {providers?.google && (
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white hover:bg-cream border-3 border-ink rounded-full font-black uppercase text-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-50"
              >
                <Icon icon="flat-color-icons:google" className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-3 border-ink/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-ink/60 font-black uppercase text-xs">Or</span>
              </div>
            </div>

            {/* Email Sign In */}
            {providers?.credentials && (
              <form onSubmit={handleCredentialSignIn} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-black text-ink uppercase mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ink/40"
                      size={20}
                      strokeWidth={2.5}
                    />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="w-full pl-12 pr-4 py-3 border-3 border-ink rounded-lg focus:ring-4 focus:ring-taro/30 focus:border-taro outline-none transition-all font-bold"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-black text-ink uppercase mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ink/40"
                      size={20}
                      strokeWidth={2.5}
                    />
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      className="w-full pl-12 pr-4 py-3 border-3 border-ink rounded-lg focus:ring-4 focus:ring-taro/30 focus:border-taro outline-none transition-all font-bold"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-taro hover:text-deep-taro font-black uppercase"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-taro to-deep-taro text-white font-black py-4 px-6 rounded-full border-3 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Sign In
                  <ArrowRight className="w-5 h-5" strokeWidth={3} />
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-3 border-ink/10 text-center">
            <p className="text-sm text-ink/70 font-bold">
              Don&apos;t have an account?{' '}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="text-taro hover:text-deep-taro font-black uppercase"
              >
                Sign up with Google
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ink/70 hover:text-ink font-black uppercase text-sm"
          >
            <Icon icon="ph:arrow-left-duotone" className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
