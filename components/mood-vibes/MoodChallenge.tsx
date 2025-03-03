import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Challenge = {
  id: string;
  type: 'motivation' | 'exutoire' | 'connexion';
  title: string;
  description: string;
  emoji: string;
  completed: boolean;
};

type MoodChallengeProps = {
  userId: string;
  userName: string;
  onSendChallenge?: (challenge: Omit<Challenge, 'id' | 'completed'>, recipientId: string) => void;
};

type Recipient = {
  id: string;
  name: string;
};

const predefinedChallenges: Omit<Challenge, 'id' | 'completed'>[] = [
  {
    type: 'motivation',
    title: 'Défi Motivation',
    description: 'Pendant 10 minutes, fais quelque chose qui te fait sourire et envoie-moi une photo.',
    emoji: '💪',
  },
  {
    type: 'exutoire',
    title: 'Défi Exutoire',
    description: 'Écris ce qui te pèse et supprime-le après.',
    emoji: '📝',
  },
  {
    type: 'connexion',
    title: 'Défi Connexion',
    description: 'Décris une belle chose de ta journée en un mot.',
    emoji: '🔗',
  },
  {
    type: 'motivation',
    title: 'Défi Respiration',
    description: 'Prends 5 grandes respirations et dis-moi comment tu te sens après.',
    emoji: '🧘',
  },
  {
    type: 'exutoire',
    title: 'Défi Créatif',
    description: 'Dessine ton émotion actuelle et partage-la avec moi.',
    emoji: '🎨',
  },
];

const MoodChallenge: React.FC<MoodChallengeProps> = ({ userId, userName, onSendChallenge }) => {
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Omit<Challenge, 'id' | 'completed'> | null>(null);
  const [response, setResponse] = useState<string>('');
  const [showChallengeForm, setShowChallengeForm] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showRecipientModal, setShowRecipientModal] = useState<boolean>(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  
  // Mock recipients data (replace with actual data in production)
  const mockRecipients: Recipient[] = [
    { id: '1', name: 'Sophie' },
    { id: '2', name: 'Thomas' },
    { id: '3', name: 'Emma' },
  ];

  const handleChallengeSelect = (challenge: Omit<Challenge, 'id' | 'completed'>) => {
    setSelectedChallenge(challenge);
    setShowPreviewModal(true);
    setShowChallengeForm(false);
  };

  const handlePreviewConfirm = () => {
    setShowPreviewModal(false);
    setShowRecipientModal(true);
  };

  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const handleSendChallenge = () => {
    if (!selectedChallenge || !selectedRecipient) return;

    const newChallenge: Challenge = {
      ...selectedChallenge,
      id: Date.now().toString(),
      completed: false,
    };

    // In a real app, this would send the challenge to the friend via an API
    if (onSendChallenge) {
      onSendChallenge(selectedChallenge, selectedRecipient);
    }
    
    // Show success message
    setShowSuccessMessage(true);
    
    // Hide success message and reset all states together after 2 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
      setShowPreviewModal(false);
      setShowRecipientModal(false);
      setShowChallengeForm(false);
      setActiveChallenges([...activeChallenges, newChallenge]);
      setSelectedChallenge(null);
      setSelectedRecipient('');
    }, 2000);
  };

  const handleCompleteChallenge = (challengeId: string) => {
    setActiveChallenges(activeChallenges.map(challenge => 
      challenge.id === challengeId ? { ...challenge, completed: true } : challenge
    ));

    // In a real app, this would update the challenge status via an API
    // and notify the sender that the challenge was completed
  };

  return (
    <div className="mood-container">
      <h2 className="text-2xl font-bold mb-4">Mood Challenges</h2>
      
      {!showChallengeForm ? (
        <div className="mb-6">
          <button 
            onClick={() => setShowChallengeForm(true)}
            className="mood-button w-full"
          >
            Envoyer un défi à {userName}
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 border border-gray-200 rounded-lg"
        >
          <h3 className="text-lg font-medium mb-3">Choisir un défi</h3>
          
          <div className="grid grid-cols-1 gap-3 mb-4">
            {predefinedChallenges.map((challenge) => (
              <button
                key={challenge.title}
                onClick={() => handleChallengeSelect(challenge)}
                className={`flex items-center p-3 rounded-lg border transition-all ${selectedChallenge?.title === challenge.title ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <span className="text-2xl mr-3">{challenge.emoji}</span>
                <div className="text-left">
                  <div className="font-medium">{challenge.title}</div>
                  <div className="text-sm text-gray-600">{challenge.description}</div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button 
              onClick={() => setShowChallengeForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 w-full sm:w-auto"
            >
              Annuler
            </button>
          </div>
        </motion.div>
      )}

      {showPreviewModal && selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-4 sm:p-8 w-full max-w-md mx-auto relative shadow-2xl"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center">Aperçu de votre défi</h3>
            
            <div className="p-4 sm:p-8 rounded-xl relative overflow-hidden mb-6 transform transition-all duration-500 hover:scale-105"
              style={{
                background: selectedChallenge.type === 'motivation'
                  ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                  : selectedChallenge.type === 'exutoire'
                  ? 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)'
                  : 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)'
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <motion.span 
                    className="text-4xl sm:text-6xl filter drop-shadow-lg"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: selectedChallenge.type === 'exutoire' ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {selectedChallenge.emoji}
                  </motion.span>
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-white text-center mb-4 text-shadow">
                  {selectedChallenge.title}
                </h4>
                <p className="text-sm sm:text-base text-white text-center text-shadow-sm opacity-90">
                  {selectedChallenge.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setShowChallengeForm(true);
                }}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                Retour
              </button>
              <button
                onClick={handlePreviewConfirm}
                className="px-6 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors w-full sm:w-auto"
              >
                Continuer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showRecipientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            {showSuccessMessage ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Défi envoyé !</h3>
                <p className="text-gray-600">Votre défi a été partagé avec succès</p>
              </motion.div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">À qui souhaitez-vous envoyer ce défi ?</h3>
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
                    onClick={handleSendChallenge}
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
      
      {activeChallenges.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Défis actifs</h3>
          <div className="space-y-4">
            {activeChallenges.map((challenge) => (
              <motion.div 
                key={challenge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${challenge.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{challenge.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium">{challenge.title}</div>
                    <div className="text-sm text-gray-600">{challenge.description}</div>
                    
                    {challenge.completed ? (
                      <div className="mt-3 text-green-600 text-sm font-medium">Défi complété ✓</div>
                    ) : (
                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="Votre réponse..."
                          className="mood-input w-full mb-2"
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                        />
                        <button 
                          onClick={() => handleCompleteChallenge(challenge.id)}
                          className="mood-button text-sm"
                          disabled={!response.trim()}
                        >
                          Valider ma réponse
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {activeChallenges.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun défi actif pour le moment</p>
          <p className="text-sm mt-2">Envoyez un défi à {userName} pour l'aider à améliorer son humeur</p>
        </div>
      )}
    </div>
  );
};

export default MoodChallenge;