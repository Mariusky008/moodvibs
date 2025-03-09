import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound, initSounds } from '../../utils/soundEffects';
import MoodVibeResponse from './MoodVibeResponse';
import MoodPulseAnimation from './MoodPulseAnimation';
import MoodMusicResponse from './MoodMusicResponse';

type Emotion = {
  name: string;
  emoji: string;
  color: string;
  effect: {
    type: 'heat' | 'wind' | 'heartbeat' | 'wave' | 'sparkle' | 'pulse';
    intensity: number;
  };
};

type TestMoodButtonProps = {
  emotions: Emotion[];
  position?: 'top-right' | 'bottom-right';
  id?: string;
};

const TestMoodButton: React.FC<TestMoodButtonProps> = ({ emotions, position = 'top-right', id = 'default' }) => {
  useEffect(() => {
    initSounds();
  }, []);
  const [showTestNotification, setShowTestNotification] = useState(false);
  const [testMood, setTestMood] = useState<{emotion: Emotion, senderName: string} | null>(null);
  const [showResponsePopup, setShowResponsePopup] = useState(false);
  const [showMoodVibeResponse, setShowMoodVibeResponse] = useState(false);
  const [showMoodMusicResponse, setShowMoodMusicResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [currentAction, setCurrentAction] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [moodId, setMoodId] = useState('');
  const [showPulseAnimation, setShowPulseAnimation] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<{
    title: string;
    artist: string;
    audioUrl: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const componentMounted = useRef(true);

  const mockMusicLibrary = [
    { title: 'Bohemian Rhapsody', artist: 'Queen', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'Billie Jean', artist: 'Michael Jackson', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { title: 'Imagine', artist: 'John Lennon', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  ];

  const handleTestMoodReceive = () => {
    if (!componentMounted.current) return false;
    playSound('click');
    
    setShowTestNotification(false);
    setTestMood(null);
    setCurrentMusic(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setTimeout(() => {
      if (!componentMounted.current) return;
      
      // Always send music with Thomas as sender and Imagine by John Lennon as the song
      const imagineMusic = mockMusicLibrary.find(music => 
        music.title === 'Imagine' && music.artist === 'John Lennon'
      ) || mockMusicLibrary[2]; // Fallback to the third item which should be Imagine
      
      setCurrentMusic(imagineMusic);
      const musicMood = {
        name: "Partage musical",
        emoji: "🎵",
        color: "#9C27B0",
        effect: {
          type: 'pulse' as const,
          intensity: 0.8
        }
      };
      
      setTestMood({
        emotion: musicMood,
        senderName: 'Thomas'
      });
      
      setShowTestNotification(true);
      playSound('mood-received');
    }, 100);

    return false;
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentMusic) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (currentMusic && !audioRef.current) {
      audioRef.current = new Audio(currentMusic.audioUrl);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
        audioRef.current = null;
      }
    };
  }, [currentMusic]);

  useEffect(() => {
    componentMounted.current = true;
    return () => {
      componentMounted.current = false;
    };
  }, []);

  const positionClass = position === 'top-right' ? 'top-4 right-4' : 'bottom-4 right-4';

  return (
    <>
      <AnimatePresence>
        {showTestNotification && testMood && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-4 max-w-sm w-[calc(100%-2rem)] mx-4 bg-white/95 rounded-xl shadow-2xl p-4 sm:p-6 border-l-4 backdrop-blur-md ring-1 ring-black/5 z-[100]"
            style={{ 
              borderLeftColor: testMood.emotion.color,
              backgroundColor: `${testMood.emotion.color}25`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 8px 24px -8px rgba(0, 0, 0, 0.15)'
            }}
          >
          <div className="flex flex-col">
            <div className="flex items-start sm:items-center mb-4">
              <motion.span 
                className="text-2xl sm:text-3xl mr-3 sm:mr-4 flex-shrink-0"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {testMood.emotion.emoji}
              </motion.span>
              <div>
                <p className="font-semibold text-base sm:text-lg mb-1">{testMood.senderName} {currentMusic ? 'partage une musique' : 'ressent...'}</p>
                <p className="text-gray-600 font-medium text-sm sm:text-base">
                  {currentMusic ? `${currentMusic.title} - ${currentMusic.artist}` : testMood.emotion.name}
                </p>
              </div>
            </div>

            {currentMusic && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <button
                  onClick={togglePlayPause}
                  className="flex items-center justify-center w-full py-2 px-4 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-colors"
                >
                  <span className="text-xl mr-2">{isPlaying ? '⏸️' : '▶️'}</span>
                  <span className="font-medium">{isPlaying ? 'Pause' : 'Écouter'}</span>
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSound('click');
                  const uniqueId = `mood-${Date.now()}`;
                  setMoodId(uniqueId);
                  if (currentMusic) {
                    setShowMoodMusicResponse(true);
                  } else {
                    setShowMoodVibeResponse(true);
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-xl text-sm font-medium transition-colors shadow-sm"
              >
                {currentMusic ? 'Répondre avec MoodMusic 💬' : 'Répondre avec MoodVibe 💬'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSound('click');
                  if (audioRef.current) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                  }
                  setShowTestNotification(false);
                }}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium transition-colors shadow-sm"
              >
                Fermer
              </motion.button>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleTestMoodReceive}
        className={`fixed ${positionClass} bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-30`}
        title="Tester la réception d'une humeur"
      >
        <span className="text-2xl">🎲</span>
        <span className="sr-only">Tester la réception d'une humeur</span>
      </button>

      <AnimatePresence>
        {showResponsePopup && testMood && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-auto shadow-2xl"
            >
              {showSuccessMessage ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6 sm:py-8"
                >
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-xl font-semibold text-green-600 mb-2">Message envoyé !</h3>
                  <p className="text-gray-600">Votre message a été partagé avec succès</p>
                </motion.div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold">
                      {currentAction === 'câlin' && 'Envoyer un câlin virtuel'}
                      {currentAction === 'apaisant' && 'Envoyer un message apaisant'}
                      {currentAction === 'soutien' && 'Envoyer un message de soutien'}
                      {currentAction === 'partage' && 'Partager ce moment'}
                    </h3>
                    <button 
                      onClick={() => setShowResponsePopup(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-600 mb-2">Votre message pour {testMood.senderName}:</p>
                    <div className="flex items-center bg-gray-50 rounded-lg p-3 mb-4">
                      <span className="text-2xl mr-3">{selectedEmoji}</span>
                      <div>
                        <p className="text-sm text-gray-500">En réponse à:</p>
                        <p className="font-medium">{testMood.emotion.name}</p>
                      </div>
                    </div>
                    <textarea
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder={`Écrivez votre message personnalisé...`}
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
                          className={`p-2 rounded-lg text-2xl ${selectedEmoji === emoji ? 
                            'bg-primary-100 ring-2 ring-primary-500' : 
                            'bg-gray-50 hover:bg-gray-100'}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowResponsePopup(false)}
                      className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        playSound('mood-sent');
                        setShowSuccessMessage(true);
                        setTimeout(() => {
                          setShowResponsePopup(false);
                          setShowSuccessMessage(false);
                          setResponseMessage('');
                          setSelectedEmoji('');
                          setCurrentAction('');
                        }, 2000);
                      }}
                      disabled={!selectedEmoji}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedEmoji ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      Envoyer
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showMoodVibeResponse && testMood && (
        <MoodVibeResponse
          moodId={moodId}
          senderName={testMood.senderName}
          emotion={testMood.emotion}
          onClose={() => setShowMoodVibeResponse(false)}
          onRespond={(response) => {
            setShowMoodVibeResponse(false);
            playSound('mood-sent');
            // In a real app, you would send this response to your backend
            console.log('Response sent:', response);
          }}
        />
      )}

      {showMoodMusicResponse && testMood && currentMusic && (
        <MoodMusicResponse
          moodId={moodId}
          senderName={testMood.senderName}
          musicTitle={currentMusic.title}
          musicArtist={currentMusic.artist}
          onClose={() => setShowMoodMusicResponse(false)}
          onRespond={(response) => {
            setShowMoodMusicResponse(false);
            playSound('mood-sent');
            // In a real app, you would send this response to your backend
            console.log('Music response sent:', response);
          }}
        />
      )}

      {showPulseAnimation && (
        <MoodPulseAnimation
          isVisible={showPulseAnimation}
          onAnimationComplete={() => setShowPulseAnimation(false)}
        />
      )}
    </>
  );
};

export default TestMoodButton;