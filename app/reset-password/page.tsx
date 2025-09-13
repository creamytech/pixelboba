import { Suspense } from 'react';
import { Metadata } from 'next';
import ResetPasswordForm from '@/components/reset-password/ResetPasswordForm';
import DashboardPearlField from '@/components/animations/DashboardPearlField';

export const metadata: Metadata = {
  title: 'Reset Password | Pixel Boba',
  description: 'Reset your Pixel Boba account password',
  robots: {
    index: false,
    follow: false,
  },
};

function ResetPasswordLoading() {
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
