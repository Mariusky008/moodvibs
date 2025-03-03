import React from 'react';
import { motion } from 'framer-motion';

type DailyImpactProps = {
  dailyInteractions?: number;
  dailyGoal?: number;
  badgeProgress?: number;
  badgeGoal?: number;
};

const DailyImpact: React.FC<DailyImpactProps> = ({
  dailyInteractions = 5,
  dailyGoal = 5,
  badgeProgress = 3,
  badgeGoal = 5
}) => {
  return (
    <div className="mood-section bg-white rounded-xl shadow-lg p-4 sm:p-6 transform transition-all hover:scale-105 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 text-center sm:text-left">
        <span className="text-3xl sm:text-4xl mx-auto sm:mx-0 sm:mr-3 mb-2 sm:mb-0">✨</span>
        <h2 className="text-xl sm:text-2xl font-bold">Votre Impact Aujourd'hui</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-center">
            <span className="text-3xl mb-2 block">🎯</span>
            <p className="text-lg font-semibold text-blue-800">{dailyInteractions} interactions</p>
            <p className="text-sm text-blue-600">Objectif quotidien</p>
          </div>
        </motion.div>

        <motion.div
          className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-blue-50 border border-green-100"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-center">
            <span className="text-3xl mb-2 block">✨</span>
            <p className="text-lg font-semibold text-green-800">{badgeProgress}/{badgeGoal}</p>
            <p className="text-sm text-green-600">complétées</p>
          </div>
        </motion.div>

        <motion.div
          className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-red-50 border border-pink-100"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-center">
            <span className="text-3xl mb-2 block">❤️</span>
            <p className="text-lg font-semibold text-pink-800">Plus que {badgeGoal - badgeProgress}</p>
            <p className="text-sm text-pink-600">pour le Badge Amour</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DailyImpact;