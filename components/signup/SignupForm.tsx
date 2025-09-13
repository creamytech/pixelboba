'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from 'lucide-react';
import DashboardPearlField from '@/components/animations/DashboardPearlField';

export default function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inviteToken = searchParams.get('invite');

  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(true);
  const [inviteValid, setInviteValid] = useState(false);
  const [inviteData, setInviteData] = useState<{ email: string; role: string } | null>(null);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const validateInvite = async () => {
      try {
        const response = await fetch(`/api/auth/validate-invite?token=${inviteToken}`);
        const data = await response.json();

        if (data.valid) {
          setInviteValid(true);
          setInviteData(data.invite);
          setFormData((prev) => ({ ...prev, email: data.invite.email }));
        } else {
          setError(data.error || 'Invalid invite');
        }
      } catch (error) {
        console.error('Error validating invite:', error);
        setError('Error validating invite');
      } finally {
        setInviteLoading(false);
      }
    };

    const validateInviteToken = async () => {
      if (inviteToken) {
        await validateInvite();
      } else {
        setInviteLoading(false);
        setError('No invite token provided');
      }
    };

    validateInviteToken();
  }, [inviteToken]);

  const handleManualSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          inviteToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Account created successfully, now sign them in automatically
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          // Redirect based on role
          const redirectUrl = data.user.role === 'CLIENT' ? '/portal' : '/admin';
          router.push(redirectUrl);
        } else {
          // If auto-signin fails, redirect to login with success message
          router.push('/login?message=Account created successfully. Please sign in.');
        }
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      // Store invite token in localStorage for the callback
      if (inviteToken) {
        localStorage.setItem('inviteToken', inviteToken);
      }

      const result = await signIn('google', {
        redirect: false,
      });

      if (result?.ok) {
        // After successful Google sign-in, redirect to the appropriate portal
        // The role will be determined by the auth callback from the invite
        window.location.href = '/portal';
      } else if (result?.error) {
        setError('Failed to sign up with Google: ' + result.error);
        setLoading(false);
      }
    } catch (error) {
      setError('Failed to sign up with Google');
      setLoading(false);
    }
  };

  if (inviteLoading) {
    return (
      <div className="min-h-screen bg-milk-tea flex items-center justify-center">
        <DashboardPearlField />
        <div className="relative z-10 text-center">
          <div className="w-8 h-8 border-4 border-taro border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ink/60">Validating invite...</p>
        </div>
      </div>
    );
  }

  if (!inviteValid) {
    return (
      <div className="min-h-screen bg-milk-tea flex items-center justify-center">
        <DashboardPearlField />
        <div className="relative z-10 max-w-md mx-auto text-center p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-brown-sugar/20 shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-ink mb-4">Invalid Invite</h1>
            <p className="text-ink/60 mb-6">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-taro text-white py-3 rounded-lg font-medium hover:bg-taro/80 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-milk-tea flex items-center justify-center p-4">
      <DashboardPearlField />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-brown-sugar/20 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-taro/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-taro" />
            </div>
            <h1 className="font-display text-2xl font-bold text-ink mb-2">Welcome to Pixel Boba</h1>
            <p className="text-ink/60">
              You&apos;ve been invited as a{' '}
              <span className="font-semibold text-taro">{inviteData?.role}</span>
            </p>
            <p className="text-sm text-ink/50 mt-1">{inviteData?.email}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-white border border-brown-sugar/20 rounded-lg py-3 px-4 font-medium text-ink hover:bg-gray-50 transition-colors disabled:opacity-50 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brown-sugar/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-ink/60">or create account manually</span>
            </div>
          </div>

          {/* Manual Sign Up Form */}
          <form onSubmit={handleManualSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/40" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-milk-tea/50 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/40" />
                <input
                  type="email"
                  required
                  disabled
                  value={formData.email}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-brown-sugar/20 rounded-lg text-ink opacity-60 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-ink/50 mt-1">Email is pre-filled from your invite</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 bg-milk-tea/50 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink/40 hover:text-ink"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-milk-tea/50 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-taro text-white py-3 rounded-lg font-medium hover:bg-taro/80 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-brown-sugar/20">
            <p className="text-sm text-ink/60">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-taro hover:text-taro/80 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
