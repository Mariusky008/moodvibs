import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BadgeObjective = {
  id: string;
  name: string;
  emoji: string;
  conditions: string;
  effect: string;
  visualDescription: string;
  target: number;
  current: number;
  selected?: boolean;
  badgeType: 'love' | 'trust' | 'help' | 'serenity' | 'sharing' | 'evolution';
  color: string;
};

const predefinedObjectives: BadgeObjective[] = [
  {
    id: '1',
    name: 'Compagnon Bienveillant',
    emoji: '❤️',
    conditions: 'Avoir soutenu l\'autre 10 fois dans un moment difficile',
    effect: 'Amour',
    visualDescription: 'Animation d\'un cœur qui pulse doucement',
    target: 10,
    current: 0,
    badgeType: 'love',
    color: '#FF6B6B'
  },
  {
    id: '2',
    name: 'Pilier de Confiance',
    emoji: '🤝',
    conditions: 'Avoir activé Mood Pulse au moins 5 fois et reçu un retour positif',
    effect: 'Confiance',
    visualDescription: 'Un effet lumineux autour de l\'avatar',
    target: 5,
    current: 0,
    badgeType: 'trust',
    color: '#4ECDC4'
  },
  {
    id: '3',
    name: 'Guide Lumineux',
    emoji: '💡',
    conditions: 'Avoir complété 5 Mood Challenges pour aider l\'autre',
    effect: 'Aide',
    visualDescription: 'Une petite étoile scintillante sur le profil',
    target: 5,
    current: 0,
    badgeType: 'help',
    color: '#45B7D1'
  },
  {
    id: '4',
    name: 'Maître Zen',
    emoji: '☯️',
    conditions: 'Avoir résolu 10 moments de colère grâce aux interactions',
    effect: 'Sérénité',
    visualDescription: 'Une vague d\'eau apaisante sur le fond de l\'écran',
    target: 10,
    current: 0,
    badgeType: 'serenity',
    color: '#96CEB4'
  },
  {
    id: '5',
    name: 'Écho Émotionnel',
    emoji: '🔄',
    conditions: 'Avoir répondu à 20 vibes envoyées par l\'autre',
    effect: 'Partage',
    visualDescription: 'Effet d\'ondes circulaires sur la carte de l\'utilisateur',
    target: 20,
    current: 0,
    badgeType: 'sharing',
    color: '#D4A5A5'
  },
  {
    id: '6',
    name: 'Phare dans la Tempête',
    emoji: '🌟',
    conditions: 'Avoir progressé dans toutes les catégories',
    effect: 'Évolution',
    visualDescription: 'Icône spéciale sur le profil avec une aura lumineuse',
    target: 5,
    current: 0,
    badgeType: 'evolution',
    color: '#FFD166'
  }
];

type CustomObjectiveFormProps = {
  onObjectiveSelect?: (selectedBadgeTypes: string[]) => void;
};

const CustomObjectiveForm: React.FC<CustomObjectiveFormProps> = ({ onObjectiveSelect }) => {
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  
  // Load saved objectives from localStorage when component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedObjectives');
      if (saved) {
        setSelectedObjectives(JSON.parse(saved));
      }
    }
  }, []);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleObjectiveSelect = (objectiveId: string) => {
    setSelectedObjectives(prev => {
      if (prev.includes(objectiveId)) {
        return prev.filter(id => id !== objectiveId);
      } else {
        return [...prev, objectiveId];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedObjectives.length > 0) {
      // Get the badge types of selected objectives with improved type safety
      const selectedBadgeTypes = selectedObjectives
        .map(id => {
          const objective = predefinedObjectives.find(obj => obj.id === id);
          return objective?.badgeType;
        })
        .filter((type): type is BadgeObjective['badgeType'] => type !== undefined);

      // Save selected objectives to localStorage (only in browser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedObjectives', JSON.stringify(selectedObjectives));
      }
      
      // Notify parent component
      onObjectiveSelect?.(selectedBadgeTypes);

      setShowConfirmation(true);
      
      setTimeout(() => {
        setShowConfirmation(false);
      }, 2000);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-center mb-6">Objectifs spéciaux à débloquer</h2>
      <p className="text-center text-gray-600 mb-8">Sélectionnez les badges que vous souhaitez obtenir</p>

      <div className="grid gap-6">
        {predefinedObjectives.map((objective) => (
          <motion.div
            key={objective.id}
            className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer ${selectedObjectives.includes(objective.id) ? 'ring-2 ring-primary-500 bg-primary-50' : ''}`}
            onClick={() => handleObjectiveSelect(objective.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ borderLeft: `4px solid ${objective.color}` }}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <motion.span 
                  className="text-4xl inline-block"
                  whileHover={{
                    scale: 1.2,
                    rotate: objective.badgeType === 'sharing' ? 360 : 0,
                    y: objective.badgeType === 'serenity' ? [-5, 5, -5] : 0
                  }}
                  transition={{
                    duration: 1,
                    repeat: objective.badgeType === 'serenity' ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                >
                  {objective.emoji}
                </motion.span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{objective.name}</h3>
                  <div 
                    className="text-sm font-medium px-3 py-1 rounded-full" 
                    style={{ 
                      backgroundColor: `${objective.color}30`,
                      color: objective.color
                    }}
                  >
                    {objective.effect}
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{objective.conditions}</p>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Effet visuel : </span>
                    {objective.visualDescription}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-grow">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{ backgroundColor: objective.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(objective.current / objective.target) * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <span className="text-sm font-medium">{objective.current}/{objective.target}</span>
                  </div>
                  
                  {selectedObjectives.includes(objective.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-4 text-sm font-medium text-green-600 flex items-center"
                    >
                      <span className="mr-1">✓</span> Sélectionné
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedObjectives.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleConfirm}
          className="mt-6 w-full px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
        >
          Valider la sélection ({selectedObjectives.length} objectif{selectedObjectives.length > 1 ? 's' : ''})
        </motion.button>
      )}

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full text-center"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">Objectifs sélectionnés !</h3>
              <p className="text-gray-600">Vos objectifs ont été enregistrés avec succès</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomObjectiveForm;