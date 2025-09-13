import { Suspense } from 'react';
import { Metadata } from 'next';
import SignupForm from '@/components/signup/SignupForm';
import DashboardPearlField from '@/components/animations/DashboardPearlField';

export const metadata: Metadata = {
  title: 'Sign Up | Pixel Boba',
  description: 'Create your Pixel Boba account',
  robots: {
    index: false,
    follow: false,
  },
};

function SignupLoading() {
  return (
    <div className="min-h-screen bg-milk-tea flex items-center justify-center">
      <DashboardPearlField />
      <div className="relative z-10 text-center">
        <div className="w-8 h-8 border-4 border-taro border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-ink/60">Loading...</p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupLoading />}>
      <SignupForm />
    </Suspense>
  );
}
