import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type ParticipationRateProps = {
  dailyGoal?: number;
  currentCount?: number;
};

const ParticipationRate: React.FC<ParticipationRateProps> = ({ 
  dailyGoal = 5,
  currentCount = 0
}) => {
  const [participationRate, setParticipationRate] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    // Calculate participation rate
    const calculatedRate = Math.min(Math.round((currentCount / dailyGoal) * 100), 100);
    setParticipationRate(calculatedRate);
  }, [currentCount, dailyGoal]);

  // Generate random particles for the animation
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 2,
    duration: Math.random() * 2 + 1,
    delay: Math.random() * 0.5,
  }));

  return (
    <motion.div 
      className="participation-rate-container bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-5 sm:p-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated background particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 30 - 15, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10">
        <div className="text-center sm:text-left">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Votre participation du jour
          </motion.h2>
          <motion.p 
            className="text-lg text-white text-opacity-90"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Objectif quotidien: <span className="font-semibold">{dailyGoal} interactions</span>
          </motion.p>
        </div>

        <div className="relative">
          {/* Outer glowing ring */}
          <motion.div 
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)`,
              filter: "blur(8px)",
            }}
          />

          {/* Main circle container */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            {/* Background circle with gradient */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-white bg-opacity-20"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Progress circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="8"
                stroke="url(#progressGradient)"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: participationRate / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                  strokeDasharray: "283",
                  strokeDashoffset: "283",
                }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="50%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.span 
                  className="block text-4xl sm:text-5xl font-bold text-white"
                  animate={isHovered ? {
                    scale: [1, 1.2, 1],
                    transition: { duration: 0.5 }
                  } : {}}
                >
                  {participationRate}%
                </motion.span>
                <motion.span 
                  className="block text-xs sm:text-sm text-white text-opacity-80 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {currentCount}/{dailyGoal} complétées
                </motion.span>
              </motion.div>
            </div>

            {/* Animated particles around the circle */}
            {isHovered && [
              ...Array(8).fill(null).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-white"
                  initial={{ 
                    x: 0, 
                    y: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 100],
                    y: [0, (Math.random() - 0.5) * 100],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1 + Math.random(),
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: i * 0.1,
                  }}
                  style={{
                    top: '50%',
                    left: '50%',
                    filter: 'blur(1px)',
                  }}
                />
              ))
            ]}
          </div>
        </div>
      </div>

      {/* Motivational message based on participation rate */}
      <motion.div 
        className="mt-6 text-center sm:text-right text-white text-opacity-90"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-sm sm:text-base font-medium">
          {participationRate < 25 ? 
            "Commencez votre journée avec une interaction !" :
            participationRate < 50 ? 
            "Vous êtes sur la bonne voie !" :
            participationRate < 75 ? 
            "Continuez, vous y êtes presque !" :
            participationRate < 100 ? 
            "Plus qu'un petit effort !" :
            "Félicitations, objectif atteint ! 🎉"}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ParticipationRate;
