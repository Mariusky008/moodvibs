import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TestMoodButton from '../components/mood-vibes/TestMoodButton';
import Layout from '../components/layout/Layout';

type Connection = {
  id: string;
  name: string;
  email: string;
  type: 'family' | 'friend' | 'romantic';
  status: 'pending' | 'connected';
  avatarUrl?: string;
  streakCount?: number;
};

const ConnectionsPage = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newConnection, setNewConnection] = useState({
    name: '',
    email: '',
    type: 'friend' as 'family' | 'friend' | 'romantic'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Define emotions for the TestMoodButton
  const emotions = [
    { 
      name: 'Je bouillonne', 
      emoji: '🔥', 
      color: '#FF4500',
      effect: { type: 'heat', intensity: 0.8 }
    },
    { 
      name: 'Besoin de souffler', 
      emoji: '💨', 
      color: '#6495ED',
      effect: { type: 'wind', intensity: 0.6 }
    },
    { 
      name: 'Envie d\'un câlin', 
      emoji: '💙', 
      color: '#FF69B4',
      effect: { type: 'heartbeat', intensity: 0.7 }
    },
    { 
      name: 'Joyeux', 
      emoji: '✨', 
      color: '#FFD700',
      effect: { type: 'sparkle', intensity: 0.9 }
    },
    { 
      name: 'Apaisé', 
      emoji: '🌊', 
      color: '#98FB98',
      effect: { type: 'wave', intensity: 0.4 }
    }
  ];

  // Load connections from localStorage
  useEffect(() => {
    // Initialize with mock connections data
    const mockConnections: Connection[] = [
      {
        id: '1',
        name: 'Sophie Martin',
        email: 'sophie.martin@email.com',
        type: 'friend',
        status: 'connected',
        streakCount: 15,
      },
      {
        id: '2',
        name: 'Thomas Dubois',
        email: 'thomas.dubois@email.com',
        type: 'romantic',
        status: 'connected',
        streakCount: 30,
      },
      {
        id: '3',
        name: 'Marie Laurent',
        email: 'marie.laurent@email.com',
        type: 'family',
        status: 'connected',
        streakCount: 7,
      },
      {
        id: '4',
        name: 'Lucas Bernard',
        email: 'lucas.bernard@email.com',
        type: 'friend',
        status: 'pending',
      },
      {
        id: '5',
        name: 'Emma Petit',
        email: 'emma.petit@email.com',
        type: 'friend',
        status: 'connected',
        streakCount: 21,
      }
    ];

    try {
      const storedConnections = localStorage.getItem('connections');
      console.log('Stored connections:', storedConnections);
      
      if (storedConnections) {
        const parsedConnections = JSON.parse(storedConnections) as Connection[];
        setConnections(parsedConnections);
      } else {
        // Always initialize with mock connections if no data exists
        console.log('No stored connections, initializing with mock data');
        localStorage.setItem('connections', JSON.stringify(mockConnections));
        setConnections(mockConnections);
      }
    } catch (err) {
      console.error('Error loading connections from localStorage:', err);
      // If there's an error, still load mock connections
      console.log('Error occurred, falling back to mock data');
      setConnections(mockConnections);
      setError('Failed to load connections data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddConnection = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newConnection.name || !newConnection.email) return;
    
    try {
      // Create a new connection entry
      const newConnectionEntry: Connection = {
        id: Date.now().toString(),
        name: newConnection.name,
        email: newConnection.email,
        type: newConnection.type,
        status: 'pending',
      };
      
      // Add new connection to the array
      const updatedConnections = [...connections, newConnectionEntry];
      
      // Save to localStorage
      localStorage.setItem('connections', JSON.stringify(updatedConnections));
      
      // Update state
      setConnections(updatedConnections);
      
      // Reset form and close modal
      setNewConnection({
        name: '',
        email: '',
        type: 'friend'
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding connection:', error);
      setError('Failed to add connection. Please try again.');
    }
  };

  const getConnectionTypeEmoji = (type: 'family' | 'friend' | 'romantic') => {
    switch (type) {
      case 'family': return '👪';
      case 'friend': return '🤝';
      case 'romantic': return '❤️';
      default: return '👤';
    }
  };

  const getStatusBadgeClass = (status: 'pending' | 'connected') => {
    return status === 'connected' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <Layout title="Mes Connexions">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Mes Connexions</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="mood-button inline-flex items-center w-full sm:w-auto justify-center px-4 py-2 text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Ajouter une connexion
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-2">Chargement de vos connexions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : connections.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg px-4">
            <p className="text-xl mb-4">Vous n'avez pas encore de connexions</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mood-button inline-block w-full sm:w-auto px-6 py-3"
            >
              Ajouter votre première connexion
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {connections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mood-container flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 p-4 sm:p-6"
              >
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="relative flex-shrink-0">
                    {connection.avatarUrl ? (
                      <img
                        src={connection.avatarUrl}
                        alt={connection.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-xl font-medium text-primary-600">{connection.name[0]}</span>
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 text-lg">
                      {getConnectionTypeEmoji(connection.type)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 flex-grow">
                    <div className="min-w-0">
                      <h3 className="font-medium text-lg truncate">{connection.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{connection.email}</p>
                    </div>
                    {connection.status === 'connected' && (
                      <div className="sm:ml-4 flex items-center text-red-500">
                        <span className="text-xl mr-1">❤️</span>
                        <span className="font-medium">{connection.streakCount || 0}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm border ${getStatusBadgeClass(connection.status)} w-full sm:w-auto text-center sm:text-left`}>
                  {connection.status === 'connected' ? 'Connecté' : 'En attente'}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Add Connection Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div 
              className="bg-white rounded-xl w-full max-w-md overflow-hidden my-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold">Ajouter une connexion</h3>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddConnection} className="p-4 sm:p-6">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Nom</label>
                  <input
                    type="text"
                    id="name"
                    value={newConnection.name}
                    onChange={(e) => setNewConnection({...newConnection, name: e.target.value})}
                    className="mood-input w-full"
                    placeholder="Nom de la personne"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={newConnection.email}
                    onChange={(e) => setNewConnection({...newConnection, email: e.target.value})}
                    className="mood-input w-full"
                    placeholder="email@exemple.com"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Type de connexion</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewConnection({...newConnection, type: 'friend'})}
                      className={`p-3 rounded-lg border-2 transition-all ${newConnection.type === 'friend' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
                    >
                      <div className="text-2xl mb-1">🤝</div>
                      <div className="text-sm">Ami(e)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewConnection({...newConnection, type: 'family'})}
                      className={`p-3 rounded-lg border-2 transition-all ${newConnection.type === 'family' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
                    >
                      <div className="text-2xl mb-1">👪</div>
                      <div className="text-sm">Famille</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewConnection({...newConnection, type: 'romantic'})}
                      className={`p-3 rounded-lg border-2 transition-all ${newConnection.type === 'romantic' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
                    >
                      <div className="text-2xl mb-1">❤️</div>
                      <div className="text-sm">Amoureux</div>
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 w-full sm:w-auto"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="mood-button w-full sm:w-auto"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
      <TestMoodButton emotions={emotions} position="bottom-right" id="connections-page" />
    </Layout>
  );
};
export default ConnectionsPage;