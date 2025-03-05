import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ResponseCategory = 'direct' | 'physical';

type ResponseAction = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  category: ResponseCategory;
  type: string;
};

type MoodVibeResponseProps = {
  moodId: string;
  senderName: string;
  emotion: {
    name: string;
    emoji: string;
  };
  onRespond: (response: {
    moodId: string;
    actionId: string;
    category: ResponseCategory;
    customMessage?: string;
  }) => void;
  onClose: () => void;
};

const directActions: ResponseAction[] = [
  {
    id: 'video_call',
    title: "T'as une minute ? On s'appelle en visio tout de suite.",
    emoji: '📹',
    description: 'Démarrer un appel vidéo instantané',
    category: 'direct',
    type: 'connection'
  },
  {
    id: 'voice_message',
    title: "J'enregistre un message vocal pour toi, check tes audios !",
    emoji: '🎤',
    description: 'Envoyer un message vocal',
    category: 'direct',
    type: 'connection'
  },
  {
    id: 'funny_video',
    title: "Je t'envoie une vidéo drôle de moi pour te distraire.",
    emoji: '🎥',
    description: 'Partager une vidéo personnelle',
    category: 'direct',
    type: 'connection'
  },
  {
    id: 'share_song',
    title: "Écoute cette chanson, elle pourrait te parler.",
    emoji: '🎵',
    description: 'Partager une chanson (Spotify/YouTube)',
    category: 'direct',
    type: 'sensory'
  },
  {
    id: 'share_sound',
    title: "Si ton émotion était un bruit, je t'envoie un son qui l'exprime !",
    emoji: '🔊',
    description: 'Partager un son expressif',
    category: 'direct',
    type: 'sensory'
  },
  {
    id: 'share_image',
    title: "Regarde cette image, elle résume ce que je ressens en te lisant.",
    emoji: '🖼️',
    description: 'Partager une image évocatrice',
    category: 'direct',
    type: 'sensory'
  }
];

const physicalActions: ResponseAction[] = [
  {
    id: 'running',
    title: "Viens, on va courir 10 minutes, histoire d'évacuer tout ça.",
    emoji: '🏃',
    description: 'Proposer une activité physique',
    category: 'physical',
    type: 'decompression'
  },
  {
    id: 'rage_room',
    title: "Tu veux qu'on aille casser quelque chose (dans une rage room) ?",
    emoji: '🔨',
    description: 'Proposer une séance de rage room',
    category: 'physical',
    type: 'decompression'
  },
  {
    id: 'hug',
    title: "T'as besoin d'un câlin ? Je suis là !",
    emoji: '🤗',
    description: 'Offrir un câlin réconfortant',
    category: 'physical',
    type: 'comfort'
  },
  {
    id: 'meditation',
    title: "Viens, on se pose en silence 5 minutes et on respire.",
    emoji: '🧘',
    description: 'Moment de méditation partagé',
    category: 'physical',
    type: 'relaxation'
  }
];

const MoodVibeResponse: React.FC<MoodVibeResponseProps> = ({
  moodId,
  senderName,
  emotion,
  onRespond,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ResponseCategory>('direct');
  const [selectedAction, setSelectedAction] = useState<ResponseAction | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleActionSelect = (action: ResponseAction) => {
    setSelectedAction(action);
  };

  const handleRespond = () => {
    if (selectedAction) {
      onRespond({
        moodId,
        actionId: selectedAction.id,
        category: selectedAction.category,
        customMessage: customMessage.trim() || undefined
      });
      setShowConfirmation(true);
    }
  };

  // Animation variants for framer-motion
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300 
      }
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  const buttonVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.97, transition: { duration: 0.1 } },
  };

  const getCategoryColor = (category: ResponseCategory, isSelected: boolean) => {
    if (category === 'direct') {
      return isSelected 
        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    } else {
      return isSelected 
        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-200' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  const getActionTypeColor = (type: string) => {
    switch(type) {
      case 'connection': return 'bg-blue-50 border-blue-100';
      case 'sensory': return 'bg-purple-50 border-purple-100';
      case 'decompression': return 'bg-orange-50 border-orange-100';
      case 'comfort': return 'bg-pink-50 border-pink-100';
      case 'relaxation': return 'bg-green-50 border-green-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] flex flex-col">
          <div className="p-4 sm:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Répondre à {senderName}
              </h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <span className="text-2xl sm:text-3xl">
                  {emotion.emoji}
                </span>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">En réponse à :</p>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">{emotion.name}</p>
                </div>
              </div>
            </div>

          {showConfirmation ? (
            <div className="text-center py-6 sm:py-8">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">✨</div>
              <h3 className="text-lg sm:text-xl font-semibold text-green-600 mb-2">Réponse envoyée !</h3>
              <p className="text-sm sm:text-base text-gray-600">Votre réponse a été partagée avec {senderName}</p>
            </div>
          ) : (
            <div>
              <div className="space-y-4">
                <div className="flex space-x-2 sm:space-x-4">
                  <button
                    onClick={() => setSelectedCategory('direct')}
                    className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${selectedCategory === 'direct' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Messages directs
                  </button>
                  <button
                    onClick={() => setSelectedCategory('physical')}
                    className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${selectedCategory === 'physical' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Actions physiques
                  </button>
                </div>

                {selectedAction ? (
                  <div className="space-y-4">
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                        <span className="text-xl sm:text-2xl mt-1 sm:mt-0">{selectedAction.emoji}</span>
                        <div>
                          <p className="font-medium text-sm sm:text-base">{selectedAction.title}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{selectedAction.description}</p>
                        </div>
                      </div>
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Ajouter un message personnalisé..."
                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2 sm:space-x-4">
                      <button
                        onClick={() => setSelectedAction(null)}
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                      >
                        Retour
                      </button>
                      <button
                        onClick={handleRespond}
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                      >
                        Envoyer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {(selectedCategory === 'direct' ? directActions : physicalActions).map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleActionSelect(action)}
                        className="p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left flex items-start sm:items-center space-x-2 sm:space-x-3"
                      >
                        <span className="text-xl sm:text-2xl mt-1 sm:mt-0">{action.emoji}</span>
                        <div>
                          <p className="font-medium text-sm sm:text-base">{action.title}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{action.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodVibeResponse;