import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import BadgeCard from './BadgeCard';

type Badge = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  progress: number;
  threshold: number;
  color: string;
};

const featuredBadges: Badge[] = [
  {
    id: '1',
    name: 'Super Supporter',
    emoji: '🌟',
    description: 'A soutenu 50 personnes',
    progress: 50,
    threshold: 50,
    color: '#FFD700'
  },
  {
    id: '2',
    name: 'Maître Zen',
    emoji: '🧘',
    description: 'A complété 30 défis de respiration',
    progress: 30,
    threshold: 30,
    color: '#4CAF50'
  },
  {
    id: '3',
    name: 'Ami Fidèle',
    emoji: '💫',
    description: 'A envoyé 100 vibes positives',
    progress: 85,
    threshold: 100,
    color: '#9C27B0'
  }
];

const FeaturedBadges: React.FC = () => {
  const router = useRouter();

  const handleBadgeClick = () => {
    router.push('/profile');
  };

  return (
    <div className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">Badges Acquis</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez vos réalisations les plus remarquables. Cliquez sur un badge pour voir tous vos accomplissements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={handleBadgeClick}
              className="cursor-pointer transform transition-all duration-300 hover:translate-y-[-8px]"
            >
              <BadgeCard {...badge} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <button
            onClick={handleBadgeClick}
            className="inline-flex items-center px-6 py-3 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
          >
            Voir tous mes badges
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedBadges;