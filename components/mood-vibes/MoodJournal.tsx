import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoodVibeResponse from './MoodVibeResponse';

const calendarViews = ['day', 'week', 'month'];

type MoodEntry = {
  id: string;
  type: 'sent' | 'received';
  emotion: string;
  emoji: string;
  recipientName: string;
  senderName: string;
  status: 'pending' | 'responded' | 'acknowledged';
  timestamp: Date | string;
  completed?: boolean;
  details?: {
    emoji?: string;
    emotion?: string;
    challengeTitle?: string;
  };
};

type CalendarViewType = 'day' | 'week' | 'month' | 'year';

const MoodJournal: React.FC = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<CalendarViewType>('month');
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<MoodEntry | null>(null);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [moodId, setMoodId] = useState<string>('');
  const [showMoodVibeResponse, setShowMoodVibeResponse] = useState<boolean>(false);
  
  useEffect(() => {
    // Mock data - replace with actual API call in production
    const mockMoodEntries: MoodEntry[] = [
      {
        id: '1',
        type: 'sent',
        emotion: 'Envie d\'un câlin',
        emoji: '💙',
        recipientName: 'Sophie',
        senderName: 'Moi',
        status: 'acknowledged',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        id: '2',
        type: 'received',
        emotion: 'Besoin de souffler',
        emoji: '💨',
        recipientName: 'Moi',
        senderName: 'Thomas',
        status: 'pending',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
    ];
    
    setMoodEntries(mockMoodEntries);
    setLoading(false);
  }, []);
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'responded': 
      case 'acknowledged': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getMoodTypeColor = (type: string) => {
    switch(type) {
      case 'vibe': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'pulse': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'challenge': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };
  
  const getRelationshipEmoji = (type: string) => {
    switch(type) {
      case 'ami': return '👥';
      case 'famille': return '👨‍👩‍👧‍👦';
      case 'amoureux': return '❤️';
      default: return '👤';
    }
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Formater la date en fonction de la vue
  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    
    switch(calendarView) {
      case 'day':
        return new Intl.DateTimeFormat('fr-FR', options).format(selectedDate);
      case 'week':
        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(weekStart)} - ${new Intl.DateTimeFormat('fr-FR', options).format(weekEnd)}`;
      case 'month':
        return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(selectedDate);
      case 'year':
        return new Intl.DateTimeFormat('fr-FR', { year: 'numeric' }).format(selectedDate);
      default:
        return '';
    }
  };

  // Naviguer dans le calendrier
  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    
    switch(calendarView) {
      case 'day':
        newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'year':
        newDate.setFullYear(selectedDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setSelectedDate(newDate);
  };

  const renderMoodHistory = () => {
    const sentMoods = moodEntries.filter(mood => mood.type === 'sent');
    const receivedMoods = moodEntries.filter(mood => mood.type === 'received');

    return (
      <div className="mt-8 space-y-6">
        {/* Received Moods */}
        {receivedMoods.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Moods reçus</h3>
            <div className="space-y-3">
              {receivedMoods.map((mood) => (
                <div
                  key={mood.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{mood.emoji}</span>
                      <div>
                        <p className="font-medium">{mood.senderName}</p>
                        <p className="text-sm text-gray-600">{mood.emotion}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(mood.status)}`}>
                      {mood.status === 'pending' ? 'En attente' : 'Répondu'}
                    </div>
                  </div>
                  {mood.status === 'pending' && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        className="flex-1 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                        onClick={() => {
                          const uniqueId = `mood-${Date.now()}`;
                          setMoodId(uniqueId);
                          setSelectedMood(mood);
                          setShowMoodVibeResponse(true);
                        }}
                      >
                        Répondre avec MoodVibe 💬
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sent Moods */}
        {sentMoods.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Moods envoyés</h3>
            <div className="space-y-3">
              {sentMoods.map((mood) => (
                <div
                  key={mood.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{mood.emoji}</span>
                      <div>
                        <p className="font-medium">À {mood.recipientName}</p>
                        <p className="text-sm text-gray-600">{mood.emotion}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(mood.status)}`}>
                      {mood.status === 'pending' ? 'En attente' : 'Reçu'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incentive Moods */}
        <div className="mt-8 space-y-4">
          <h3 className="font-medium text-lg">Suggestions de Moods</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mood Vibe suggestion */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-lg border-2 border-pink-200 bg-pink-50 hover:bg-pink-100 transition-all"
              onClick={() => {
                // Open the Mood Vibe modal directly
                window.dispatchEvent(new CustomEvent('openMoodModal', { detail: { type: 'vibes', recipient: 'Marie' } }));
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl">❤️</span>
                <div className="text-left">
                  <p className="font-medium text-pink-800">Mood Vibe pour Marie</p>
                  <p className="text-sm text-pink-600">Envoyez une vibe "Je pense à toi" à votre amie</p>
                </div>
              </div>
            </motion.button>

            {/* Mood Pulse suggestion */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all"
              onClick={() => {
                // Open the Mood Pulse modal directly
                window.dispatchEvent(new CustomEvent('openMoodModal', { detail: { type: 'pulse', recipient: 'Papa' } }));
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl">💫</span>
                <div className="text-left">
                  <p className="font-medium text-blue-800">Mood Pulse pour Papa</p>
                  <p className="text-sm text-blue-600">Envoyez une présence silencieuse à votre père</p>
                </div>
              </div>
            </motion.button>

            {/* Mood Challenge suggestion */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 transition-all"
              onClick={() => {
                // Open the Mood Challenge modal directly
                window.dispatchEvent(new CustomEvent('openMoodModal', { detail: { type: 'challenge', recipient: 'Thomas' } }));
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl">💪</span>
                <div className="text-left">
                  <p className="font-medium text-purple-800">Mood Challenge pour Thomas</p>
                  <p className="text-sm text-purple-600">Proposez un défi motivation à votre ami</p>
                </div>
              </div>
            </motion.button>

            {/* Another Mood Vibe suggestion with different recipient */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-lg border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-all"
              onClick={() => {
                // Open the Mood Vibe modal directly
                window.dispatchEvent(new CustomEvent('openMoodModal', { detail: { type: 'vibes', recipient: 'Sophie' } }));
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🌊</span>
                <div className="text-left">
                  <p className="font-medium text-green-800">Mood Vibe pour Sophie</p>
                  <p className="text-sm text-green-600">Partagez votre besoin de souffler avec votre amie</p>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:transform md:transition-all md:hover:scale-105 w-full max-w-full md:max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center mb-6 text-center sm:text-left">
        <motion.span 
          className="text-3xl sm:text-4xl mx-auto sm:mx-0 sm:mr-3 mb-2 sm:mb-0"
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >📔</motion.span>
        <motion.h2 
          className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >Journal de mes moods</motion.h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        renderMoodHistory()
      )}

      <AnimatePresence>
        {showMoodVibeResponse && selectedMood && (
          <MoodVibeResponse
            moodId={moodId}
            senderName={selectedMood.senderName}
            emotion={{
              name: selectedMood.emotion,
              emoji: selectedMood.emoji
            }}
            onRespond={(response) => {
              setMoodEntries(moodEntries.map(mood =>
                mood.id === response.moodId
                  ? { ...mood, status: 'responded' }
                  : mood
              ));
            }}
            onClose={() => {
              setShowMoodVibeResponse(false);
              setSelectedMood(null);
            }}
          />
        )}
        {showResponseModal && selectedMood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-auto relative shadow-2xl overflow-hidden"
            >
              {showSuccessMessage ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <motion.div 
                    className="text-4xl mb-4"
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
                    Réponse envoyée !
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Votre message a été partagé avec succès
                  </motion.p>
                </motion.div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Répondre à {selectedMood.senderName}</h3>
                    <div className="p-4 rounded-xl relative overflow-hidden mb-6 transform transition-all duration-500 hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #3B82F6 0%, #93C5FD 100%)'
                      }}
                    >
                      <div className="relative z-10 flex items-center space-x-3">
                        <motion.span 
                          className="text-4xl filter drop-shadow-lg"
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {selectedMood.emoji}
                        </motion.span>
                        <p className="text-white text-lg font-medium">{selectedMood.emotion}</p>
                      </div>
                    </div>
                    <textarea
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="Écrivez votre réponse..."
                      className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-600 mb-2">Choisissez une émoticône:</p>
                    <div className="flex flex-wrap gap-2">
                      {['🤗', '💙', '🌊', '💚', '✨', '🙏', '💫', '🌈'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setSelectedEmoji(emoji)}
                          className={`p-2 rounded-lg text-2xl ${selectedEmoji === emoji ? 'bg-primary-100 ring-2 ring-primary-500' : 'hover:bg-gray-100'}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => {
                        setShowResponseModal(false);
                        setResponseMessage('');
                        setSelectedMood(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setShowSuccessMessage(true);
                        setTimeout(() => {
                          setShowResponseModal(false);
                          setResponseMessage('');
                          setSelectedMood(null);
                          setShowSuccessMessage(false);
                          setMoodEntries(moodEntries.map(mood =>
                            mood.id === selectedMood.id
                              ? { ...mood, status: 'responded' }
                              : mood
                          ));
                        }, 2000);
                      }}
                      disabled={!responseMessage.trim()}
                      className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Envoyer
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MoodEntryItem: React.FC<{ 
  entry: MoodEntry;
  onComplete?: (entryId: string) => void;
}> = ({ entry, onComplete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusMessage = () => {
    if (entry.completed) {
      return "Bravo ! Objectif atteint 🎉";
    }
    const messages = [
      "Cliquez pour compléter ! 💪",
      "En route vers le succès ! 🌟",
      "Un petit effort pour un grand impact ! 🎯",
      "Prêt à relever le défi ? 🚀"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleClick = () => {
    if (!entry.completed && onComplete) {
      onComplete(entry.id);
    }
  };

  return (
    <motion.div
      className="relative flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{entry.details?.emoji || '🌈'}</span>
          <h4 className="font-medium">
            {entry.details?.emotion || entry.details?.challengeTitle || 'Présence silencieuse'}
          </h4>
        </div>
        <p className="text-sm text-gray-600">Pour {entry.recipientName}</p>
      </div>
      
      <motion.div
        className={`relative flex items-center justify-center w-8 h-8 rounded-full ${entry.completed ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-100'}`}
        whileHover={!entry.completed ? { scale: 1.1 } : {}}
        onClick={handleClick}
        style={{ cursor: entry.completed ? 'default' : 'pointer' }}
      >
        {entry.completed ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-white text-lg"
          >
            ✓
          </motion.span>
        ) : (
          <motion.div
            className="w-4 h-4 rounded-full bg-gray-300"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute right-0 top-full mt-2 p-2 rounded-lg shadow-lg text-sm whitespace-nowrap z-10 ${entry.completed ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}
          >
            {getStatusMessage()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MoodJournal;