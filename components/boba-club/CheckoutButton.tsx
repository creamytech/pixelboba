'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
  className?: string;
  children: React.ReactNode;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export default function CheckoutButton({
  className,
  children,
  size = 'lg',
  variant = 'default',
}: CheckoutButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError('');

      // Call checkout API
      const response = await fetch('/api/boba-club/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start checkout');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleCheckout}
        disabled={loading}
        size={size}
        variant={variant}
        className={className}
      >
        {loading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Processing...
          </>
        ) : (
          children
        )}
      </Button>
      {error && (
        <p className="absolute top-full mt-2 text-sm text-red-500 whitespace-nowrap">{error}</p>
      )}
    </div>
  );
}
