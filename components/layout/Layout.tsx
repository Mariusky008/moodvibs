import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import MoodVibe from '../mood-vibes/MoodVibe';
import MoodPulse from '../mood-vibes/MoodPulse';
import MoodChallenge from '../mood-vibes/MoodChallenge';
import TestMoodButton from '../mood-vibes/TestMoodButton';

type Props = {
  children?: ReactNode;
  title?: string;
};

type MoodModalType = 'vibes' | 'pulse' | 'challenge' | 'test' | null;

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

const Layout = ({ children, title = 'MoodVibes' }: Props) => {
  const router = useRouter();
  const isWelcomePage = router.pathname === '/welcome';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMoodModal, setActiveMoodModal] = useState<MoodModalType>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMoodClick = (modalType: MoodModalType) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveMoodModal(modalType);
  };

  const handleTestMoodReceive = () => {
    // The TestMoodButton component will handle the notification display
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {!isWelcomePage && (
        <>
          <header className="bg-white shadow-sm">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-primary-600">MoodVibes</Link>
                
                {/* Mobile menu button */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleMenu}
                    className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-500 hover:bg-gray-100 focus:outline-none"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {isMenuOpen ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      )}
                    </svg>
                  </button>
                  <div className="relative z-50">
                    <TestMoodButton emotions={emotions} position="top-right" id="header-dice" />
                  </div>
                </div>-
                
                {/* Desktop menu */}
                <div className="hidden md:flex items-center space-x-6">
                  <div className="flex space-x-4">
                    <Link href="/" className="text-gray-600 hover:text-primary-500">Accueil</Link>
                    <Link href="/connections" className="text-gray-600 hover:text-primary-500">Connexions</Link>
                    <Link href="/objectives" className="text-gray-600 hover:text-primary-500">Objectifs</Link>
                    <Link href="/history" className="text-gray-600 hover:text-primary-500">Historique</Link>
                  </div>
                </div>
              </div>

              {/* Mobile menu */}
              <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
                <div className="flex flex-col space-y-4">
                  <Link href="/" className="text-gray-600 hover:text-primary-500 py-2">Accueil</Link>
                  <Link href="/connections" className="text-gray-600 hover:text-primary-500 py-2">Connexions</Link>
                  <Link href="/objectives" className="text-gray-600 hover:text-primary-500 py-2">Objectifs</Link>
                  <Link href="/history" className="text-gray-600 hover:text-primary-500 py-2">Historique</Link>
                </div>
              </div>
            </nav>
          </header>
        </>
      )}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {!isWelcomePage && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 md:hidden bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-lg z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="flex justify-around items-center p-4">
            <motion.button
              onClick={handleMoodClick('vibes')}
              className="flex flex-col items-center space-y-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="text-2xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                🌊
              </motion.span>
              <span className="text-sm font-medium text-gray-600">Vibes</span>
            </motion.button>

            <motion.button
              onClick={handleMoodClick('pulse')}
              className="flex flex-col items-center space-y-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="text-2xl"
                animate={{ 
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                💫
              </motion.span>
              <span className="text-sm font-medium text-gray-600">Pulse</span>
            </motion.button>

            <motion.button
              onClick={handleMoodClick('challenge')}
              className="flex flex-col items-center space-y-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="text-2xl"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                💪
              </motion.span>
              <span className="text-sm font-medium text-gray-600">Challenge</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Mood Modals */}
      {activeMoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white rounded-xl w-full max-w-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">
                    {activeMoodModal === 'vibes' ? '🌊' : activeMoodModal === 'pulse' ? '💫' : '💪'}
                  </span>
                  <h3 className="text-xl font-bold">
                    {activeMoodModal === 'vibes' ? 'Mood Vibes' : activeMoodModal === 'pulse' ? 'Mood Pulse' : 'Mood Challenge'}
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveMoodModal(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {activeMoodModal === 'vibes' && (
                <MoodVibe 
                  userId="demo-user"
                  userName="Utilisateur"
                  onSendVibe={(emotion, recipientId) => console.log(emotion, recipientId)}
                />
              )}
              {activeMoodModal === 'pulse' && (
                <MoodPulse 
                  userId="demo-user"
                  userName="Utilisateur"
                />
              )}
              {activeMoodModal === 'challenge' && (
                <MoodChallenge 
                  userId="demo-user"
                  userName="Utilisateur"
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Layout;