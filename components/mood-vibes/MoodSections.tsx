import React from 'react';
import MoodVibe from './MoodVibe';
import MoodPulse from './MoodPulse';
import MoodChallenge from './MoodChallenge';
import MoodJournal from './MoodJournal';
import DailyImpact from './DailyImpact';

const MoodSections: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        <DailyImpact />
        <MoodJournal />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6 py-8">
          <div className="mood-section bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-3">🌊</span>
              <h2 className="text-2xl font-bold">Mood Vibes</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Exprimez vos émotions à travers des animations interactives. Partagez votre état d'esprit avec des effets visuels uniques.
            </p>
            <MoodVibe
              userId="demo-user"
              userName="Utilisateur"
              onSendVibe={(emotion, recipientId) => console.log(emotion, recipientId)}
            />
          </div>

          <div className="mood-section bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-3">💫</span>
              <h2 className="text-2xl font-bold">Mood Pulse</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Activez votre présence bienveillante. Un halo lumineux indiquera aux autres que vous êtes là pour les soutenir.
            </p>
            <MoodPulse
              userId="demo-user"
              userName="Utilisateur"
              onSendPulse={(recipientId) => console.log('Pulse sent to:', recipientId)}
            />
          </div>

          <div className="mood-section bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-3">💪</span>
              <h2 className="text-2xl font-bold">Mood Challenge</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Relevez des défis adaptés à votre humeur : motivation, exutoire ou connexion pour améliorer votre bien-être.
            </p>
            <MoodChallenge
              userId="demo-user"
              userName="Utilisateur"
              onSendChallenge={(challenge, recipientId) => console.log('Challenge sent:', challenge, 'to:', recipientId)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodSections;