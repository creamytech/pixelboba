'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CatIllustrationProps {
  src: '/01.svg' | '/02.svg' | '/03.svg';
  position: 'top-right' | 'bottom-left' | 'right-center' | 'top-center' | 'left-center';
  size?: 'sm' | 'md' | 'lg';
  opacity?: number;
  parallax?: boolean;
  flipHorizontal?: boolean;
  hideOnMobile?: boolean;
  className?: string;
}

export default function CatIllustration({
  src,
  position,
  size = 'md',
  opacity = 0.7,
  parallax = false,
  flipHorizontal = false,
  hideOnMobile = true,
  className,
}: CatIllustrationProps) {
  const sizes = {
    sm: 'w-[300px]',
    md: 'w-[400px]',
    lg: 'w-[500px]',
  };

  const positions = {
    'top-right': 'absolute -top-48 -right-32 lg:-right-48',
    'bottom-left': 'absolute -bottom-48 -left-32 lg:-left-48',
    'right-center': 'absolute top-1/2 -right-32 lg:-right-48 -translate-y-1/2',
    'left-center': 'absolute top-1/2 -left-32 lg:-left-48 -translate-y-1/2',
    'top-center': 'absolute -top-48 left-1/2 -translate-x-1/2',
  };

  return (
    <motion.div
      className={cn(
        positions[position],
        sizes[size],
        'pointer-events-none z-10',
        hideOnMobile && 'hidden lg:block',
        className
      )}
      style={{ opacity }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <Image
        src={src}
        alt=""
        width={1202}
        height={638}
        className={cn('w-full h-auto', flipHorizontal && 'scale-x-[-1]')}
        priority={position === 'top-right'}
        loading={position === 'top-right' ? undefined : 'lazy'}
      />
    </motion.div>
  );
}
