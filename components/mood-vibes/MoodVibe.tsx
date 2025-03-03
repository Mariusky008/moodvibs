import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Emotion = {
  name: string;
  emoji: string;
  effect: {
    type: 'heat' | 'wind' | 'heartbeat';
    intensity: number;
  };
};

type MoodVibeProps = {
  userId: string;
  userName?: string;
  avatarUrl?: string;
  onSendVibe?: (emotion: Emotion, recipientId: string) => void;
};

const emotions: Emotion[] = [
  { 
    name: 'Je bouillonne',
    emoji: '🔥',
    effect: { type: 'heat', intensity: 0.8 }
  },
  { 
    name: 'Besoin de souffler',
    emoji: '💨',
    effect: { type: 'wind', intensity: 0.6 }
  },
  { 
    name: 'Envie d\'un câlin',
    emoji: '💙',
    effect: { type: 'heartbeat', intensity: 0.7 }
  }
];

const MoodVibe: React.FC<MoodVibeProps> = ({ userId, userName = '', avatarUrl, onSendVibe }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [intensity, setIntensity] = useState<number>(5);

  // Mock recipients data (replace with actual data in production)
  const mockRecipients = [
    { id: '1', name: 'Sophie' },
    { id: '2', name: 'Thomas' },
    { id: '3', name: 'Emma' },
  ];

  const getButtonAnimation = (emotion: Emotion) => {
    switch (emotion.name) {
      case 'Je bouillonne':
        return {
          scale: [1, 1.05, 1],
          x: [-1, 1, -1, 1, 0],
          transition: {
            duration: 0.3,
            repeat: 2,
          }
        };
      case 'Besoin de souffler':
        return {
          x: [0, 10, -10, 0],
          transition: {
            duration: 1,
            ease: "easeInOut",
          }
        };
      case 'Envie d\'un câlin':
        return {
          scale: [1, 1.1, 1, 1.1, 1],
          transition: {
            duration: 1,
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: 1,
          }
        };
      default:
        return {};
    }
  };

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    setShowPreviewModal(true);
  };

  const handlePreviewConfirm = () => {
    setShowPreviewModal(false);
    setShowRecipientModal(true);
  };

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSendVibe = () => {
    if (selectedEmotion && selectedRecipient && onSendVibe) {
      setIsAnimating(true);
      
      // Create a modified emotion object with the user-selected intensity
      const emotionWithIntensity = {
        ...selectedEmotion,
        effect: {
          ...selectedEmotion.effect,
          intensity: intensity / 10 // Convert from 1-10 scale to 0-1 scale
        }
      };
      
      onSendVibe(emotionWithIntensity, selectedRecipient);
      setShowSuccessMessage(true);

      // Hide success message and reset all states together after 2 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowPreviewModal(false);
        setShowRecipientModal(false);
        setIsAnimating(false);
        setSelectedEmotion(null);
        setSelectedRecipient('');
        setIntensity(5);
      }, 2000);
    }
  };

  const getEffectAnimation = (effect: { type: 'heat' | 'wind' | 'heartbeat'; intensity: number }) => {
    const intensity = effect.intensity;
    
    switch (effect.type) {
      case 'heat':
        return {
          opacity: [0, 0.7, 0],
          scale: [1, 1.2, 1],
          backgroundColor: ['rgba(255, 100, 0, 0)', 'rgba(255, 100, 0, 0.3)', 'rgba(255, 100, 0, 0)'],
          filter: ['blur(0px)', `blur(${intensity * 10}px)`, 'blur(0px)'],
        };
      case 'wind':
        return {
          opacity: [0, 0.7, 0],
          x: [-100, 100],
          backgroundColor: ['rgba(200, 200, 255, 0)', 'rgba(200, 200, 255, 0.3)', 'rgba(200, 200, 255, 0)'],
          filter: ['blur(0px)', `blur(${intensity * 5}px)`, 'blur(0px)'],
        };
      case 'heartbeat':
        return {
          opacity: [0, 0.7, 0.5, 0.7, 0],
          scale: [1, 1.1, 1, 1.1, 1],
          backgroundColor: ['rgba(255, 150, 200, 0)', 'rgba(255, 150, 200, 0.3)', 'rgba(255, 150, 200, 0.2)', 'rgba(255, 150, 200, 0.3)', 'rgba(255, 150, 200, 0)'],
          borderRadius: ['0%', '50%', '30%', '50%', '0%'],
        };
      default:
        return {};
    }
  };

  return (
    <div className="mood-container relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xl">{userName ? userName[0] : '?'}</span>
            </div>
          )}
        </div>
        <div className="flex-1 sm:ml-4">
          <h3 className="font-medium text-lg">{userName}</h3>
          <p className="text-sm text-gray-500">
            {isAnimating ? 'Envoi d\'une vibe...' : 'Prêt à envoyer une vibe'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {emotions.map((emotion) => (
          <motion.button
            key={emotion.name}
            onClick={() => handleEmotionSelect(emotion)}
            className={`p-4 rounded-lg border-2 transition-all ${selectedEmotion?.name === emotion.name ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}
            disabled={isAnimating}
            whileHover={getButtonAnimation(emotion)}
          >
            <div className="text-3xl mb-2">{emotion.emoji}</div>
            <div className="text-sm font-medium">{emotion.name}</div>
          </motion.button>
        ))}
      </div>

      {showPreviewModal && selectedEmotion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Aperçu de votre vibe</h3>
            
            <div className="p-8 rounded-xl relative overflow-hidden mb-6 transform transition-all duration-500 hover:scale-105"
              style={{
                background: selectedEmotion.effect.type === 'heat'
                  ? 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)'
                  : selectedEmotion.effect.type === 'wind'
                  ? 'linear-gradient(135deg, #A8E6CF 0%, #6B9AC4 100%)'
                  : 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)'
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <motion.span 
                    className="text-6xl filter drop-shadow-lg"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: selectedEmotion.effect.type === 'wind' ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {selectedEmotion.emoji}
                  </motion.span>
                </div>
                <h4 className="text-xl font-semibold text-white text-center mb-4 text-shadow">
                  {selectedEmotion.name}
                </h4>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-white text-shadow">Intensité</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white text-shadow mt-2">
                    <span>Faible</span>
                    <span>Modérée ({intensity})</span>
                    <span>Forte</span>
                  </div>
                </div>
                <p className="text-white text-center text-shadow-sm opacity-90">
                  Cette vibe sera envoyée avec une animation personnalisée
                </p>
              </div>

              {/* Particle Effects */}
              <motion.div
                className="absolute inset-0 z-0"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [1, 1.2, 1],
                  ...(selectedEmotion.effect.type === 'heat' && {
                    background: [
                      'radial-gradient(circle at 30% 30%, rgba(255, 156, 0, 0.4) 0%, transparent 50%)',
                      'radial-gradient(circle at 70% 70%, rgba(255, 156, 0, 0.4) 0%, transparent 50%)'
                    ]
                  }),
                  ...(selectedEmotion.effect.type === 'wind' && {
                    x: [-20, 20, -20],
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)'
                  }),
                  ...(selectedEmotion.effect.type === 'heartbeat' && {
                    scale: [1, 1.1, 1],
                    background: 'radial-gradient(circle, rgba(255, 182, 193, 0.4) 0%, transparent 70%)'
                  })
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handlePreviewConfirm}
                className="px-6 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
              >
                Continuer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showRecipientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative">
            {showSuccessMessage ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Vibe envoyée !</h3>
                <p className="text-gray-600">Votre vibe a été partagée avec succès</p>
              </motion.div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">À qui souhaitez-vous envoyer cette vibe ?</h3>
                <div className="space-y-2 mb-6">
                  {mockRecipients.map((recipient) => (
                    <button
                      key={recipient.id}
                      onClick={() => setSelectedRecipient(recipient.id)}
                      className={`w-full p-3 rounded-lg border-2 transition-all ${selectedRecipient === recipient.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}
                    >
                      {recipient.name}
                    </button>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowRecipientModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSendVibe}
                    disabled={!selectedRecipient}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Envoyer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {isAnimating && selectedEmotion && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={getEffectAnimation(selectedEmotion.effect)}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              repeat: 1,
              ease: "easeInOut"
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodVibe;