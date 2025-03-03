import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import CustomObjectiveForm from '../components/mood-vibes/CustomObjective';
import BadgeCard from '../components/mood-vibes/BadgeCard';

type Badge = {
  id: string;
  name: string;
  type: 'love' | 'trust' | 'help' | 'serenity' | 'sharing';
  emoji: string;
  description: string;
  progress: number;
  threshold: number;
  color: string;
  unlockMessage?: string;
  effect?: 'sparkle' | 'pulse' | 'rotate' | 'bounce' | 'glow';
};

const predefinedObjectives = [
  {
    id: '1',
    name: 'Compagnon Bienveillant',
    emoji: '❤️',
    conditions: 'Avoir soutenu l\'autre 10 fois dans un moment difficile',
    effect: 'Amour',
    visualDescription: 'Animation d\'un cœur qui pulse doucement',
    target: 10,
    current: 0,
    badgeType: 'love',
    color: '#FF6B6B'
  },
  {
    id: '2',
    name: 'Pilier de Confiance',
    emoji: '🤝',
    conditions: 'Avoir activé Mood Pulse au moins 5 fois et reçu un retour positif',
    effect: 'Confiance',
    visualDescription: 'Un effet lumineux autour de l\'avatar',
    target: 5,
    current: 0,
    badgeType: 'trust',
    color: '#4ECDC4'
  },
  {
    id: '3',
    name: 'Guide Lumineux',
    emoji: '💡',
    conditions: 'Avoir complété 5 Mood Challenges pour aider l\'autre',
    effect: 'Aide',
    visualDescription: 'Une petite étoile scintillante sur le profil',
    target: 5,
    current: 0,
    badgeType: 'help',
    color: '#45B7D1'
  },
  {
    id: '4',
    name: 'Maître Zen',
    emoji: '☯️',
    conditions: 'Avoir résolu 10 moments de colère grâce aux interactions',
    effect: 'Sérénité',
    visualDescription: 'Une vague d\'eau apaisante sur le fond de l\'écran',
    target: 10,
    current: 0,
    badgeType: 'serenity',
    color: '#96CEB4'
  },
  {
    id: '5',
    name: 'Écho Émotionnel',
    emoji: '🔄',
    conditions: 'Avoir répondu à 20 vibes envoyées par l\'autre',
    effect: 'Partage',
    visualDescription: 'Effet d\'ondes circulaires sur la carte de l\'utilisateur',
    target: 20,
    current: 0,
    badgeType: 'sharing',
    color: '#D4A5A5'
  }
];

