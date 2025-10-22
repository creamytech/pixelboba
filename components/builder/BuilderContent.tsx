'use client';

import { BuilderComponent, useIsPreviewing } from '@builder.io/react';
import { builder } from '@/lib/builder';
import '@/lib/builder-registry'; // Import to register components

interface BuilderContentProps {
  model: string;
  content: any;
}

/**
 * Builder.io Content Component
 * Renders content from Builder.io visual editor
 * Falls back to children if no content exists or not in preview mode
 */
export default function BuilderContent({
  model,
  content,
  children,
}: BuilderContentProps & { children?: React.ReactNode }) {
  const isPreviewing = useIsPreviewing();

  // If there's Builder content OR we're in preview mode, show Builder component
  if (content || isPreviewing) {
    return <BuilderComponent model={model} content={content} />;
  }

  // Otherwise, show the default page content
  return <>{children}</>;
}
