import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PointsSystemProps {
  initialPoints?: number;
  showAnimation?: boolean;
  compact?: boolean;
  onClose?: () => void;
}

interface PointAction {
  name: string;
  points: number;
  emoji: string;
};

const pointActions: PointAction[] = [
  { name: 'Envoyer un Mood', points: 10, emoji: '🎭' },
  { name: 'Répondre à un Mood', points: 5, emoji: '💬' },
  { name: 'Répondre avec une action', points: 8, emoji: '📞' },
  { name: 'Accepter une demande d\'aide Mood SOS', points: 15, emoji: '🤝' },
  { name: 'Participer à un Mood Challenge', points: 12, emoji: '🏆' },
  { name: 'Streak de 3 jours', points: 5, emoji: '📅' },
  { name: 'Streak de 7 jours', points: 15, emoji: '🔥' },
  { name: 'Streak de 30 jours', points: 50, emoji: '⭐' },
];

const PointsSystem: React.FC<PointsSystemProps> = ({ initialPoints = 145, showAnimation = false, compact = false, onClose }) => {
  const [points, setPoints] = useState<number>(initialPoints);
  const [showPointsAnimation, setShowPointsAnimation] = useState<boolean>(showAnimation);
  const [recentAction, setRecentAction] = useState<PointAction | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  
  // Load visibility preference from localStorage on mount, default to visible
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Force set to visible by default
      setIsVisible(true);
      
      // Initialize localStorage if not set
      const savedVisibility = localStorage.getItem('pointsSystemVisible');
      if (savedVisibility === null) {
        localStorage.setItem('pointsSystemVisible', 'true');
      }
    }
  }, []);
  
  // Simulate a point gain for demonstration purposes
  useEffect(() => {
    if (showAnimation) {
      const randomAction = pointActions[Math.floor(Math.random() * pointActions.length)];
      setRecentAction(randomAction);
      
      setTimeout(() => {
        setPoints(prev => prev + randomAction.points);
        setShowPointsAnimation(true);
        
        setTimeout(() => {
          setShowPointsAnimation(false);
        }, 2000);
      }, 1000);
    }
  }, [showAnimation]);
  
  // Calculate next milestone
  const nextMilestone = Math.ceil(points / 100) * 100;
  const progressToNextMilestone = ((points % 100) / 100) * 100;
  
  const handleClose = () => {
    setIsVisible(false);
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('pointsSystemVisible', 'false');
    }
    // Call parent onClose if provided
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;
  
  return (
    <div className="w-full">
      <motion.div 
        className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 text-white shadow-lg relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background particles for visual interest */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: Math.random() * 40 + 10,
                height: Math.random() * 40 + 10,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 20 - 10],
                x: [0, Math.random() * 20 - 10],
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>
        
        {/* Close button */}
        <motion.button
          className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white z-20"
          onClick={handleClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Fermer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <span className="mr-2">🎯</span>
              Points d'impact
            </h2>
            <p className="text-sm opacity-80">Gagnez des points en interagissant avec vos proches</p>
          </div>
          <div className="relative">
            <motion.div 
              className="text-3xl font-bold"
              animate={showPointsAnimation ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {points} pts
            </motion.div>
            
            <AnimatePresence>
              {showPointsAnimation && recentAction && (
                <motion.div 
                  className="absolute -top-8 right-0 text-sm bg-white text-indigo-600 px-2 py-1 rounded-full font-medium"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  +{recentAction.points} {recentAction.emoji}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Progress to next milestone */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-xs">
            <span>Prochain palier: {nextMilestone} pts</span>
            <span>{Math.floor(progressToNextMilestone)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextMilestone}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </motion.div>
      
      {/* Recent actions list - can be expanded/collapsed */}
      {!compact && (
        <div className="mt-4">
          <details className="group">
            <summary className="flex items-center text-sm font-medium text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors">
              <span className="mr-2">📋</span>
              <span>Comment gagner des points</span>
              <span className="ml-auto transform group-open:rotate-180 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                </svg>
              </span>
            </summary>
            <div className="mt-3 bg-gray-50 rounded-lg p-4 text-sm">
              <ul className="space-y-2">
                {pointActions.map((action, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="mr-2">{action.emoji}</span>
                      <span>{action.name}</span>
                    </span>
                    <span className="font-semibold text-indigo-600">+{action.points} pts</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      )}
      
      {compact && (
        <div className="mt-1">
          <details className="group">
            <summary className="flex items-center text-xs font-medium text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors">
              <span className="mr-1">📋</span>
              <span>Comment gagner des points</span>
            </summary>
            <div className="mt-2 bg-white rounded-lg p-2 text-xs shadow-lg absolute right-0 z-50 w-64 border border-gray-100">
              <ul className="space-y-1">
                {pointActions.map((action, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="mr-1">{action.emoji}</span>
                      <span>{action.name}</span>
                    </span>
                    <span className="font-semibold text-indigo-600">+{action.points} pts</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default PointsSystem;