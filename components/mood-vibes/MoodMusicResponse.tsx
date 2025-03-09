import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../../utils/soundEffects';

type MusicRating = {
  value: number; // 0 = no rating, 1 = black heart, 2-4 = 1-3 red hearts
  timestamp: Date;
};

type MoodMusicResponseProps = {
  moodId: string;
  senderName: string;
  musicTitle: string;
  musicArtist: string;
  onRespond: (response: {
    moodId: string;
    rating: MusicRating;
    guessedRating: MusicRating;
    comment?: string;
  }) => void;
  onClose: () => void;
};

const MoodMusicResponse: React.FC<MoodMusicResponseProps> = ({
  moodId,
  senderName,
  musicTitle,
  musicArtist,
  onRespond,
  onClose
}) => {
  const [myRating, setMyRating] = useState<number>(0);
  const [guessedRating, setGuessedRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const handleRatingSelect = (rating: number) => {
    playSound('click');
    setMyRating(rating);
  };

  const handleGuessSelect = (rating: number) => {
    playSound('click');
    setGuessedRating(rating);
  };

  const handleSubmit = () => {
    if (myRating === 0) return;
    
    playSound('mood-sent');
    
    onRespond({
      moodId,
      rating: {
        value: myRating,
        timestamp: new Date()
      },
      guessedRating: {
        value: guessedRating,
        timestamp: new Date()
      },
      comment: comment.trim() || undefined
    });
    
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  // Helper function to render heart icons based on rating value
  const renderHeartIcon = (value: number, isSelected: boolean) => {
    const opacity = isSelected ? 'opacity-100' : 'opacity-50';
    
    switch(value) {
      case 1:
        return <span className={`text-3xl ${opacity}`}>🖤</span>;
      case 2:
        return <span className={`text-3xl ${opacity}`}>❤️</span>;
      case 3:
        return <span className={`text-3xl ${opacity}`}>❤️❤️</span>;
      case 4:
        return <span className={`text-3xl ${opacity}`}>❤️❤️❤️</span>;
      default:
        return <span className="text-3xl">🤍</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl p-6 max-w-md w-full mx-auto shadow-2xl"
        >
          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">Réponse envoyée !</h3>
              <p className="text-gray-600">Votre avis musical a été partagé avec succès</p>
            </motion.div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Répondre au partage musical</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Musique partagée par {senderName}:</p>
                <p className="font-medium text-lg">{musicTitle}</p>
                <p className="text-gray-600">{musicArtist}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-3">Votre avis sur cette musique</h4>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleRatingSelect(1)}
                    className={`p-2 rounded-full transition-all ${myRating === 1 ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                    title="Je n'aime pas"
                  >
                    {renderHeartIcon(1, myRating === 1)}
                  </button>
                  <button
                    onClick={() => handleRatingSelect(2)}
                    className={`p-2 rounded-full transition-all ${myRating === 2 ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                    title="J'aime un peu"
                  >
                    {renderHeartIcon(2, myRating === 2)}
                  </button>
                  <button
                    onClick={() => handleRatingSelect(3)}
                    className={`p-2 rounded-full transition-all ${myRating === 3 ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                    title="J'aime beaucoup"
                  >
                    {renderHeartIcon(3, myRating === 3)}
                  </button>
                  <button
                    onClick={() => handleRatingSelect(4)}
                    className={`p-2 rounded-full transition-all ${myRating === 4 ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                    title="J'adore"
                  >
                    {renderHeartIcon(4, myRating === 4)}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-3">Devinez l'avis de {senderName}</h4>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleGuessSelect(1)}
                    className={`p-2 rounded-full transition-all ${guessedRating === 1 ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                    title="N'aime pas"
                  >
                    {renderHeartIcon(1, guessedRating === 1)}
                  </button>
                  <button
                    onClick={() => handleGuessSelect(2)}
                    className={`p-2 rounded-full transition-all ${guessedRating === 2 ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                    title="Aime un peu"
                  >
                    {renderHeartIcon(2, guessedRating === 2)}
                  </button>
                  <button
                    onClick={() => handleGuessSelect(3)}
                    className={`p-2 rounded-full transition-all ${guessedRating === 3 ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                    title="Aime beaucoup"
                  >
                    {renderHeartIcon(3, guessedRating === 3)}
                  </button>
                  <button
                    onClick={() => handleGuessSelect(4)}
                    className={`p-2 rounded-full transition-all ${guessedRating === 4 ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                    title="Adore"
                  >
                    {renderHeartIcon(4, guessedRating === 4)}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="comment" className="block text-sm font-medium mb-2">Commentaire (optionnel)</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Partagez votre ressenti sur cette musique..."
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={myRating === 0}
                className={`w-full py-3 rounded-lg font-medium ${myRating === 0 ? 'bg-gray-200 text-gray-500' : 'bg-primary-500 hover:bg-primary-600 text-white'}`}
              >
                Envoyer ma réponse
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MoodMusicResponse;