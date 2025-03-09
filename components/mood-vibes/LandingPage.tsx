import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoodVibe from './MoodVibe';
import MoodPulse from './MoodPulse';
import MoodChallenge from './MoodChallenge';
import MoodJournal from './MoodJournal';
import MoodMusic from './MoodMusic';
import PointsSystem from './PointsSystem';

type ModalType = 'vibes' | 'pulse' | 'challenge' | 'music' | 'journal' | null;

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  emoji: string;
  children: React.ReactNode;
  bgColorClass?: string;
}

const FeatureModal: React.FC<FeatureModalProps> = ({ isOpen, onClose, title, emoji, children, bgColorClass }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className={`${bgColorClass || 'bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-700 dark:to-gray-800'} w-full max-w-2xl mx-4 overflow-hidden shadow-lg`}
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{emoji}</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Interagissez avec vos proches</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
          <div className="max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LandingPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showJournal, setShowJournal] = useState(false);

  const openModal = (type: ModalType) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Toggle journal visibility with animation
  const toggleJournal = () => {
    setShowJournal(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16 relative z-10">
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-sm leading-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 10, 
              delay: 0.2 
            }}
            whileHover={{ scale: 1.05 }}
          >
            MoodVibes
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 50, 
              delay: 0.5 
            }}
          >
            donnez une nouvelle dimension à vos émotions
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={toggleJournal}
              className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-full text-lg font-semibold transform transition-all border-2 border-primary-600 inline-flex items-center justify-center shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              whileTap={{ scale: 0.98 }}
              animate={{
                scale: showJournal ? [1, 1.05, 1] : 1,
                boxShadow: showJournal 
                  ? ["0 4px 6px -1px rgba(0, 0, 0, 0.1)", "0 15px 25px -5px rgba(0, 0, 0, 0.1)", "0 4px 6px -1px rgba(0, 0, 0, 0.1)"]
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut"
              }}
            >
              <motion.span 
                className="mr-2"
                animate={{
                  rotate: showJournal ? [0, -10, 10, -10, 0] : 0
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut"
                }}
              >
                {showJournal ? "✨" : "👋"}
              </motion.span>
              {showJournal ? "Masquer mes moods" : "Découvrir mes moods"}
            </motion.button>
          </motion.div>
          
          {/* Journal Section with improved animation */}
          <AnimatePresence mode="wait">
            {showJournal && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  height: "auto",
                  transition: {
                    height: { duration: 0.4 },
                    opacity: { duration: 0.3, delay: 0.2 }
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  y: -20, 
                  height: 0,
                  transition: {
                    height: { duration: 0.3 },
                    opacity: { duration: 0.2 }
                  }
                }}
                className="w-full mb-12 overflow-hidden"
              >
                <MoodJournal />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Points System */}
          

          <motion.div 
            className="px-6 py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-800 dark:to-pink-800 border border-rose-200 dark:border-rose-700 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => openModal('music')}
          >
            {/* Bandeau NOUVEAU */}
            <div className="absolute top-0 right-0 bg-rose-500 text-white px-4 py-1 text-sm font-bold transform rotate-45 translate-x-6 translate-y-4 shadow-lg">
              NOUVEAU
            </div>
            <motion.div 
              className="absolute top-0 right-0 w-32 h-32 bg-pink-400/10 rounded-full -mr-16 -mt-16 blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.3, 0.5]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
            <motion.div 
              className="text-5xl mb-6 relative flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              🎵
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent dark:from-rose-400 dark:to-pink-400">Mood Music</h3>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">Découvrez et partagez une musique aléatoire avec vos proches en même temps</p>
          </motion.div>
        </div>



        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 hidden md:grid">
          <motion.div 
            className="px-6 py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-blue-900 h-full flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => openModal('vibes')}
          >
            <motion.div 
              className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -mr-16 -mt-16 blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.3, 0.5]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
            <motion.div 
              className="text-5xl mb-6 relative flex items-center justify-center"
              animate={{ 
                y: [0, -4, 0]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              🌊
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">Mood Vibes</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">Partagez vos émotions avec vos proches et recevez leur soutien en temps réel</p>
          </motion.div>

          <motion.div 
            className="px-6 py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 border border-purple-100 dark:border-purple-900 h-full flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => openModal('pulse')}
          >
            <motion.div 
              className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full -mr-16 -mt-16 blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.3, 0.5]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
            <motion.div 
              className="text-5xl mb-6 relative flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              💫
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">Mood Pulse</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">Envoyez une présence silencieuse et réconfortante à ceux qui en ont besoin</p>
          </motion.div>

          <motion.div 
            className="px-6 py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 border border-green-100 dark:border-green-900 h-full flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => openModal('challenge')}
          >
            <motion.div 
              className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full -mr-16 -mt-16 blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.3, 0.5]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
            <motion.div 
              className="text-5xl mb-6 relative flex items-center justify-center"
              animate={{ 
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              💪
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent dark:from-green-400 dark:to-teal-400">Mood Challenge</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">Relevez des défis émotionnels et encouragez vos amis à progresser</p>
          </motion.div>

          <motion.div 
            className="px-6 py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border border-amber-100 dark:border-amber-900 h-full flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => openModal('music')}
          >
            <motion.div 
              className="absolute top-0 right-0 w-32 h-32 bg-pink-400/10 rounded-full -mr-16 -mt-16 blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.3, 0.5]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
            <motion.div 
              className="text-5xl mb-6 relative flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              🎵
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">Mood Music</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">Découvrez et partagez une musique aléatoire avec vos proches en même temps</p>
          </motion.div>
        </div>

        {/* Mobile Bottom Navigation */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-xl z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="flex justify-around items-center p-4">
            <motion.button
              onClick={() => openModal('vibes')}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="text-2xl"
                animate={{ 
                  y: [0, -3, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                🌊
              </motion.span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Vibes</span>
            </motion.button>

            <motion.button
              onClick={() => openModal('pulse')}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="text-2xl"
                animate={{ 
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                💫
              </motion.span>
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Pulse</span>
            </motion.button>

            <motion.button
              onClick={() => openModal('challenge')}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="text-2xl"
                animate={{ 
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                💪
              </motion.span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">Challenge</span>
            </motion.button>

            <motion.button
              onClick={() => openModal('music')}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="text-2xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                🎵
              </motion.span>
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Music</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Feature Modals */}
        <AnimatePresence>
          {activeModal === 'vibes' && (
            <FeatureModal 
              isOpen={activeModal === 'vibes'} 
              onClose={closeModal}
              title="Mood Vibes"
              emoji="🌊"
              bgColorClass="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-800 dark:to-indigo-900"
            >
              <MoodVibe 
                userId="demo-user"
                userName="Utilisateur"
                onSendVibe={(emotion, recipientId) => console.log(emotion, recipientId)}
              />
            </FeatureModal>
          )}

          {activeModal === 'pulse' && (
            <FeatureModal 
              isOpen={activeModal === 'pulse'} 
              onClose={closeModal}
              title="Mood Pulse"
              emoji="💫"
              bgColorClass="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900"
            >
              <MoodPulse 
                userId="demo-user"
                userName="Utilisateur"
              />
            </FeatureModal>
          )}

          {activeModal === 'challenge' && (
            <FeatureModal 
              isOpen={activeModal === 'challenge'} 
              onClose={closeModal}
              title="Mood Challenge"
              emoji="💪"
              bgColorClass="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900"
            >
              <MoodChallenge 
                userId="demo-user"
                userName="Utilisateur"
              />
            </FeatureModal>
          )}

          {activeModal === 'music' && (
            <FeatureModal 
              isOpen={activeModal === 'music'} 
              onClose={closeModal}
              title="Mood Music"
              emoji="🎵"
              bgColorClass="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900"
            >
              <MoodMusic 
                userId="demo-user"
                userName="Utilisateur"
                onSendMusic={(musicId, recipientId) => console.log(musicId, recipientId)}
              />
            </FeatureModal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingPage;