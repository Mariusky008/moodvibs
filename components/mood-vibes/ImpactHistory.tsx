import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SupportEvent = {
  id: string;
  type: 'pulse' | 'challenge' | 'vibe';
  timestamp: Date;
  fromUserId: string;
  toUserId: string;
  impact: number; // 1-10 scale of how much it helped
  description: string;
  emoji: string;
};

type Achievement = {
  id: string;
  title: string;
  emoji: string;
  progress: number;
  total: number;
  color: string;
};

type ImpactHistoryProps = {
  userId: string;
  friendId: string;
  userName: string;
  friendName: string;
};

const ImpactHistory: React.FC<ImpactHistoryProps> = ({ userId, friendId, userName, friendName }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // In a real app, this would be fetched from an API
  const [supportEvents, setSupportEvents] = React.useState<SupportEvent[]>([
    {
      id: '1',
      type: 'pulse',
      timestamp: new Date(Date.now() - 86400000), // Yesterday
      fromUserId: userId,
      toUserId: friendId,
      impact: 8,
      description: `${userName} a été présent(e) silencieusement pendant que ${friendName} traversait un moment difficile`,
      emoji: '💙'
    },
    {
      id: '2',
      type: 'challenge',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      fromUserId: friendId,
      toUserId: userId,
      impact: 9,
      description: `${friendName} a complété le défi "Défi Respiration" envoyé par ${userName}`,
      emoji: '🧘'
    },
    {
      id: '3',
      type: 'vibe',
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      fromUserId: userId,
      toUserId: friendId,
      impact: 7,
      description: `${userName} a envoyé une vibe "Envie d'un câlin" à ${friendName}`,
      emoji: '💙'
    },
  ]);

  // Achievement data
  const achievements: Achievement[] = [
    {
      id: 'daily-goal',
      title: 'Objectif quotidien',
      emoji: '🎯',
      progress: 5,
      total: 5,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'love-badge',
      title: 'Badge Amour',
      emoji: '❤️',
      progress: 3,
      total: 5,
      color: 'from-pink-500 to-red-600'
    },
    {
      id: 'support-streak',
      title: 'Série de soutien',
      emoji: '✨',
      progress: 7,
      total: 10,
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  // Calculate impact statistics
  const stats = React.useMemo(() => {
    const todayInteractions = supportEvents.filter(e => {
      const today = new Date();
      const eventDate = new Date(e.timestamp);
      return eventDate.getDate() === today.getDate() &&
             eventDate.getMonth() === today.getMonth() &&
             eventDate.getFullYear() === today.getFullYear();
    }).length;

    const highImpactEvents = supportEvents.filter(e => e.impact >= 8).length;
    
    return {
      todayInteractions,
      highImpactEvents,
      totalInteractions: supportEvents.length
    };
  }, [supportEvents]);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'pulse': return 'border-blue-200 bg-blue-50';
      case 'challenge': return 'border-green-200 bg-green-50';
      case 'vibe': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-105">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="text-3xl mr-3">📊</span>
          Votre Impact Aujourd'hui
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className="relative overflow-hidden bg-gradient-to-br p-6 rounded-lg shadow-md cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${achievement.color.split(' ')[1]} 0%, ${achievement.color.split(' ')[3]} 100%)`
              }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedAchievement(achievement)}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{achievement.emoji}</span>
                  <span className="text-white font-bold text-xl">
                    {achievement.progress}/{achievement.total}
                  </span>
                </div>
                
                <h3 className="text-white font-semibold mb-2">{achievement.title}</h3>
                
                <div className="relative h-2 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>

                {achievement.progress === achievement.total && (
                  <motion.div
                    className="absolute top-2 right-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <span className="text-2xl">✨</span>
                  </motion.div>
                )}
              </div>

              <motion.div
                className="absolute inset-0 bg-white opacity-10"
                initial={{ scale: 0, x: '100%' }}
                animate={{
                  scale: [1, 1.5, 1],
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-lg text-white text-center">
            <motion.div
              className="text-3xl font-bold mb-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {stats.todayInteractions}
            </motion.div>
            <div className="text-sm opacity-90">Interactions aujourd'hui</div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-4 rounded-lg text-white text-center">
            <motion.div
              className="text-3xl font-bold mb-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
            >
              {stats.highImpactEvents}
            </motion.div>
            <div className="text-sm opacity-90">Moments à fort impact</div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-lg text-white text-center">
            <motion.div
              className="text-3xl font-bold mb-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.2 }}
            >
              {stats.totalInteractions}
            </motion.div>
            <div className="text-sm opacity-90">Total des interactions</div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <span className="text-6xl mb-4 inline-block">{selectedAchievement.emoji}</span>
                <h3 className="text-2xl font-bold mb-2">{selectedAchievement.title}</h3>
                <p className="text-gray-600 mb-4">
                  {selectedAchievement.progress === selectedAchievement.total
                    ? 'Objectif atteint ! Félicitations !'
                    : `Plus que ${selectedAchievement.total - selectedAchievement.progress} pour compléter cet objectif`}
                </p>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(selectedAchievement.progress / selectedAchievement.total) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration effect */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="p-8 rounded-xl bg-white shadow-2xl text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2">Félicitations !</h3>
              <p className="text-gray-600">Vous avez atteint un nouvel objectif !</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImpactHistory;