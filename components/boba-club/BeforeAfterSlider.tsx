'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  alt: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  alt,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;

    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video overflow-hidden rounded-2xl border-4 border-ink cursor-ew-resize select-none group"
      onMouseDown={handleMouseDown}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* Before Image */}
      <div className="absolute inset-0">
        <Image src={afterImage} alt={`${alt} - After`} fill className="object-cover" />
        <div className="absolute top-4 right-4 bg-matcha text-white px-4 py-2 rounded-full font-bold text-sm border-2 border-ink">
          After
        </div>
      </div>

      {/* After Image with clip */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <Image src={beforeImage} alt={`${alt} - Before`} fill className="object-cover" />
        <div className="absolute top-4 left-4 bg-ink/80 text-white px-4 py-2 rounded-full font-bold text-sm border-2 border-ink">
          Before
        </div>
      </div>

      {/* Slider Line and Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{
          left: `${sliderPosition}%`,
        }}
      >
        {/* Slider Handle */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border-4 border-ink rounded-full shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-ink rounded-full" />
            <div className="w-1 h-4 bg-ink rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Instruction hint */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink/80 text-white px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: isDragging ? 0 : 1 }}
      >
        ← Drag to compare →
      </motion.div>
    </div>
  );
}
