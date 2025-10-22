'use client';

import { BuilderComponent } from '@builder.io/react';
import '@/lib/builder-registry';

interface RenderBuilderContentProps {
  content: any;
}

export function RenderBuilderContent({ content }: RenderBuilderContentProps) {
  return <BuilderComponent model="page" content={content} />;
}
