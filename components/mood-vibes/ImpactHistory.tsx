import React from 'react';
import { motion } from 'framer-motion';

type SupportEvent = {
  id: string;
  type: 'pulse' | 'challenge' | 'vibe';
  timestamp: Date;
  fromUserId: string;
  toUserId: string;
  impact: number; // 1-10 scale of how much it helped
  description: string;
  emoji: string;
};

type ImpactHistoryProps = {
  userId: string;
  friendId: string;
  userName: string;
  friendName: string;
};

const ImpactHistory: React.FC<ImpactHistoryProps> = ({ userId, friendId, userName, friendName }) => {
  // In a real app, this would be fetched from an API
  const [supportEvents, setSupportEvents] = React.useState<SupportEvent[]>([
    {
      id: '1',
      type: 'pulse',
      timestamp: new Date(Date.now() - 86400000), // Yesterday
      fromUserId: userId,
      toUserId: friendId,
      impact: 8,
      description: `${userName} a été présent(e) silencieusement pendant que ${friendName} traversait un moment difficile`,
      emoji: '💙'
    },
    {
      id: '2',
      type: 'challenge',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      fromUserId: friendId,
      toUserId: userId,
      impact: 9,
      description: `${friendName} a complété le défi "Défi Respiration" envoyé par ${userName}`,
      emoji: '🧘'
    },
    {
      id: '3',
      type: 'vibe',
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      fromUserId: userId,
      toUserId: friendId,
      impact: 7,
      description: `${userName} a envoyé une vibe "Envie d'un câlin" à ${friendName}`,
      emoji: '💙'
    },
  ]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const userHelpedFriend = supportEvents.filter(e => e.fromUserId === userId && e.toUserId === friendId).length;
    const friendHelpedUser = supportEvents.filter(e => e.fromUserId === friendId && e.toUserId === userId).length;
    const highImpactEvents = supportEvents.filter(e => e.impact >= 8).length;
    const completedChallenges = supportEvents.filter(e => e.type === 'challenge').length;
    
    return {
      userHelpedFriend,
      friendHelpedUser,
      highImpactEvents,
      completedChallenges
    };
  }, [supportEvents, userId, friendId]);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'pulse': return 'border-blue-200 bg-blue-50';
      case 'challenge': return 'border-green-200 bg-green-50';
      case 'vibe': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="mood-container">
      <h2 className="text-2xl font-bold mb-6">Historique d'Impact</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-lg bg-white shadow text-center">
          <div className="text-3xl font-bold text-primary-600">{stats.userHelpedFriend}</div>
          <div className="text-sm text-gray-600">Fois où {userName} a aidé {friendName}</div>
        </div>
        <div className="p-4 rounded-lg bg-white shadow text-center">
          <div className="text-3xl font-bold text-primary-600">{stats.friendHelpedUser}</div>
          <div className="text-sm text-gray-600">Fois où {friendName} a aidé {userName}</div>
        </div>
        <div className="p-4 rounded-lg bg-white shadow text-center">
          <div className="text-3xl font-bold text-primary-600">{stats.highImpactEvents}</div>
          <div className="text-sm text-gray-600">Moments à fort impact</div>
        </div>
        <div className="p-4 rounded-lg bg-white shadow text-center">
          <div className="text-3xl font-bold text-primary-600">{stats.completedChallenges}</div>
          <div className="text-sm text-gray-600">Défis complétés</div>
        </div>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Timeline events */}
        <div className="space-y-6">
          {supportEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`ml-10 p-4 rounded-lg border ${getEventColor(event.type)} relative`}
            >
              {/* Timeline dot */}
              <div className="absolute left-[-2rem] top-4 w-4 h-4 rounded-full bg-primary-500 border-4 border-white"></div>
              
              <div className="flex items-start">
                <span className="text-2xl mr-3">{event.emoji}</span>
                <div>
                  <p className="text-gray-700">{event.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(event.timestamp)}</p>
                </div>
                <div className="ml-auto bg-white rounded-full px-2 py-1 text-sm font-medium border">
                  Impact: {event.impact}/10
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImpactHistory;