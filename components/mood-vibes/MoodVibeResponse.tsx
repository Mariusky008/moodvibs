import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Action = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  type: 'connection' | 'sensory' | 'decompression' | 'comfort' | 'physical';
};

type Emotion = {
  name: string;
  emoji: string;
};

type MoodVibeResponseProps = {
  moodId?: string;
  senderName?: string;
  emotion?: Emotion;
  onRespond?: (response: {
    action: Action;
    message?: string;
    file?: File;
  }) => void;
  onClose?: () => void;
};

const MoodVibeResponse: React.FC<MoodVibeResponseProps> = ({ moodId, senderName, emotion, onRespond, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<'direct' | 'physical'>('direct');
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const directActions: Action[] = [
    {
      id: 'hug',
      title: 'Câlin virtuel',
      description: 'Envoyer un câlin réconfortant',
      emoji: '🤗',
      type: 'comfort'
    },
    {
      id: 'listen',
      title: 'Écoute attentive',
      description: 'Offrir une oreille attentive',
      emoji: '👂',
      type: 'connection'
    },
    {
      id: 'meditation',
      title: 'Méditation guidée',
      description: 'Proposer une séance de méditation ensemble',
      emoji: '🧘',
      type: 'decompression'
    },
    {
      id: 'breathing',
      title: 'Exercices de respiration',
      description: 'Partager des techniques de respiration apaisantes',
      emoji: '🌬️',
      type: 'decompression'
    },
    {
      id: 'music',
      title: 'Playlist réconfortante',
      description: 'Partager une playlist pour apaiser les émotions',
      emoji: '🎵',
      type: 'sensory'
    },
    {
      id: 'gratitude',
      title: 'Moment de gratitude',
      description: 'Partager trois choses positives de la journée',
      emoji: '🙏',
      type: 'connection'
    }
  ];

  const physicalActions: Action[] = [
    {
      id: 'walk',
      title: 'Promenade',
      description: 'Proposer une promenade ensemble',
      emoji: '🚶',
      type: 'physical'
    },
    {
      id: 'exercise',
      title: 'Exercice',
      description: 'Faire de l\'exercice ensemble',
      emoji: '💪',
      type: 'physical'
    },
    {
      id: 'yoga',
      title: 'Séance de yoga',
      description: 'Pratiquer le yoga pour se détendre',
      emoji: '🧘‍♀️',
      type: 'physical'
    },
    {
      id: 'dance',
      title: 'Danse libre',
      description: 'Bouger en musique pour libérer les tensions',
      emoji: '💃',
      type: 'physical'
    },
    {
      id: 'stretch',
      title: 'Étirements doux',
      description: 'Séance d\'étirements pour se détendre',
      emoji: '🤸',
      type: 'physical'
    },
    {
      id: 'nature',
      title: 'Bain de nature',
      description: 'Se reconnecter à la nature ensemble',
      emoji: '🌳',
      type: 'physical'
    }
  ];

  const handleActionSelect = (action: Action) => {
    setSelectedAction(action);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRespond = () => {
    if (selectedAction && onRespond) {
      onRespond({
        action: selectedAction,
        message: customMessage,
        file: attachedFile || undefined
      });
    }
  };

  const getActionTypeColor = (type: Action['type']) => {
    switch (type) {
      case 'connection':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30';
      case 'sensory':
        return 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30';
      case 'decompression':
        return 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/30';
      case 'comfort':
        return 'border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/30';
      case 'physical':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30';
      default:
        return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30';
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onClose && onClose()}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl mx-4 overflow-hidden shadow-xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header with sender info and close button */}
          {senderName && emotion && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{emotion.emoji}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{senderName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{emotion.name}</p>
                </div>
              </div>
              <motion.button
                onClick={() => onClose && onClose()}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          )}
          <div className="space-y-6">
            <div className="flex space-x-3 bg-gray-100 dark:bg-gray-900 p-2 rounded-xl">
              <motion.button
                onClick={() => setSelectedCategory('direct')}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-300 ${selectedCategory === 'direct' ? 'bg-white dark:bg-gray-700 shadow-md' : 'hover:bg-white/50 dark:hover:bg-gray-700/50'}`}
                whileHover={selectedCategory !== 'direct' ? { scale: 1.02 } : {}}
                whileTap={selectedCategory !== 'direct' ? { scale: 0.98 } : {}}
              >
                <span className="text-xl mr-2">💭</span>
                <span className={`font-medium ${selectedCategory === 'direct' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>Actions directes</span>
              </motion.button>
              <motion.button
                onClick={() => setSelectedCategory('physical')}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-300 ${selectedCategory === 'physical' ? 'bg-white dark:bg-gray-700 shadow-md' : 'hover:bg-white/50 dark:hover:bg-gray-700/50'}`}
                whileHover={selectedCategory !== 'physical' ? { scale: 1.02 } : {}}
                whileTap={selectedCategory !== 'physical' ? { scale: 0.98 } : {}}
              >
                <span className="text-xl mr-2">🏃</span>
                <span className={`font-medium ${selectedCategory === 'physical' ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>Actions physiques</span>
              </motion.button>
            </div>

            {/* Action Selection */}
            <AnimatePresence mode="wait">
              {selectedAction ? (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <motion.span 
                        className="text-3xl"
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
                        {selectedAction.emoji}
                      </motion.span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{selectedAction.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedAction.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <textarea
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          placeholder="Ajouter un message personnalisé..."
                          className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ease-in-out"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Joindre un fichier</p>
                          <label 
                            htmlFor="file-upload" 
                            className="cursor-pointer inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
                          >
                            {attachedFile ? 'Changer le fichier' : 'Parcourir'}
                          </label>
                          <input
                            id="file-upload"
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx"
                          />
                        </div>

                        {attachedFile && (
                          <motion.div 
                            className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 overflow-hidden">
                                {filePreview ? (
                                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                                    <img src={filePreview} alt="Aperçu" className="w-full h-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-500 dark:text-blue-400 text-xl">📎</span>
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{attachedFile.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{(attachedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                              </div>
                              <motion.button
                                onClick={handleRemoveFile}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => setSelectedAction(null)}
                      className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Retour
                    </motion.button>
                    <motion.button
                      onClick={handleRespond}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium hover:from-blue-700 hover:to-violet-700 transition-colors shadow-lg shadow-blue-500/25"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Envoyer
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {(selectedCategory === 'direct' ? directActions : physicalActions).map((action) => (
                    <motion.button
                      key={action.id}
                      onClick={() => handleActionSelect(action)}
                      className={`p-4 rounded-xl border ${getActionTypeColor(action.type)} transition-all duration-200`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start space-x-4">
                        <span className="text-2xl">{action.emoji}</span>
                        <div className="flex-1 text-left">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{action.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MoodVibeResponse;