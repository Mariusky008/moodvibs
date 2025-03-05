import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showProgressPopup, setShowProgressPopup] = useState(true);

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };
  
  // Add event listener for opening mood modals from suggestions
  useEffect(() => {
    const handleOpenMoodModal = (event: CustomEvent) => {
      const { type, recipient } = event.detail;
      console.log(`Opening ${type} modal for ${recipient}`);
      setActiveModal(type);
    };

    window.addEventListener('openMoodModal', handleOpenMoodModal as EventListener);
    
    return () => {
      window.removeEventListener('openMoodModal', handleOpenMoodModal as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mb-8 relative z-10">
          <motion.div 
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 50, delay: 0.5 }}
          >
            {/* Progress Popup */}
            <AnimatePresence>
              {showProgressPopup && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 flex items-center justify-center px-4 z-50"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-xl shadow-xl p-6 border border-primary-100 w-full max-w-md"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-primary-600 to-purple-600 text-transparent bg-clip-text">
                        60% de votre objectif quotidien atteint
                      </div>
                      <button
                        onClick={() => setShowProgressPopup(false)}
                        className="ml-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex flex-col items-center">

                      <div className="text-lg text-primary-600 font-medium mb-6 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="flex items-center bg-primary-50 px-4 py-2 rounded-full border border-primary-200"
                        >
                          <span className="text-2xl mr-2">🎯</span>
                          <span>3/5 interactions</span>
                        </motion.div>
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded-full mb-6 overflow-hidden shadow-inner">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"
                          initial={{ width: 0 }}
                          animate={{ width: "60%" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                      <motion.div
                        className="flex items-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200 shadow-sm w-full"
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.span 
                          className="text-3xl mr-4"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          ❤️
                        </motion.span>
                        <div>
                          <div className="text-lg font-bold text-pink-700 mb-1">Vous êtes proche du badge Amour !</div>
                          <div className="text-sm text-pink-600">Continuez vos interactions bienveillantes</div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>  

        <div className="mb-2 md:mb-16 -mx-4 md:mx-0 bg-transparent">
          <MoodJournal />
        </div>

        {/* Desktop Mood Actions */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-16">
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.02 }}
            onClick={() => openModal('vibes')}
          >
            <motion.span
              className="text-4xl mb-4 inline-block"
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
            </motion.span>
            <h3 className="text-xl font-bold mb-2">Mood Vibes</h3>
            <p className="text-gray-600">Partagez vos émotions et recevez du soutien de manière créative</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.02 }}
            onClick={() => openModal('pulse')}
          >
            <motion.span
              className="text-4xl mb-4 inline-block"
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
            </motion.span>
            <h3 className="text-xl font-bold mb-2">Mood Pulse</h3>
            <p className="text-gray-600">Envoyez une présence silencieuse et réconfortante</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.02 }}
            onClick={() => openModal('challenge')}
          >
            <motion.span
              className="text-4xl mb-4 inline-block"
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
            </motion.span>
            <h3 className="text-xl font-bold mb-2">Mood Challenge</h3>
            <p className="text-gray-600">Relevez des défis pour améliorer votre humeur ensemble</p>
          </motion.div>
        </div>

      </div>

      {/* Mobile Bottom Navigation */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 md:hidden bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-lg z-50"
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
            </motion.span>
            <span className="text-sm font-medium text-gray-600">Vibes</span>
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
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              💫
            </motion.span>
            <span className="text-sm font-medium text-gray-600">Pulse</span>
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
            </motion.span>
            <span className="text-sm font-medium text-gray-600">Challenge</span>
          </motion.button>
        </div>
      </motion.div>

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