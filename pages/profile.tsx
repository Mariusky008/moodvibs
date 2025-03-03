import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  preferences: {
    notifications: boolean;
    privacyLevel: 'public' | 'friends' | 'private';
    theme: 'light' | 'dark' | 'system';
  };
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  // Load profile data from localStorage
  useEffect(() => {
    try {
      // Get profile from localStorage
      const storedProfile = localStorage.getItem('userProfile');
      
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile) as UserProfile;
        setProfile(parsedProfile);
        setEditedProfile(parsedProfile);
      } else {
        // If no profile in localStorage, initialize with demo data
        const demoProfile: UserProfile = {
          id: 'demo-user',
          name: 'Jean Dupont',
          email: 'jean.dupont@example.com',
          preferences: {
            notifications: true,
            privacyLevel: 'friends',
            theme: 'system'
          }
        };
        setProfile(demoProfile);
        setEditedProfile(demoProfile);
        localStorage.setItem('userProfile', JSON.stringify(demoProfile));
      }
    } catch (err) {
      console.error('Error loading profile from localStorage:', err);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEditToggle = () => {
    if (isEditing && editedProfile) {
      // Save changes
      try {
        localStorage.setItem('userProfile', JSON.stringify(editedProfile));
        setProfile(editedProfile);
      } catch (err) {
        console.error('Error saving profile to localStorage:', err);
        setError('Failed to save profile changes. Please try again.');
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedProfile) return;
    
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  const handlePreferenceChange = (key: string, value: any) => {
    if (!editedProfile) return;
    
    setEditedProfile({
      ...editedProfile,
      preferences: {
        ...editedProfile.preferences,
        [key]: value
      }
    });
  };

  return (
    <Layout title="Mon Profil">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Mon Profil</h1>
        
      <motion.div 
          className="mood-container mb-8 bg-gradient-to-r from-primary-50 to-purple-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary-600 mb-2">Fixez vos objectifs et gagnez vos badges</h2>
            <p className="text-gray-600 mb-4">Prouvez par des actes et des gestes vos valeurs pour débloquer des badges spéciaux</p>
            <a href="/objectives" className="mood-button inline-flex items-center justify-center px-6 py-2 text-sm sm:text-base">
              <span className="mr-2">📝</span>
              Remplir ou modifier mes objectifs
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-blue-600">Badge Confiance</h3>
              <p className="text-sm text-gray-500">Construisez des liens de confiance durables</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❤️</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-red-600">Badge Amour</h3>
              <p className="text-sm text-gray-500">Partagez votre bienveillance et votre soutien</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-green-600">Badge Partage</h3>
              <p className="text-sm text-gray-500">Enrichissez la communauté par vos contributions</p>
            </div>
          </div>
        </motion.div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-2">Chargement de votre profil...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : profile ? (
          <div className="space-y-8">
            <motion.div 
              className="mood-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-4xl">{profile.name[0]}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Nom</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={editedProfile?.name || ''}
                          onChange={handleInputChange}
                          className="mood-input w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={editedProfile?.email || ''}
                          onChange={handleInputChange}
                          className="mood-input w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold">{profile.name}</h2>
                      <p className="text-gray-600">{profile.email}</p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleEditToggle}
                  className="mood-button"
                >
                  {isEditing ? 'Enregistrer' : 'Modifier'}
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              className="mood-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4">Préférences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications</h4>
                    <p className="text-sm text-gray-500">Recevoir des notifications pour les nouvelles vibes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={isEditing ? editedProfile?.preferences.notifications : profile.preferences.notifications}
                      onChange={(e) => isEditing && handlePreferenceChange('notifications', e.target.checked)}
                      disabled={!isEditing}
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer ${(isEditing ? editedProfile?.preferences.notifications : profile.preferences.notifications) ? 'peer-checked:bg-primary-500' : ''} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${(isEditing ? editedProfile?.preferences.notifications : profile.preferences.notifications) ? 'peer-checked:after:translate-x-full' : ''}`}></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Niveau de confidentialité</h4>
                    <p className="text-sm text-gray-500">Qui peut voir votre journal d'humeur</p>
                  </div>
                  <select
                    className="mood-input"
                    value={isEditing ? editedProfile?.preferences.privacyLevel : profile.preferences.privacyLevel}
                    onChange={(e) => isEditing && handlePreferenceChange('privacyLevel', e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="public">Public</option>
                    <option value="friends">Amis seulement</option>
                    <option value="private">Privé</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Thème</h4>
                    <p className="text-sm text-gray-500">Apparence de l'application</p>
                  </div>
                  <select
                    className="mood-input"
                    value={isEditing ? editedProfile?.preferences.theme : profile.preferences.theme}
                    onChange={(e) => isEditing && handlePreferenceChange('theme', e.target.value as 'light' | 'dark' | 'system')}
                    disabled={!isEditing}
                  >
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                    <option value="system">Système</option>
                  </select>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="mood-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-4">Statistiques</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Vibes envoyées</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600">8</div>
                  <div className="text-sm text-gray-600">Pulses activés</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">5</div>
                  <div className="text-sm text-gray-600">Défis complétés</div>
                </div>
                <div className="relative p-4 rounded-lg text-center">
                  <button className="w-20 h-20 bg-red-500 rounded-full relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-110">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  <div className="mt-2 text-xl font-bold text-red-600">7</div>
                  <div className="text-sm text-gray-600">Jours consécutifs</div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default ProfilePage;