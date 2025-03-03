import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

type MoodEntry = {
  id: string;
  emotion: string;
  emoji: string;
  intensity: number;
  note: string;
  timestamp: any; // Using any for simplicity, but ideally would be Timestamp
};

const Dashboard = () => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load mood data from localStorage
  React.useEffect(() => {
    try {
      // Get moods from localStorage
      const storedMoods = localStorage.getItem('moods');
      
      if (storedMoods) {
        const parsedMoods = JSON.parse(storedMoods) as MoodEntry[];
        setMoods(parsedMoods);
      } else {
        // If no moods in localStorage, initialize with empty array
        setMoods([]);
      }
    } catch (err) {
      console.error('Error loading moods from localStorage:', err);
      setError('Failed to load mood data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'bg-blue-100 border-blue-300';
    if (intensity <= 6) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const formatDate = (timestamp: Date) => {
    if (!timestamp) return 'Date inconnue';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <Layout title="Tableau de bord">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Votre Journal d'Humeur</h1>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-2">Chargement de vos humeurs...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : moods.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-xl mb-4">Vous n'avez pas encore enregistré d'humeur</p>
            <a href="/" className="mood-button inline-block">
              Enregistrer votre première humeur
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {moods.map((mood, index) => (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`mood-container border-l-4 ${getIntensityColor(mood.intensity)}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="text-3xl mr-2">{mood.emoji}</span>
                      <h3 className="text-xl font-semibold">{mood.emotion}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(mood.timestamp)}</p>
                  </div>
                  <div className="bg-white rounded-full px-3 py-1 border">
                    <span className="font-medium">{mood.intensity}/10</span>
                  </div>
                </div>
                
                {mood.note && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-700">{mood.note}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;