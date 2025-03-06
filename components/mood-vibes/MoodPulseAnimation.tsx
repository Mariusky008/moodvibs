import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type MoodPulseAnimationProps = {
  isVisible: boolean;
  onAnimationComplete: () => void;
};

const MoodPulseAnimation: React.FC<MoodPulseAnimationProps> = ({ isVisible, onAnimationComplete }) => {
  useEffect(() => {
    if (isVisible) {
      // Automatically hide the animation after 5 seconds
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete]);

  // Generate multiple hearts with random positions and delays
  const hearts = Array.from({ length: 20 }).map((_, index) => ({
    id: index,
    x: Math.random() * 100, // Random starting position (0-100%)
    delay: Math.random() * 2, // Random delay (0-2s)
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-hidden"
          style={{ pointerEvents: 'none' }}
        >
          {/* Pulsating background */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(45deg, #ff69b4, #ff1493)',
                'linear-gradient(45deg, #ff1493, #ff69b4)',
                'linear-gradient(45deg, #ff69b4, #ff1493)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            style={{
              opacity: 0.3
            }}
          />

          {/* Falling hearts */}
          {hearts.map(heart => (
            <motion.div
              key={heart.id}
              initial={{
                opacity: 0,
                scale: 0,
                x: `${heart.x}vw`,
                y: -20
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 1],
                y: ['0vh', '100vh'],
                x: [`${heart.x}vw`, `${heart.x + (Math.random() * 20 - 10)}vw`]
              }}
              transition={{
                duration: 3,
                delay: heart.delay,
                ease: 'easeOut'
              }}
              className="absolute"
            >
              <span className="text-4xl">❤️</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MoodPulseAnimation;