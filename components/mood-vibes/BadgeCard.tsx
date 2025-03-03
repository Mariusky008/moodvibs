import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BadgeProps = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  progress: number;
  threshold: number;
  color: string;
  isAnimating?: boolean;
};

const BadgeCard: React.FC<BadgeProps> = ({
  id,
  name,
  emoji,
  description,
  progress,
  threshold,
  color,
  isAnimating = false
}) => {
  const getProgressPercentage = () => {
    return (progress / threshold) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl p-6 shadow-lg relative overflow-hidden"
      style={{
        borderTop: `4px solid ${color}`
      }}
    >
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute inset-0 bg-yellow-400 opacity-30"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center mb-4">
        <span className="text-4xl mr-3">{emoji}</span>
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Niveau actuel</span>
          <span className="font-medium">{progress}/{threshold}</span>
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {progress >= threshold && (
        <motion.div
          className="absolute top-2 right-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <span className="text-2xl">🏆</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BadgeCard;