import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'MoodVibes' }: Props) => {
  const router = useRouter();
  const isWelcomePage = router.pathname === '/welcome';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMoodModal, setActiveMoodModal] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMoodClick = (modalType: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveMoodModal(modalType);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {!isWelcomePage && (
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">MoodVibes</Link>
              
              {/* Mobile menu button */}
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

              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex space-x-4">
                  <Link href="/" className="text-gray-600 hover:text-primary-500">Accueil</Link>
                  <Link href="/connections" className="text-gray-600 hover:text-primary-500">Connexions</Link>
                  <Link href="/objectives" className="text-gray-600 hover:text-primary-500">Objectifs</Link>
                  <Link href="/history" className="text-gray-600 hover:text-primary-500">Historique</Link>
                </div>
                <div className="flex items-center space-x-4 border-l pl-6 border-gray-200">
                  <button onClick={handleMoodClick('vibes')} className="text-2xl hover:scale-110 transition-transform" title="Mood Vibes">🌊</button>
                  <button onClick={handleMoodClick('pulse')} className="text-2xl hover:scale-110 transition-transform" title="Mood Pulse">💫</button>
                  <button onClick={handleMoodClick('challenge')} className="text-2xl hover:scale-110 transition-transform" title="Mood Challenge">💪</button>
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
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                  <button onClick={handleMoodClick('vibes')} className="text-2xl hover:scale-110 transition-transform" title="Mood Vibes">🌊</button>
                  <button onClick={handleMoodClick('pulse')} className="text-2xl hover:scale-110 transition-transform" title="Mood Pulse">💫</button>
                  <button onClick={handleMoodClick('challenge')} className="text-2xl hover:scale-110 transition-transform" title="Mood Challenge">💪</button>
                </div>
              </div>
            </div>
          </nav>
        </header>
      )}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Mood Modals */}
      {activeMoodModal === 'vibes' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Mood Vibes</h2>
            {/* Add your MoodVibe component here */}
            <button onClick={() => setActiveMoodModal(null)} className="mt-4 px-4 py-2 bg-gray-200 rounded-lg">Close</button>
          </div>
        </div>
      )}

      {activeMoodModal === 'pulse' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Mood Pulse</h2>
            {/* Add your MoodPulse component here */}
            <button onClick={() => setActiveMoodModal(null)} className="mt-4 px-4 py-2 bg-gray-200 rounded-lg">Close</button>
          </div>
        </div>
      )}

      {activeMoodModal === 'challenge' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Mood Challenge</h2>
            {/* Add your MoodChallenge component here */}
            <button onClick={() => setActiveMoodModal(null)} className="mt-4 px-4 py-2 bg-gray-200 rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;