const ObjectivesPage = () => {
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: '1',
      name: 'Amour',
      type: 'love',
      emoji: '❤️',
      description: 'Partagez l\'amour en envoyant des vibes positives',
      progress: 3,
      threshold: 5,
      color: '#FF6B6B',
      unlockMessage: 'Vous rayonnez d\'amour et de bienveillance!',
      effect: 'sparkle'
    },
    {
      id: '2',
      name: 'Confiance',
      type: 'trust',
      emoji: '🤝',
      description: 'Construisez la confiance en relevant des défis',
      progress: 2,
      threshold: 4,
      color: '#4ECDC4',
      unlockMessage: 'Vous êtes un pilier de confiance pour vos proches!',
      effect: 'pulse'
    },
    {
      id: '3',
      name: 'Aide',
      type: 'help',
      emoji: '🌟',
      description: 'Aidez les autres en répondant à leurs besoins',
      progress: 4,
      threshold: 6,
      color: '#45B7D1',
      unlockMessage: 'Votre soutien fait une différence réelle!',
      effect: 'glow'
    },
    {
      id: '4',
      name: 'Sérénité',
      type: 'serenity',
      emoji: '🌸',
      description: 'Cultivez la sérénité en partageant des moments calmes',
      progress: 1,
      threshold: 3,
      color: '#96CEB4',
      unlockMessage: 'Vous apportez calme et paix autour de vous!',
      effect: 'bounce'
    },
    {
      id: '5',
      name: 'Partage',
      type: 'sharing',
      emoji: '🤗',
      description: 'Enrichissez la communauté par vos partages',
      progress: 5,
      threshold: 7,
      color: '#D4A5A5',
      unlockMessage: 'Votre générosité inspire tout le monde!',
      effect: 'rotate'
    }
  ]);

  const [showBadgeAnimation, setShowBadgeAnimation] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(320);
  const [showUnlockModal, setShowUnlockModal] = useState<{show: boolean, badge: Badge | null}>({show: false, badge: null});
  const [selectedBadgeTypes, setSelectedBadgeTypes] = useState<string[]>([]);

  const getBadgeProgress = (badge: Badge) => {
    return (badge.progress / badge.threshold) * 100;
  };

  return (
    <Layout title="Objectifs">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Objectifs</h1>

        {/* Selected Objectives Display */}
        {selectedBadgeTypes.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 mb-6 shadow-md border border-gray-100"
          >
            <h3 className="text-sm font-medium text-gray-600 mb-2">Objectifs en cours</h3>
            <div className="flex flex-wrap gap-2">
              {selectedBadgeTypes.map((type) => {
                const objective = predefinedObjectives.find(obj => obj.badgeType === type);
                if (!objective) return null;
                return (
                  <div 
                    key={type}
                    className="flex items-center px-3 py-1.5 rounded-full text-sm"
                    style={{ 
                      backgroundColor: `${objective.color}20`,
                      color: objective.color
                    }}
                  >
                    <span className="mr-1.5">{objective.emoji}</span>
                    <span className="font-medium">{objective.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      
        {/* Points counter */}
        <motion.div 
          className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 mb-8 text-white shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Points d'impact</h2>
              <p className="text-sm opacity-80">Gagnez des points en complétant des objectifs</p>
            </div>
            <div className="text-3xl font-bold">{totalPoints} pts</div>
          </div>
        </motion.div>
      
        {/* Objectifs spéciaux à débloquer */}
        <div className="mb-12">
          <CustomObjectiveForm 
            onObjectiveSelect={(badgeTypes) => {
              setSelectedBadgeTypes(badgeTypes);
            }}
          />
        </div>
      
        {/* Badges et récompenses */}
        <h2 className="text-2xl font-bold text-center mb-6">Vos badges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <BadgeCard
              key={badge.id}
              id={badge.id}
              name={badge.name}
              emoji={badge.emoji}
              description={badge.description}
              progress={badge.progress}
              threshold={badge.threshold}
              color={badge.color}
              isAnimating={showBadgeAnimation === badge.id}
            />
          ))}
        </div>
      </div>

      {/* Badge unlock modal */}
      <AnimatePresence>
        {showUnlockModal.show && showUnlockModal.badge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-md w-full text-center relative overflow-hidden"
            >
              {/* Background effects */}
              <motion.div
                className="absolute inset-0 -z-10 opacity-20"
                animate={{
                  background: [
                    `radial-gradient(circle at 30% 30%, ${showUnlockModal.badge.color}, transparent 70%)`,
                    `radial-gradient(circle at 70% 70%, ${showUnlockModal.badge.color}, transparent 70%)`
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              />
              
              {/* Confetti effect */}
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  initial={{ 
                    x: "50%", 
                    y: "50%",
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{ 
                    x: `${Math.random() * 120 - 10}%`, 
                    y: `${Math.random() * 120 - 10}%`,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2, 
                    ease: "easeOut",
                    times: [0, 0.2, 1]
                  }}
                  style={{ 
                    backgroundColor: showUnlockModal.badge.color,
                    boxShadow: `0 0 2px ${showUnlockModal.badge.color}`,
                    left: `calc(50% + ${Math.random() * 100 - 50}px)`,
                    top: `calc(50% + ${Math.random() * 100 - 50}px)`
                  }}
                />
              ))}
              
              <motion.div
                className="mb-6 text-6xl"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1], rotate: [0, 20, 0] }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {showUnlockModal.badge.emoji}
              </motion.div>
              
              <motion.h3 
                className="text-2xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Badge {showUnlockModal.badge.name} débloqué!
              </motion.h3>
              
              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {showUnlockModal.badge.unlockMessage || "Félicitations pour cette réussite!"}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ObjectivesPage;