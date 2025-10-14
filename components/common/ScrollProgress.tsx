'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-taro via-matcha to-taro origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Side progress indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <div className="relative h-64 w-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-taro via-matcha to-taro rounded-full"
            style={{ scaleY }}
            initial={{ scaleY: 0 }}
          />

          {/* Animated pearl */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-taro rounded-full shadow-lg"
            style={{
              top: useSpring(scrollYProgress, { stiffness: 100, damping: 30 }),
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </>
  );
}
