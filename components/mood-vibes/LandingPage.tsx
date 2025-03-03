import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MoodVibe from './MoodVibe';
import MoodPulse from './MoodPulse';
import MoodChallenge from './MoodChallenge';
import MoodJournal from './MoodJournal';

type FeatureModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  emoji: string;
  children: React.ReactNode;
};

const FeatureModal: React.FC<FeatureModalProps> = ({ isOpen, onClose, title, emoji, children }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-xl w-full max-w-2xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl mr-3">{emoji}</span>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const LandingPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16 relative z-10">
          <motion.h1 
            className="text-3xl md:text-4xl font-extrabold mb-8 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-sm leading-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 10, 
              delay: 0.2 
            }}
            whileHover={{ scale: 1.02 }}
          >
            Partagez vos émotions pour créer
            <br />
            <span className="text-4xl md:text-5xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text">des liens plus forts</span>
          </motion.h1>
          <motion.div 
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium mb-12 relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 50, delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-8 sm:space-y-0 sm:space-x-10">
              <motion.div 
                className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="stroke-current text-gray-200"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="stroke-current text-primary-500"
                    strokeWidth="8"
                    fill="transparent"
                    initial={{ pathLength: 0 }}
                    animate={{ 
                      pathLength: 0.60,
                      rotate: 360
                    }}
                    transition={{ 
                      pathLength: { duration: 2, ease: "easeInOut" },
                      rotate: { duration: 3, ease: "easeInOut" }
                    }}
                    strokeLinecap="round"
                  />
                </svg>
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl font-bold"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 2 }}
                >
                  <span className="bg-gradient-to-br from-primary-500 to-primary-600 text-transparent bg-clip-text">60%</span>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="text-center sm:text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.h4 
                  className="text-lg sm:text-xl font-bold text-primary-600 mb-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Votre Impact Aujourd'hui
                </motion.h4>
                <div className="space-y-3">
                  <motion.div 
                    className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-sm"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" }}
                  >
                    <span className="text-2xl">🎯</span>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm sm:text-base">5 interactions</div>
                      <div className="text-sm text-gray-600">Objectif quotidien</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-sm"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" }}
                  >
                    <span className="text-2xl">✨</span>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm sm:text-base">
                        <span className="text-primary-600">3/5</span> complétées
                      </div>
                      <div className="text-sm text-gray-600">
                        Plus que 2 pour le Badge Amour
                        <motion.span 
                          className="inline-block ml-2"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        >
                          ❤️
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-primary-50 rounded-lg px-4 py-2 opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100 shadow-lg"
              initial={{ y: 10 }}
              whileHover={{ y: 0 }}
            >
              <p className="text-sm text-primary-600">Complétez vos activités pour débloquer des récompenses !</p>
            </motion.div>
          </motion.div>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            className="feature-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
            whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => openModal('vibes')}
          >
            <div className="h-48 bg-blue-100 flex items-center justify-center">
              <motion.div 
                className="text-8xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                🌊
              </motion.div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Mood Vibes</h3>
              <p className="text-gray-600">
                Exprimez vos émotions avec des animations interactives et partagez-les avec vos proches
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="feature-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
            whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onClick={() => openModal('pulse')}
          >
            <div className="h-48 bg-purple-100 flex items-center justify-center">
              <motion.div 
                className="text-8xl"
                animate={{ 
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                💫
              </motion.div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Mood Pulse</h3>
              <p className="text-gray-600">
                Activez votre présence bienveillante et montrez à vos proches que vous êtes là pour eux
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="feature-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
            whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={() => openModal('challenge')}
          >
            <div className="h-48 bg-green-100 flex items-center justify-center">
              <motion.div 
                className="text-8xl"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                💪
              </motion.div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Mood Challenge</h3>
              <p className="text-gray-600">
                Relevez des défis adaptés à votre humeur pour améliorer votre bien-être au quotidien
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mb-16">
          <MoodJournal />
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <a 
            href="/dashboard" 
            className="mood-button inline-block px-8 py-3 text-lg"
          >
            Voir mon journal d'humeur
          </a>
        </motion.div>
      </div>

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
    </div>
  );
};

export default LandingPage;