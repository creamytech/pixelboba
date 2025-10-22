'use client';

import { useEffect } from 'react';

/**
 * Builder.io Provider Component
 * Loads the component registry for the visual editor
 * Only loaded on marketing pages, not portal/dashboard
 */
export default function BuilderProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Dynamically import the registry only when needed
    import('@/lib/builder-registry').then(() => {
      console.log('✅ Builder.io initialized for marketing pages');
    });
  }, []);

  return <>{children}</>;
}
