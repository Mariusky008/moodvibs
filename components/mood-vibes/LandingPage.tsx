import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoodVibe from './MoodVibe';
import MoodPulse from './MoodPulse';
import MoodChallenge from './MoodChallenge';
import MoodJournal from './MoodJournal';

type ModalType = 'vibes' | 'pulse' | 'challenge' | 'journal' | null;

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  emoji: string;
  children: React.ReactNode;
}

const FeatureModal: React.FC<FeatureModalProps> = ({ isOpen, onClose, title, emoji, children }) => {
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
        className="bg-white dark:bg-gray-900 w-full max-w-2xl mx-4 overflow-hidden shadow-lg"
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Interagissez avec vos proches</p>
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
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={() => setShowJournal(true)}
              className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-full text-lg font-semibold transform hover:scale-105 transition-all border-2 border-primary-600 inline-flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">👋</span>
              Découvrir mes moods
            </motion.button>
          </motion.div>
        </div>

        {/* Journal Section */}
        <AnimatePresence>
          {showJournal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full mb-16"
            >
              <MoodJournal />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16 hidden md:grid">
          <motion.div 
            className="px-6 py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-blue-900"
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
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Partagez vos émotions avec vos proches et recevez leur soutien en temps réel</p>
          </motion.div>

          <motion.div 
            className="px-6 py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 border border-purple-100 dark:border-purple-900"
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
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Envoyez une présence silencieuse et réconfortante à ceux qui en ont besoin</p>
          </motion.div>

          <motion.div 
            className="px-6 py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 border border-green-100 dark:border-green-900"
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
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Relevez des défis émotionnels et encouragez vos amis à progresser</p>
          </motion.div>
        </div>

        {/* Mobile Bottom Navigation */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-lg z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="flex justify-around items-center p-4">
            <motion.button
              onClick={() => openModal('vibes')}
              className="flex flex-col items-center space-y-1"
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
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Vibes</span>
            </motion.button>

            <motion.button
              onClick={() => openModal('pulse')}
              className="flex flex-col items-center space-y-1"
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
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Pulse</span>
            </motion.button>

            <motion.button
              onClick={() => openModal('challenge')}
              className="flex flex-col items-center space-y-1"
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
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Challenge</span>
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
            >
              <MoodChallenge 
                userId="demo-user"
                userName="Utilisateur"
              />
            </FeatureModal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingPage;