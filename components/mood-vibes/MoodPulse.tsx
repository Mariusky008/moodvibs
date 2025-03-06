import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import MoodPulseAnimation from './MoodPulseAnimation';

type MoodPulseProps = {
  userId: string;
  userName: string;
  avatarUrl?: string;
  onSendPulse?: (recipientId: string) => void;
};

type Recipient = {
  id: string;
  name: string;
};

type ModalState = 'preview' | 'recipient' | 'success' | null;

const MoodPulse: React.FC<MoodPulseProps> = ({ userId, userName, avatarUrl, onSendPulse }) => {
  const [isPulseActive, setIsPulseActive] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [currentModal, setCurrentModal] = useState<ModalState>(null);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [lastRecipientName, setLastRecipientName] = useState<string>('');
  const [recipientCounts, setRecipientCounts] = useState<Record<string, number>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [pulseColor, setPulseColor] = useState('#3B82F6');
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseControls = useAnimation();
  const buttonControls = useAnimation();

  // Mock recipients data (replace with actual data in production)
  const mockRecipients: Recipient[] = [
    { id: '1', name: 'Sophie' },
    { id: '2', name: 'Thomas' },
    { id: '3', name: 'Emma' },
  ];

  // Clean up any timers when component unmounts
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleActivatePulse = useCallback(() => {
    setCurrentModal('preview');
  }, []);

  const handlePreviewConfirm = useCallback(() => {
    setCurrentModal('recipient');
  }, []);

  const handleSendPulse = useCallback((): void => {
    if (!selectedRecipient) return;

    // Find the recipient name from the ID
    const recipient = mockRecipients.find(r => r.id === selectedRecipient);
    const recipientName = recipient ? recipient.name : '';
    
    // Call the onSendPulse prop if it exists
    if (onSendPulse) {
      onSendPulse(selectedRecipient);
    }

    // Update UI states
    setIsPulseActive(true);
    setSupportCount((prev: number) => prev + 1);
    setCurrentModal('success');
    
    // Update recipient tracking
    setLastRecipientName(recipientName);
    setRecipientCounts(prev => ({
      ...prev,
      [selectedRecipient]: (prev[selectedRecipient] || 0) + 1
    }));
    
    // Trigger confetti animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);

    // Clear any existing timeout
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    
    // Set up new timeout for cleanup - show success message for 2 seconds
    resetTimerRef.current = setTimeout(() => {
      setCurrentModal(null);
      setSelectedRecipient('');
      setIsPulseActive(false);
      resetTimerRef.current = null;
    }, 2000);
  }, [selectedRecipient, onSendPulse]);

  const handleCloseModal = useCallback(() => {
    setCurrentModal(null);
    setSelectedRecipient('');
  }, []);

  return (
    <div className="mood-container relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xl">{userName[0]}</span>
            </div>
          )}
          <AnimatePresence>
            {isPulseActive && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={pulseControls}
                  exit={{ scale: 1, opacity: 0, transition: { duration: 0.5 } }}
                  style={{
                    backgroundColor: '#3B82F6',
                    filter: 'blur(12px)',
                    zIndex: 0
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 1.2, opacity: 0.3 }}
                  animate={{
                    scale: [1.2, 1.8, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  exit={{ scale: 1.2, opacity: 0, transition: { duration: 0.5 } }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  style={{
                    backgroundColor: pulseColor,
                    filter: 'blur(15px)',
                    zIndex: 0
                  }}
                />
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 sm:ml-4">
          <h3 className="font-medium text-lg">{userName}</h3>
          <p className="text-sm text-gray-500">
            {isPulseActive ? "Je suis là si tu veux" : "Silencieux"}
          </p>
        </div>

        <button
          onClick={handleActivatePulse}
          className="mood-button transition-all w-full sm:w-auto mt-4 sm:mt-0"
          disabled={isPulseActive}
        >
          Envoyer une présence
        </button>
      </div>

      {supportCount > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Présence silencieuse partagée {supportCount} fois
        </div>
      )}
      
      {lastRecipientName && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,235,235,0.9) 100%)',
            boxShadow: '0 4px 15px rgba(255,0,0,0.1)',
            border: '1px solid rgba(255,200,200,0.3)'
          }}
        >
          <div className="flex items-center text-sm">
            <motion.span 
              className="text-red-500 mr-2 text-xl"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ❤️
            </motion.span>
            <div>
              <span className="font-medium text-gray-800">Envoyée à </span>
              <span className="font-bold text-primary-600">{lastRecipientName}</span>
              <span className="ml-1 bg-primary-100 px-2 py-0.5 rounded-full text-primary-700 font-medium">
                {recipientCounts[selectedRecipient] || recipientCounts[Object.keys(recipientCounts).pop() || ''] || 1} fois
              </span>
            </div>
          </div>
          
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'radial-gradient(circle, rgba(255,150,150,0.4) 0%, transparent 70%)'
            }}
          />
        </motion.div>
      )}
      
      {/* Confetti effect when a new pulse is sent */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute ${i % 3 === 0 ? 'w-3 h-3' : i % 3 === 1 ? 'w-2 h-2' : 'w-1 h-4'} ${i % 2 === 0 ? 'rounded-full' : 'rounded-sm rotate-45'}`}
                initial={{ 
                  x: '50%', 
                  y: '50%',
                  scale: 0,
                  rotate: 0
                }}
                animate={{ 
                  x: `${Math.random() * 120 - 10}%`, 
                  y: `${Math.random() * 120 - 10}%`,
                  scale: [0, 1.5, 0],
                  rotate: [0, Math.random() * 360, Math.random() * 720],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 1.5, 
                  ease: "easeOut",
                  times: [0, 0.5, 1]
                }}
                style={{
                  backgroundColor: [
                    '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', 
                    '#FF9E80', '#FF8A80', '#EA80FC', '#B388FF', '#8C9EFF',
                    '#64B5F6', '#81C784', '#FFB74D', '#BA68C8', '#4FC3F7'
                  ][Math.floor(Math.random() * 15)],
                  boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                  filter: 'blur(0.5px)'
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            {currentModal === 'preview' && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
                className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative shadow-2xl"
              >
                <h3 className="text-2xl font-bold mb-6 text-center">Aperçu de votre présence</h3>
                
                <motion.div 
                  className="p-8 rounded-xl relative overflow-hidden mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #93C5FD 100%)'
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)' }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="relative">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={userName}
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                          <span className="text-2xl">{userName[0]}</span>
                        </div>
                      )}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          backgroundColor: '#3B82F6',
                          filter: 'blur(8px)',
                        }}
                      />
                    </div>
                  </div>
                
                  <p className="text-white text-center mt-6 text-shadow-sm opacity-90">
                    Votre présence silencieuse sera visible pendant quelques instants
                  </p>
                </motion.div>

                <div className="flex justify-center space-x-4">
                  <motion.button
                    onClick={handleCloseModal}
                    className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium transition-colors"
                    whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: -3 }}
                      className="inline-flex items-center"
                    >
                      <motion.span className="mr-1">←</motion.span> Retour
                    </motion.span>
                  </motion.button>
                  <motion.button
                    onClick={handlePreviewConfirm}
                    className="px-6 py-3 rounded-lg bg-primary-500 text-white font-medium transition-colors"
                    whileHover={{ scale: 1.05, backgroundColor: '#2563eb', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      className="inline-flex items-center"
                    >
                      Continuer <motion.span className="ml-1">→</motion.span>
                    </motion.span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentModal === 'recipient' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
                className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-6 text-center">À qui souhaitez-vous envoyer votre présence ?</h3>
                <div className="space-y-3 mb-6">
                  {mockRecipients.map((recipient) => (
                    <motion.button
                      key={recipient.id}
                      onClick={() => setSelectedRecipient(recipient.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-center ${selectedRecipient === recipient.id ? 'border-primary-500 bg-primary-50 shadow-inner' : 'border-gray-200 hover:border-primary-300 hover:shadow-md'}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg font-medium">{recipient.name}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <motion.button
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      if (selectedRecipient) {
                        handleSendPulse();
                      }
                    }}
                    disabled={!selectedRecipient}
                    className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    whileHover={selectedRecipient ? { scale: 1.02 } : {}}
                    whileTap={selectedRecipient ? { scale: 0.98 } : {}}
                  >
                    Envoyer
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentModal === 'success' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
                className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <motion.div 
                    className="text-4xl mb-4 inline-block"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: [0, 1.5, 1], rotate: [-180, 20, 0] }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <motion.span
                      animate={{ 
                        filter: ["drop-shadow(0 0 0px rgba(0,200,0,0))", "drop-shadow(0 0 10px rgba(0,200,0,0.7))", "drop-shadow(0 0 5px rgba(0,200,0,0.3))"],
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                      ✨
                    </motion.span>
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-semibold text-green-600 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Présence envoyée !
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Votre présence a été partagée avec succès
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodPulse;