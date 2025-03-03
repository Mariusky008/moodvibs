import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

type HistoryEntry = {
  id: string;
  type: 'vibe' | 'pulse' | 'challenge' | 'mood';
  timestamp: string;
  details: {
    emotion?: string;
    emoji?: string;
    intensity?: number;
    note?: string;
    recipientName?: string;
    senderName?: string;
    challengeTitle?: string;
    challengeStatus?: 'sent' | 'received' | 'completed';
    pulseStatus?: 'activated' | 'deactivated';
  };
};

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'vibe' | 'pulse' | 'challenge' | 'mood'>('all');

  // Load history data
  useEffect(() => {
    try {
      // In a real app, this would come from an API
      // For now, we'll create some demo data
      const demoHistory: HistoryEntry[] = [
        {
          id: '1',
          type: 'mood',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          details: {
            emotion: 'Heureux',
            emoji: '😊',
            intensity: 8,
            note: 'Belle journée aujourd\'hui!'
          }
        },
        {
          id: '2',
          type: 'vibe',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          details: {
            emotion: 'Envie d\'un câlin',
            emoji: '💙',
            recipientName: 'Sophie'
          }
        },
        {
          id: '3',
          type: 'pulse',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          details: {
            pulseStatus: 'activated',
            recipientName: 'Thomas'
          }
        },
        {
          id: '4',
          type: 'challenge',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          details: {
            challengeTitle: 'Défi Respiration',
            challengeStatus: 'completed',
            recipientName: 'Emma'
          }
        },
        {
          id: '5',
          type: 'vibe',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
          details: {
            emotion: 'Besoin de souffler',
            emoji: '💨',
            senderName: 'Thomas'
          }
        },
        {
          id: '6',
          type: 'mood',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
          details: {
            emotion: 'Stressé',
            emoji: '😰',
            intensity: 7,
            note: 'Journée difficile au travail'
          }
        },
        {
          id: '7',
          type: 'challenge',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
          details: {
            challengeTitle: 'Défi Créatif',
            challengeStatus: 'sent',
            recipientName: 'Sophie'
          }
        },
      ];

      setHistory(demoHistory);
    } catch (err) {
      console.error('Error loading history data:', err);
      setError('Failed to load history data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const formatDate = (timestamp: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const getHistoryIcon = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'vibe': return '🌊';
      case 'pulse': return '💫';
      case 'challenge': return '💪';
      case 'mood': return '📝';
      default: return '📌';
    }
  };

  const getHistoryTitle = (entry: HistoryEntry) => {
    switch (entry.type) {
      case 'vibe':
        return entry.details.senderName 
          ? `${entry.details.senderName} vous a envoyé une vibe ${entry.details.emoji}` 
          : `Vous avez envoyé une vibe ${entry.details.emoji} à ${entry.details.recipientName}`;
      case 'pulse':
        return entry.details.pulseStatus === 'activated'
          ? `Vous avez activé Mood Pulse pour ${entry.details.recipientName}`
          : `Vous avez désactivé Mood Pulse`;
      case 'challenge':
        if (entry.details.challengeStatus === 'sent') {
          return `Vous avez envoyé le défi "${entry.details.challengeTitle}" à ${entry.details.recipientName}`;
        } else if (entry.details.challengeStatus === 'received') {
          return `${entry.details.senderName} vous a envoyé le défi "${entry.details.challengeTitle}"`;
        } else {
          return `Vous avez complété le défi "${entry.details.challengeTitle}"`;
        }
      case 'mood':
        return `Vous avez enregistré une humeur: ${entry.details.emotion} ${entry.details.emoji}`;
      default:
        return 'Activité inconnue';
    }
  };

  const getHistoryColor = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'vibe': return 'border-blue-300 bg-blue-50';
      case 'pulse': return 'border-purple-300 bg-purple-50';
      case 'challenge': return 'border-green-300 bg-green-50';
      case 'mood': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(entry => entry.type === filter);

  return (
    <Layout title="Historique">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Historique d'activité</h1>
        
        <div className="mb-6 flex justify-center space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100'}`}
          >
            Tous
          </button>
          <button 
            onClick={() => setFilter('mood')}
            className={`px-4 py-2 rounded-full ${filter === 'mood' ? 'bg-yellow-500 text-white' : 'bg-gray-100'}`}
          >
            Humeurs
          </button>
          <button 
            onClick={() => setFilter('vibe')}
            className={`px-4 py-2 rounded-full ${filter === 'vibe' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Vibes
          </button>
          <button 
            onClick={() => setFilter('pulse')}
            className={`px-4 py-2 rounded-full ${filter === 'pulse' ? 'bg-purple-500 text-white' : 'bg-gray-100'}`}
          >
            Pulses
          </button>
          <button 
            onClick={() => setFilter('challenge')}
            className={`px-4 py-2 rounded-full ${filter === 'challenge' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
          >
            Défis
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-2">Chargement de votre historique...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-xl mb-4">Aucune activité trouvée</p>
            {filter !== 'all' && (
              <button 
                onClick={() => setFilter('all')}
                className="mood-button inline-block"
              >
                Voir toutes les activités
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`mood-container border-l-4 ${getHistoryColor(entry.type)}`}
              >
                <div className="flex items-start">
                  <div className="text-3xl mr-4">{getHistoryIcon(entry.type)}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{getHistoryTitle(entry)}</h3>
                    <p className="text-sm text-gray-500">{formatDate(entry.timestamp)}</p>
                    
                    {entry.type === 'mood' && entry.details.note && (
                      <div className="mt-2 text-gray-700">
                        <p>"{entry.details.note}"</p>
                        {entry.details.intensity && (
                          <div className="mt-1 inline-block bg-white rounded-full px-3 py-1 text-sm border">
                            Intensité: {entry.details.intensity}/10
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;