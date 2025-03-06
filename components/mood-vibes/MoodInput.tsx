import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { playSound, initSounds } from '../../utils/soundEffects';
import TestMoodButton from './TestMoodButton';

type Emotion = {
  name: string;
  emoji: string;
  color: string;
  effect: {
    type: 'heat' | 'wind' | 'heartbeat' | 'wave' | 'sparkle';
    intensity: number;
  };
};

const emotions: Emotion[] = [
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
    name: 'Apaisé', 
    emoji: '🌊', 
    color: '#98FB98',
    effect: { type: 'wave', intensity: 0.4 }
  },
  { 
    name: 'Joyeux', 
    emoji: '✨', 
    color: '#FFD700',
    effect: { type: 'sparkle', intensity: 0.9 }
  },
  { 
    name: 'Mélancolique', 
    emoji: '🌧️', 
    color: '#6495ED',
    effect: { type: 'wave', intensity: 0.5 }
  },
  { 
    name: 'Énergique', 
    emoji: '⚡', 
    color: '#FF4500',
    effect: { type: 'heat', intensity: 1.0 }
  },
  { 
    name: 'Serein', 
    emoji: '🍃', 
    color: '#98FB98',
    effect: { type: 'wind', intensity: 0.3 }
  }
];

const MoodInput: React.FC = () => {
  useEffect(() => {
    initSounds();
  }, []);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [intensity, setIntensity] = useState<number>(5);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleEmotionSelect = (emotion: Emotion) => {
    playSound('click');
    setSelectedEmotion(emotion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmotion) return;
    
    playSound('mood-sent');
    
    setIsSubmitting(true);
    
    try {
      const newMood = {
        id: Date.now().toString(),
        emotion: selectedEmotion.name,
        emoji: selectedEmotion.emoji,
        intensity,
        note,
        timestamp: new Date(),
      };
      
      const existingMoods = JSON.parse(localStorage.getItem('moods') || '[]');
      const updatedMoods = [newMood, ...existingMoods];
      localStorage.setItem('moods', JSON.stringify(updatedMoods));
      
      setSelectedEmotion(null);
      setIntensity(5);
      setNote('');
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mood-container max-w-md mx-auto relative px-4 sm:px-6 md:px-8">
      <TestMoodButton emotions={emotions} position="top-right" id="mood-input" />
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Comment vous sentez-vous?</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {emotions.map((emotion) => (
            <button
              key={emotion.name}
              type="button"
              onClick={() => handleEmotionSelect(emotion)}
              className={`flex flex-col items-center p-3 sm:p-4 rounded-lg transition-all ${selectedEmotion?.name === emotion.name ? 'ring-2 ring-offset-2' : 'hover:bg-gray-50'}`}
              style={{
                backgroundColor: selectedEmotion?.name === emotion.name ? `${emotion.color}30` : 'transparent',
                borderColor: emotion.color,
                boxShadow: selectedEmotion?.name === emotion.name ? `0 0 0 2px ${emotion.color}` : 'none',
              }}
            >
              <span className="text-2xl sm:text-3xl mb-2">{emotion.emoji}</span>
              <span className="text-xs sm:text-sm text-center font-medium">{emotion.name}</span>
            </button>
          ))}
        </div>
        
        {selectedEmotion && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Intensité</label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Faible</span>
                <span>Modérée ({intensity})</span>
                <span>Forte</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="note" className="block text-sm font-medium mb-2">Note (optionnel)</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mood-input w-full h-24 sm:h-32"
                placeholder="Qu'est-ce qui vous fait ressentir cela?"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="mood-button w-full flex justify-center items-center py-3 sm:py-4 text-base sm:text-lg"
            >
              {isSubmitting ? (
                <span>Enregistrement...</span>
              ) : (
                <span>Enregistrer mon humeur</span>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MoodInput;