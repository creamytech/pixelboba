'use client';

import { Builder } from '@builder.io/react';
import { useEffect } from 'react';

// This component initializes Builder.io when loaded
export default function BuilderRegistry() {
  useEffect(() => {
    // Import and register components dynamically
    import('@/lib/builder-registry').then(() => {
      console.log('✅ Builder.io components registered');
    });
  }, []);

  return null;
}
