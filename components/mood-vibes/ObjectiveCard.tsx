import React from 'react';
import { motion } from 'framer-motion';

type ObjectiveProps = {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  type: 'vibe' | 'pulse' | 'challenge' | 'response';
  badge: string;
  rewardPoints: number;
  specialObjectiveId?: string;
  specialObjectiveProgress?: {
    current: number;
    target: number;
  };
  onComplete?: () => void;
};

const ObjectiveCard: React.FC<ObjectiveProps> = ({
  id,
  title,
  description,
  target,
  current,
  type,
  badge,
  rewardPoints,
  specialObjectiveId,
  specialObjectiveProgress,
  onComplete
}) => {
  const getProgressPercentage = () => {
    return (current / target) * 100;
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'vibe': return '🌈';
      case 'pulse': return '💫';
      case 'challenge': return '🎯';
      case 'response': return '💭';
      default: return '📌';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-primary-500"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-semibold">{title}</h3>
            <span className="text-sm px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
              +{rewardPoints} pts
            </span>
          </div>
          <p className="text-gray-600">{description}</p>
          <div className="flex items-center mt-3 text-sm text-gray-500">
            <span className="mr-2">{getTypeIcon()}</span>
            <span className="capitalize">{type}</span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <span className="mr-1">Badge</span>
              <span className="text-primary-600 font-medium capitalize">{badge}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Progression quotidienne</span>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{current}</span>
            <span className="text-gray-400">/</span>
            <span className="font-medium">{target}</span>
          </div>
        </div>
        {specialObjectiveId && specialObjectiveProgress && (
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-primary-600">Progression spéciale</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-primary-600">{specialObjectiveProgress.current}</span>
              <span className="text-gray-400">/</span>
              <span className="font-medium text-primary-600">{specialObjectiveProgress.target}</span>
            </div>
          </div>
        )}
        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-500 to-primary-400"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 1 }}
          >
            {getProgressPercentage() >= 100 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.div>
        </div>
      </div>

      {current >= target ? (
        <div className="mt-4 flex justify-end">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium"
          >
            <span className="mr-2">✨</span> Objectif accompli
          </motion.div>
        </div>
      ) : (
        <motion.button
          onClick={onComplete}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full px-4 py-2 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors"
        >
          Valider une étape
        </motion.button>
      )}
    </motion.div>
  );
};

export default ObjectiveCard;