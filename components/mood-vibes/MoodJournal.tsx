import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const calendarViews = ['day', 'week', 'month', 'year'];

type MoodEntry = {
  id: string;
  type: 'vibe' | 'pulse' | 'challenge';
  timestamp: Date;
  recipientId: string;
  recipientName: string;
  recipientType: 'ami' | 'famille' | 'amoureux';
  details: {
    emotion?: string;
    emoji?: string;
    intensity?: number;
    note?: string;
    challengeTitle?: string;
  };
};

type CalendarViewType = 'day' | 'week' | 'month' | 'year';

const MoodJournal: React.FC = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [calendarView, setCalendarView] = useState<CalendarViewType>('day');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Dans une application réelle, ces données viendraient d'une API
    const mockMoodEntries: MoodEntry[] = [
      {
        id: '1',
        type: 'vibe',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 heures avant
        recipientId: '101',
        recipientName: 'Sophie',
        recipientType: 'ami',
        details: {
          emotion: 'Envie d\'un câlin',
          emoji: '💙',
        }
      },
      {
        id: '2',
        type: 'pulse',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 heures avant
        recipientId: '102',
        recipientName: 'Maman',
        recipientType: 'famille',
        details: {}
      },
      {
        id: '3',
        type: 'challenge',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 heures avant
        recipientId: '103',
        recipientName: 'Marc',
        recipientType: 'amoureux',
        details: {
          challengeTitle: 'Défi Respiration',
        }
      },
      {
        id: '4',
        type: 'vibe',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 jour avant
        recipientId: '104',
        recipientName: 'Thomas',
        recipientType: 'ami',
        details: {
          emotion: 'Besoin de souffler',
          emoji: '💨',
        }
      },
      {
        id: '5',
        type: 'pulse',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 jours avant
        recipientId: '105',
        recipientName: 'Papa',
        recipientType: 'famille',
        details: {}
      },
    ];
    
    setMoodEntries(mockMoodEntries);
    setLoading(false);
  }, []);
  
  const getFilteredEntries = () => {
    const now = new Date();
    
    return moodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      
      switch(calendarView) {
        case 'day':
          return entryDate.getDate() === selectedDate.getDate() &&
                 entryDate.getMonth() === selectedDate.getMonth() &&
                 entryDate.getFullYear() === selectedDate.getFullYear();
        case 'week':
          // Obtenir le début et la fin de la semaine sélectionnée
          const weekStart = new Date(selectedDate);
          weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return entryDate >= weekStart && entryDate <= weekEnd;
        case 'month':
          return entryDate.getMonth() === selectedDate.getMonth() &&
                 entryDate.getFullYear() === selectedDate.getFullYear();
        case 'year':
          return entryDate.getFullYear() === selectedDate.getFullYear();
        default:
          return true;
      }
    });
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

  return (
    <div className="mood-section bg-white rounded-xl shadow-lg p-4 sm:p-6 transform transition-all hover:scale-105 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 text-center sm:text-left">
        <span className="text-3xl sm:text-4xl mx-auto sm:mx-0 sm:mr-3 mb-2 sm:mb-0">📔</span>
        <h2 className="text-xl sm:text-2xl font-bold">Journal de mes moods</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:space-x-2 mb-6">
            {calendarViews.map(view => (
              <motion.button
                key={view}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCalendarView(view as any)}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${calendarView === view ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {view === 'day' ? 'Jour' :
                 view === 'week' ? 'Semaine' :
                 view === 'month' ? 'Mois' : 'Année'}
              </motion.button>
            ))}
          </div>

          {/* Liste des entrées */}
          <div className="space-y-4">
            <AnimatePresence>
              {getFilteredEntries().map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: "easeInOut"
                  }}
                  className={`p-4 rounded-lg border ${getMoodTypeColor(entry.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl">
                          {entry.details.emoji || 
                           (entry.type === 'pulse' ? '💫' : 
                            entry.type === 'challenge' ? '🎯' : '🌈')}
                        </span>
                        <span className="text-xs font-medium mt-1">{formatTime(entry.timestamp)}</span>
                      </div>
                      <div>
                        <div className="font-medium">
                          {entry.type === 'vibe' && entry.details.emotion}
                          {entry.type === 'pulse' && 'Présence silencieuse'}
                          {entry.type === 'challenge' && entry.details.challengeTitle}
                        </div>
                        <div className="flex items-center mt-1 text-sm">
                          <span className="mr-2">{getRelationshipEmoji(entry.recipientType)}</span>
                          <span>{entry.recipientName}</span>
                        </div>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="text-2xl cursor-pointer"
                      title={entry.recipientType}
                    >
                      {getRelationshipEmoji(entry.recipientType)}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {getFilteredEntries().length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8 text-gray-500"
              >
                <p>Aucune activité pour cette période</p>
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MoodJournal;