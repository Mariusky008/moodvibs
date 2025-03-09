import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { playSound } from '../../utils/soundEffects';

interface Recipient {
  id: string;
  name: string;
}

interface MoodMusicProps {
  userId: string;
  userName: string;
  avatarUrl?: string;
  onSendMusic?: (musicId: string, recipientId: string) => void;
}

interface Music {
  id: string;
  title: string;
  artist: string;
  genre: string;
  emoji: string;
  color: string;
  audioUrl?: string;
  rating?: number;
  sharedPlaylist?: boolean;
}

interface MusicReaction {
  musicId: string;
  userId: string;
  rating: number;
  timestamp: Date;
}

type ModalState = 'preview' | 'recipient' | 'success' | 'guess' | null;

const MoodMusic: React.FC<MoodMusicProps> = ({ userId, userName, avatarUrl, onSendMusic }) => {
  const [isMusicActive, setIsMusicActive] = useState(false);
  const [musicCount, setMusicCount] = useState(0);
  const [currentModal, setCurrentModal] = useState<ModalState>(null);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [lastRecipientName, setLastRecipientName] = useState<string>('');
  const [recipientCounts, setRecipientCounts] = useState<Record<string, number>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [receivedRating, setReceivedRating] = useState<number | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [sharedPlaylist, setSharedPlaylist] = useState<Music[]>([]);
  const [musicHistory, setMusicHistory] = useState<Music[]>([]);
  const [guessedRating, setGuessedRating] = useState<number | null>(null);
  const [showGuessResult, setShowGuessResult] = useState(false);
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [points, setPoints] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const musicControls = useAnimation();
  const buttonControls = useAnimation();

  // Mock music library (replace with actual data in production)
  const mockMusicLibrary: Music[] = [
    { id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock', emoji: '🎸', color: '#E91E63', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: '2', title: 'Billie Jean', artist: 'Michael Jackson', genre: 'Pop', emoji: '🎵', color: '#9C27B0', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: '3', title: 'Imagine', artist: 'John Lennon', genre: 'Pop', emoji: '🎹', color: '#2196F3', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { id: '4', title: 'Shape of You', artist: 'Ed Sheeran', genre: 'Pop', emoji: '🎧', color: '#FF9800', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { id: '5', title: 'Despacito', artist: 'Luis Fonsi', genre: 'Reggaeton', emoji: '💃', color: '#4CAF50', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    { id: '6', title: 'Lose Yourself', artist: 'Eminem', genre: 'Hip Hop', emoji: '🎤', color: '#607D8B', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
    { id: '7', title: 'Hotel California', artist: 'Eagles', genre: 'Rock', emoji: '🎸', color: '#795548', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
    { id: '8', title: 'Sweet Child O\'Mine', artist: 'Guns N\'Roses', genre: 'Rock', emoji: '🤘', color: '#FF5722', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  ];

  // Mock recipients data (replace with actual data in production)
  const mockRecipients: Recipient[] = [
    { id: '1', name: 'Sophie' },
    { id: '2', name: 'Thomas' },
    { id: '3', name: 'Emma' },
  ];

  // Clean up any timers and audio when component unmounts
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Simulate receiving a reaction from another user
  // In a real app, this would come from a websocket or real-time database
  useEffect(() => {
    if (isPlaying && selectedMusic) {
      // Simulate the other user sending a reaction after a random delay
      const reactionDelay = setTimeout(() => {
        // Random rating between 0-3
        const incomingRating = Math.floor(Math.random() * 4);
        setReceivedRating(incomingRating);
        setShowReaction(true);
        
        // Hide the reaction animation after 2 seconds
        setTimeout(() => {
          setShowReaction(false);
        }, 2000);
      }, 5000 + Math.random() * 10000); // Random delay between 5-15 seconds
      
      return () => clearTimeout(reactionDelay);
    }
  }, [isPlaying, selectedMusic]);
  
  // Function to send a heart reaction
  const sendHeartReaction = (rating: number) => {
    setCurrentRating(rating);
    setShowReaction(true);
    
    // In a real app, you would send this to the other user via a websocket or real-time database
    console.log(`Sending heart reaction: ${rating}`);
    
    // Hide the reaction animation after 2 seconds
    setTimeout(() => {
      setShowReaction(false);
    }, 2000);
  };
  
  // Handle audio ending
  const handleAudioEnded = () => {
    setIsPlaying(false);
    // Only show guess modal if we have a received rating and haven't guessed yet
    if (receivedRating !== null && guessedRating === null) {
      setCurrentModal('guess');
    }
  };
  
  // Gestion de la lecture audio
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setIsLoading(true);
      audioRef.current.play()
        .then(() => {
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
          setIsLoading(false);
        });
    }
  };
  
  // Mise à jour de la progression de l'audio
  const updateAudioProgress = () => {
    if (!audioRef.current) return;
    
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setAudioProgress(progress);
  };
  
  // Gestion du changement de position dans l'audio
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const newProgress = parseFloat(e.target.value);
    const newTime = (audioRef.current.duration / 100) * newProgress;
    audioRef.current.currentTime = newTime;
    setAudioProgress(newProgress);
  };

  const selectRandomMusic = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * mockMusicLibrary.length);
    return mockMusicLibrary[randomIndex];
  }, []);

  const handleActivateMusic = useCallback(() => {
    const randomMusic = selectRandomMusic();
    setSelectedMusic(randomMusic);
    setCurrentModal('preview');
    playSound('click');
  }, [selectRandomMusic]);

  const handlePreviewConfirm = useCallback(() => {
    setCurrentModal('recipient');
    playSound('click');
  }, []);

  const handleSendMusic = useCallback((): void => {
    if (!selectedRecipient || !selectedMusic) return;

    // Find the recipient name from the ID
    const recipient = mockRecipients.find(r => r.id === selectedRecipient);
    const recipientName = recipient ? recipient.name : '';
    
    // Call the onSendMusic prop if it exists
    if (onSendMusic && selectedMusic) {
      onSendMusic(selectedMusic.id, selectedRecipient);
    }

    // Create a music entry with rating
    const musicEntry = {
      ...selectedMusic,
      rating: currentRating,
      timestamp: new Date()
    };

    // Add to music history
    setMusicHistory(prev => [...prev, musicEntry]);

    // If both users rated the song with 2 or more hearts, add to shared playlist
    if (currentRating >= 2 && receivedRating && receivedRating >= 2) {
      setSharedPlaylist(prev => [...prev, { ...selectedMusic, sharedPlaylist: true }]);
    }

    // Update UI states
    setIsMusicActive(true);
    setMusicCount((prev: number) => prev + 1);
    setCurrentModal('success');
    
    // Update recipient tracking
    setLastRecipientName(recipientName);
    setRecipientCounts(prev => ({
      ...prev,
      [selectedRecipient]: (prev[selectedRecipient] || 0) + 1
    }));
    
    // Trigger confetti animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);

    // Clear any existing timeout
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    
    // Set up new timeout for cleanup - show success message for 2 seconds
    resetTimerRef.current = setTimeout(() => {
      setCurrentModal(null);
      setSelectedRecipient('');
      setIsMusicActive(false);
      setCurrentRating(0);
      setReceivedRating(null);
      resetTimerRef.current = null;
    }, 2000);

    playSound('mood-sent');
  }, [selectedRecipient, selectedMusic, onSendMusic, currentRating, receivedRating]);

  const handleCloseModal = useCallback(() => {
    setCurrentModal(null);
    setSelectedRecipient('');
    playSound('click');
    
    // Arrêter la lecture audio si elle est en cours
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleGuessRating = (rating: number) => {
    setGuessedRating(rating);
    if (receivedRating !== null) {
      const isCorrect = rating === receivedRating;
      if (isCorrect) {
        setPoints(prev => prev + 50);
        playSound('success');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      setShowGuessResult(true);
      
      // Calculate compatibility score
      const ratingDifference = Math.abs(currentRating - receivedRating);
      const compatibility = 100 - (ratingDifference * 25); // 0 diff = 100%, 1 diff = 75%, etc.
      setCompatibilityScore(compatibility);
      
      setTimeout(() => {
        setShowGuessResult(false);
        setCurrentModal(null);
      }, 3000);
    }
  };

  // Add to the return statement, inside the preview modal
  return (
    <div className="mood-container relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xl">{userName[0]}</span>
            </div>
          )}
          <AnimatePresence>
            {isMusicActive && selectedMusic && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={musicControls}
                  exit={{ scale: 1, opacity: 0, transition: { duration: 0.5 } }}
                  style={{
                    backgroundColor: selectedMusic.color,
                    filter: 'blur(12px)',
                    zIndex: 0
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 1.2, opacity: 0.3 }}
                  animate={{
                    scale: [1.2, 1.8, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  exit={{ scale: 1.2, opacity: 0, transition: { duration: 0.5 } }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  style={{
                    backgroundColor: selectedMusic.color,
                    filter: 'blur(15px)',
                    zIndex: 0
                  }}
                />
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 sm:ml-4">
          <h3 className="font-medium text-lg">{userName}</h3>
          <p className="text-sm text-gray-500">
            {isMusicActive ? "Partage musical en cours" : "Prêt à partager"}
          </p>
        </div>

        <button
          onClick={handleActivateMusic}
          className="mood-button transition-all w-full sm:w-auto mt-4 sm:mt-0"
          disabled={isMusicActive}
        >
          Découvrir une musique ensemble
        </button>
      </div>

      {musicCount > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Musique partagée {musicCount} fois
        </div>
      )}
      
      {lastRecipientName && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,235,235,0.9) 100%)',
            boxShadow: '0 4px 15px rgba(255,0,0,0.1)',
            border: '1px solid rgba(255,200,200,0.3)'
          }}
        >
          <div className="flex items-center text-sm">
            <motion.span 
              className="text-red-500 mr-2 text-xl"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🎵
            </motion.span>
            <div>
              <span className="font-medium text-gray-800">Envoyée à </span>
              <span className="font-bold text-primary-600">{lastRecipientName}</span>
              <span className="ml-1 bg-primary-100 px-2 py-0.5 rounded-full text-primary-700 font-medium">
                {recipientCounts[selectedRecipient] || recipientCounts[Object.keys(recipientCounts).pop() || ''] || 1} fois
              </span>
            </div>
          </div>
          
          {/* Display current rating */}
          {currentRating !== null && (
            <div className="mt-2 flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">Votre avis :</span>
              <span className="text-xl">
                {currentRating === 0 ? '🖤' : '❤️'.repeat(currentRating)}
              </span>
            </div>
          )}
          
          {/* Display received rating if any */}
          {receivedRating !== null && (
            <div className="mt-1 flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">Leur avis :</span>
              <span className="text-xl">
                {receivedRating === 0 ? '🖤' : '❤️'.repeat(receivedRating)}
              </span>
            </div>
          )}
          
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'radial-gradient(circle, rgba(255,0,0,0.1) 0%, rgba(255,255,255,0) 70%)'
            }}
          />
        </motion.div>
      )}
      
      {/* Music History Section */}
      {musicHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Historique d'écoute</h3>
          <div className="space-y-3">
            {musicHistory.map((music, index) => (
              <div 
                key={`${music.id}-${index}`}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{music.emoji}</span>
                  <div>
                    <p className="font-medium">{music.title}</p>
                    <p className="text-sm text-gray-600">{music.artist}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xl">
                    {music.rating === 0 ? '🖤' : '❤️'.repeat(music.rating || 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Shared Playlist Section */}
      {sharedPlaylist.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Playlist Mood Link partagée</h3>
          <div className="space-y-3">
            {sharedPlaylist.map((music, index) => (
              <div 
                key={`${music.id}-${index}`}
                className="bg-gradient-to-r from-pink-50 to-rose-50 p-3 rounded-lg shadow-sm border border-pink-200 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{music.emoji}</span>
                  <div>
                    <p className="font-medium">{music.title}</p>
                    <p className="text-sm text-gray-600">{music.artist}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">❤️❤️</span>
                  <button 
                    className="p-2 rounded-full bg-rose-100 hover:bg-rose-200 transition-colors"
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.src = music.audioUrl || '';
                        audioRef.current.play();
                        setIsPlaying(true);
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {currentModal === 'preview' && selectedMusic && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-800 dark:to-pink-800 rounded-2xl max-w-md w-full shadow-xl overflow-hidden border border-rose-200 dark:border-rose-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Découverte musicale</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="text-center mb-6">
                  <motion.div
                    className="text-5xl mb-4 mx-auto"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {selectedMusic.emoji}
                  </motion.div>
                  <h4 className="text-lg font-medium mb-1">{selectedMusic.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedMusic.artist}</p>
                  <div className="mt-2 inline-block px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {selectedMusic.genre}
                  </div>
                </div>
                
                {/* Lecteur audio */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  {selectedMusic.audioUrl && (
                    <>
                      <audio 
                        ref={audioRef}
                        src={selectedMusic.audioUrl}
                        onTimeUpdate={updateAudioProgress}
                        onEnded={handleAudioEnded}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      
                      <div className="flex items-center justify-between mb-3">
                        <button 
                          onClick={togglePlayPause}
                          className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white shadow-md transition-transform transform hover:scale-105 active:scale-95"
                        >
                          {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                        
                        {/* Heart Rating System */}
                        <div className="flex space-x-2">
                          {/* Black Heart (Don't like) */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => sendHeartReaction(0)}
                            className={`p-2 rounded-full ${currentRating === 0 ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                          >
                            <span className="text-xl">🖤</span>
                          </motion.button>
                          
                          {/* Red Hearts (1-3) */}
                          {[1, 2, 3].map((rating) => (
                            <motion.button
                              key={rating}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => sendHeartReaction(rating)}
                              className={`p-2 rounded-full ${currentRating === rating ? 'bg-red-100 dark:bg-red-900/30' : ''}`}
                            >
                              <span className="text-xl">{"❤️".repeat(rating)}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="w-full mb-4">
                        <div className="flex items-center mb-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {audioRef.current ? 
                              `${Math.floor(audioRef.current.currentTime / 60)}:${Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0')}` : 
                              '0:00'}
                          </span>
                          <div className="flex-grow mx-2">
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              value={audioProgress} 
                              onChange={handleProgressChange}
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {audioRef.current && !isNaN(audioRef.current.duration) ? 
                              `${Math.floor(audioRef.current.duration / 60)}:${Math.floor(audioRef.current.duration % 60).toString().padStart(2, '0')}` : 
                              '0:00'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-end mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Volume</span>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            defaultValue="80"
                            onChange={(e) => {
                              if (audioRef.current) {
                                audioRef.current.volume = parseInt(e.target.value) / 100;
                              }
                            }}
                            className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-center space-x-4 mb-2">
                        <button 
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                          onClick={() => {
                            if (audioRef.current) {
                              audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                              updateAudioProgress();
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                          </svg>
                        </button>
                        <button 
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                          onClick={() => {
                            if (audioRef.current) {
                              audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
                              updateAudioProgress();
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Real-time reaction animation */}
                      <AnimatePresence>
                        {showReaction && (
                          <motion.div 
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div
                              className="text-4xl"
                              initial={{ scale: 0, y: 20 }}
                              animate={{ 
                                scale: [0, 1.5, 1],
                                y: [20, -20, -40],
                                opacity: [0, 1, 0]
                              }}
                              transition={{ duration: 1.5 }}
                            >
                              {currentRating === 0 ? '🖤' : '❤️'.repeat(currentRating)}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Received reaction animation */}
                      <AnimatePresence>
                        {receivedRating !== null && (
                          <motion.div 
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div
                              className="text-4xl"
                              initial={{ scale: 0, y: 20 }}
                              animate={{ 
                                scale: [0, 1.5, 1],
                                y: [20, -20, -40],
                                opacity: [0, 1, 0]
                              }}
                              transition={{ duration: 1.5 }}
                            >
                              {receivedRating === 0 ? '🖤' : '❤️'.repeat(receivedRating)}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                  Partagez cette musique avec un ami et découvrez-la ensemble !
                </p>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePreviewConfirm}
                    className="flex-1 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium shadow-sm"
                  >
                    Partager
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCloseModal}
                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
                  >
                    Annuler
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipient Selection Modal */}
      <AnimatePresence>
        {currentModal === 'recipient' && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-800 dark:to-pink-800 rounded-2xl max-w-md w-full shadow-xl overflow-hidden border border-rose-200 dark:border-rose-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Choisir un destinataire</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choisissez avec qui partager cette découverte musicale :
                </p>

                <div className="space-y-3 mb-6">
                  {mockRecipients.map((recipient) => (
                    <motion.button
                      key={recipient.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRecipient(recipient.id)}
                      className={`w-full p-4 rounded-xl flex items-center ${selectedRecipient === recipient.id ? 'bg-rose-100 border-rose-300 dark:bg-rose-900/30 dark:border-rose-700' : 'bg-gray-50 border-gray-200 dark:bg-gray-700/30 dark:border-gray-700'} border transition-colors`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-lg">{recipient.name[0]}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{recipient.name}</p>
                      </div>
                      {selectedRecipient === recipient.id && (
                        <div className="ml-auto">
                          <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSendMusic}
                    disabled={!selectedRecipient}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium shadow-sm ${selectedRecipient ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'}`}
                  >
                    Envoyer
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCloseModal}
                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
                  >
                    Annuler
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {currentModal === 'success' && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-800 dark:to-pink-800 rounded-2xl max-w-md w-full shadow-xl overflow-hidden border border-rose-200 dark:border-rose-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <motion.div
                  className="text-5xl mb-4 mx-auto"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                >
                  ✨
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">Musique partagée !</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Vous allez découvrir cette musique en même temps que votre ami(e).
                </p>
                
                {points > 0 && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <p className="font-medium text-green-700 dark:text-green-400">{points} points accumulés</p>
                  </div>
                )}
                
                {compatibilityScore !== null && (
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/30 dark:to-red-900/30 rounded-lg mb-4">
                    <h4 className="text-lg font-semibold mb-2">Compatibilité musicale</h4>
                    <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{compatibilityScore}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {compatibilityScore >= 90 ? "Vous êtes sur la même longueur d'onde ! 🎵" :
                       compatibilityScore >= 70 ? "Belle harmonie musicale ! 🎶" :
                       compatibilityScore >= 50 ? "Vous commencez à vous synchroniser ! 🎧" :
                       "Continuez à partager pour mieux vous accorder ! 🎼"}
                    </p>
                  </div>
                )}

                {showConfetti && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        initial={{
                          x: '50%',
                          y: '50%',
                          scale: 0
                        }}
                        animate={{
                          x: ['50%', `${Math.random() * 100}%`],
                          y: ['50%', `${Math.random() * 100}%`],
                          scale: [0, 1, 0.5, 0],
                          opacity: [0, 1, 0.5, 0]
                        }}
                        transition={{
                          duration: 1 + Math.random(),
                          ease: "easeOut"
                        }}
                        style={{
                          backgroundColor: [
                            '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
                            '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
                            '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
                            '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
                          ][Math.floor(Math.random() * 16)]
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Guess Modal */}
      <AnimatePresence>
        {currentModal === 'guess' && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-800 dark:to-pink-800 rounded-2xl max-w-md w-full shadow-xl overflow-hidden border border-rose-200 dark:border-rose-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Devinez leur réaction</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="text-center mb-6">
                  <motion.div
                    className="text-5xl mb-4 mx-auto"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🤔
                  </motion.div>
                  <h4 className="text-lg font-medium mb-1">Comment ont-ils réagi à cette musique ?</h4>
                  <p className="text-gray-600 dark:text-gray-400">Devinez leur réaction et gagnez des points !</p>
                </div>
                
                {showGuessResult ? (
                  <div className="text-center mb-6">
                    <div className="text-2xl mb-2">
                      {guessedRating === receivedRating ? "✅ Correct !" : "❌ Pas tout à fait..."}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Leur réaction était : {receivedRating === 0 ? '🖤' : '❤️'.repeat(receivedRating || 0)}
                    </p>
                    {guessedRating === receivedRating && (
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400 font-medium">
                        +50 points !
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center space-x-4 mb-6">
                    {/* Black Heart (Don't like) */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleGuessRating(0)}
                      className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <span className="text-2xl">🖤</span>
                    </motion.button>
                    
                    {/* Red Hearts (1-3) */}
                    {[1, 2, 3].map((rating) => (
                      <motion.button
                        key={rating}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleGuessRating(rating)}
                        className="p-3 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/50"
                      >
                        <span className="text-2xl">{"❤️".repeat(rating)}</span>
                      </motion.button>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCloseModal}
                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
                  >
                    Fermer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodMusic;