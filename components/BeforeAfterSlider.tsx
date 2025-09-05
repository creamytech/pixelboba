'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = '',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      updateSliderPosition(e.clientX);
    },
    [updateSliderPosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    },
    [isDragging, updateSliderPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      updateSliderPosition(e.touches[0].clientX);
    },
    [updateSliderPosition]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      e.preventDefault();
      updateSliderPosition(e.touches[0].clientX);
    },
    [isDragging, updateSliderPosition]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div className={`relative w-full max-w-[90rem] mx-auto ${className}`}>
      <div
        ref={containerRef}
        className="relative h-[600px] md:h-[700px] lg:h-[800px] bg-gray-200 rounded-lg overflow-hidden cursor-col-resize select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Before Image (shown on left) */}
        <div className="absolute inset-0">
          <Image src={beforeImage} alt={beforeLabel} fill className="object-contain" priority />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {beforeLabel}
          </div>
        </div>

        {/* After Image with Clip Path (revealed from right) */}
        <div
          className="absolute inset-0 transition-all duration-75 ease-out"
          style={{
            clipPath: `inset(0 0 0 ${sliderPosition}%)`,
          }}
        >
          <Image src={afterImage} alt={afterLabel} fill className="object-contain" priority />
          <div className="absolute top-4 right-4 bg-taro text-white px-3 py-1 rounded-full text-sm font-medium">
            {afterLabel}
          </div>
        </div>

        {/* Slider Line and Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-75 ease-out"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Slider Handle */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border-2 border-taro cursor-col-resize flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex space-x-1">
              <div className="w-1 h-6 bg-taro rounded-full"></div>
              <div className="w-1 h-6 bg-taro rounded-full"></div>
            </div>
          </motion.div>

          {/* Top and Bottom Arrows */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center">
            <svg className="w-4 h-4 text-taro" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center">
            <svg className="w-4 h-4 text-taro rotate-180" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
          Drag to compare
        </div>
      </div>
    </div>
  );
}
