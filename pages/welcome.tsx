import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoodVibeResponse from '../components/mood-vibes/MoodVibeResponse';

// Temporary wrapper component to replace Layout
export const TempLayout = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <div>
      <title>{title}</title>
      {children}
    </div>
  );
};

const WelcomePage: React.FC = () => {
  // State for interactive elements
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [currentMood, setCurrentMood] = useState('happy');
  const [showMoodResponse, setShowMoodResponse] = useState(false);
  const [selectedMood, setSelectedMood] = useState({
    name: 'Joyeux',
    emoji: '✨',
    color: '#FFD700',
    type: 'vibe',
    description: '',
  });
  
  // Background animation based on mood
  const getMoodBackground = () => {
    switch(currentMood) {
      case 'happy': return 'from-blue-400 via-purple-400 to-pink-300';
      case 'calm': return 'from-green-400 via-teal-400 to-blue-300';
      case 'energetic': return 'from-yellow-400 via-orange-400 to-red-300';
      case 'reflective': return 'from-indigo-400 via-purple-400 to-blue-300';
      default: return 'from-blue-400 via-purple-400 to-pink-300';
    }
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      setCurrentMood(testimonials[(activeTestimonial + 1) % testimonials.length].mood);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTestimonial]);

  // Mock testimonials data
  const testimonials = [
    {
      name: "Sophie",
      age: 24,
      avatar: "👩‍🎨",
      text: "Mood Link a transformé ma façon de communiquer avec mes amis. C'est tellement plus expressif qu'un simple message texte !",
      mood: "happy"
    },
    {
      name: "Thomas",
      age: 31,
      avatar: "👨‍💻",
      text: "J'utilise Mood Link tous les jours pour rester connecté avec ma famille à distance. Les défis nous ont beaucoup rapprochés.",
      mood: "calm"
    },
    {
      name: "Emma",
      age: 28,
      avatar: "👩‍🏫",
      text: "Les badges et les récompenses me motivent à partager régulièrement. J'adore voir l'évolution de mes relations !",
      mood: "energetic"
    },
    {
      name: "Lucas",
      age: 22,
      avatar: "🧑‍🎓",
      text: "Quand je me sens stressé, envoyer un mood à mes amis et recevoir leur soutien fait toute la différence.",
      mood: "reflective"
    }
  ];

  // Available moods for demo
  const availableMoods = [
    // Mood Vibes
    { name: 'Joyeux', emoji: '✨', color: '#FFD700', type: 'vibe' },
    { name: 'Apaisé', emoji: '🌊', color: '#98FB98', type: 'vibe' },
    { name: 'Je bouillonne', emoji: '🔥', color: '#FF4500', type: 'vibe' },
    { name: 'Besoin de souffler', emoji: '💨', color: '#6495ED', type: 'vibe' },
    { name: 'Envie d\'un câlin', emoji: '💙', color: '#FF69B4', type: 'vibe' },
    // Mood Challenges
    { name: 'Défi Motivation', emoji: '💪', color: '#9C27B0', type: 'challenge', description: 'Lance un défi motivation pour booster ton énergie' },
    { name: 'Défi Créatif', emoji: '🎨', color: '#673AB7', type: 'challenge', description: 'Exprime-toi à travers un défi créatif' },
    { name: 'Défi Bien-être', emoji: '🧘', color: '#4CAF50', type: 'challenge', description: 'Prends soin de toi avec un défi bien-être' }
  ];

  // Define the mood type interface
  interface Mood {
    name: string;
    emoji: string;
    color: string;
    type: string;
    description?: string;
  }

  // Define the grouped moods interface
  interface GroupedMoods {
    [key: string]: Mood[];
  }

  // Group moods by type
  const groupedMoods: GroupedMoods = availableMoods.reduce<GroupedMoods>((acc, mood) => {
    if (!acc[mood.type]) acc[mood.type] = [];
    acc[mood.type].push(mood);
    return acc;
  }, {});

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 50 }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Handle demo mood selection
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setTimeout(() => {
      setShowDemo(true);
    }, 300);
  };

  return (
    <TempLayout title="Mood Link - Partage tes émotions, connecte-toi autrement">
      {/* (A) HERO SECTION */}
      <section className={`min-h-screen relative overflow-hidden bg-gradient-to-br ${getMoodBackground()} transition-colors duration-1000`}>
          {/* Animated particles background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white opacity-20"
                style={{
                  width: Math.random() * 100 + 50,
                  height: Math.random() * 100 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50],
                  x: [0, Math.random() * 100 - 50],
                  scale: [0, 1, 0],
                  opacity: [0, 0.2, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              />
            ))}
          </div>
          

          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
                className="mb-4">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
                  <span className="block">Mood Link</span>
                  <motion.span 
                    className="text-3xl md:text-4xl font-medium block mt-2 text-white/90"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Partage tes émotions, connecte-toi autrement
                  </motion.span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium mb-8"
              >
                Envoie ton mood, reçois du soutien en retour, et transforme chaque émotion en lien
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <motion.a
                  href="/signup"
                  className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg inline-flex items-center justify-center hover:bg-opacity-95 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  animate={pulseAnimation}
                >
                  <span className="mr-2">✨</span>
                  S'inscrire
                </motion.a>
                <motion.a
                  href="/login"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center justify-center hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2">👋</span>
                  Se connecter
                </motion.a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute bottom-10 left-0 right-0 flex justify-center"
              >
                
              </motion.div>
            </div>
          </div>
        </section>

        {/* (B) CONCEPT SECTION */}
        <section id="concept-section" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="text-center mb-16"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
              >
                Comment ça fonctionne
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Une nouvelle façon de partager tes émotions en 3 étapes simples
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 text-3xl">
                    <motion.span
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                    >
                      🌈
                    </motion.span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Partage tes Émotions</h3>
                  <p className="text-gray-600">
                    Exprime ce que tu ressens avec des vibes personnalisées et des effets visuels
                  </p>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-3xl">
                    <motion.span
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
                      💬
                    </motion.span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Reçois du Soutien</h3>
                  <p className="text-gray-600">
                    Tes proches répondent avec des actions concrètes et personnalisées
                  </p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-3xl">
                    <motion.span
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                    >
                      ✨
                    </motion.span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Renforce tes Liens</h3>
                  <p className="text-gray-600">
                    Développe des relations plus profondes et authentiques au quotidien
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* (C) VISUAL DEMO SECTION */}
        <section id="demo-section" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="text-center mb-16"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
              >
                Essaie par toi-même
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Sélectionne une émotion et découvre l'expérience Mood Link
              </motion.p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Mood Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
                >
                  <h3 className="text-xl font-bold mb-6 text-gray-800">Choisis ton mood</h3>
                  
                  {/* Mood Vibes Section */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3 text-indigo-700 flex items-center">
                      <span className="mr-2">🌊</span>
                      Mood Vibes
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      {groupedMoods.vibe && groupedMoods.vibe.map((mood, index) => (
                        <motion.button
                          key={mood.name}
                          onClick={() => handleMoodSelect(mood)}
                          className={`flex flex-col items-center p-4 rounded-lg transition-all ${selectedMood.name === mood.name ? 'ring-2 ring-offset-2' : 'hover:bg-gray-50'}`}
                          style={{
                            backgroundColor: selectedMood.name === mood.name ? `${mood.color}30` : 'transparent',
                            borderColor: mood.color,
                            boxShadow: selectedMood.name === mood.name ? `0 0 0 2px ${mood.color}` : 'none',
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="text-3xl mb-2">{mood.emoji}</span>
                          <span className="text-sm text-center font-medium">{mood.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Mood Challenges Section */}
                  <div>
                    <h4 className="text-lg font-medium mb-3 text-purple-700 flex items-center">
                      <span className="mr-2">💪</span>
                      Mood Challenges
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {groupedMoods.challenge && groupedMoods.challenge.map((mood, index) => (
                        <motion.button
                          key={mood.name}
                          onClick={() => handleMoodSelect(mood)}
                          className={`flex items-center p-4 rounded-lg transition-all ${selectedMood.name === mood.name ? 'ring-2 ring-offset-2' : 'hover:bg-gray-50'}`}
                          style={{
                            backgroundColor: selectedMood.name === mood.name ? `${mood.color}20` : 'transparent',
                            borderColor: mood.color,
                            boxShadow: selectedMood.name === mood.name ? `0 0 0 2px ${mood.color}` : 'none',
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + (index * 0.1) }}
                        >
                          <span className="text-3xl mr-3">{mood.emoji}</span>
                          <div className="text-left">
                            <span className="text-sm font-medium block">{mood.name}</span>
                            {mood.description && (
                              <span className="text-xs text-gray-500">{mood.description}</span>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Preview */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="p-6 md:p-8 border-b border-gray-100">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Aperçu en temps réel</h3>
                    <p className="text-gray-500 text-sm">Voici comment ton mood sera partagé</p>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedMood.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 md:p-8"
                    >
                      <div 
                        className="rounded-xl p-6 border-l-4 shadow-md"
                        style={{ 
                          backgroundColor: `${selectedMood.color}15`,
                          borderLeftColor: selectedMood.color
                        }}
                      >
                        <div className="flex items-start mb-4">
                          <motion.span 
                            className="text-3xl mr-4"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: 'reverse'
                            }}
                          >
                            {selectedMood.emoji}
                          </motion.span>
                          <div>
                            <p className="font-semibold text-lg mb-1">Toi</p>
                            <p className="text-gray-600">{selectedMood.name}</p>
                            {selectedMood.type === 'challenge' && selectedMood.description && (
                              <p className="text-sm text-gray-500 mt-1">{selectedMood.description}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500">
                            {selectedMood.type === 'challenge' 
                              ? "Ce défi sera partagé avec tes proches qui pourront le relever avec toi."
                              : "Tes proches recevront cette notification et pourront y répondre avec des actions de soutien personnalisées."}
                          </p>
                        </div>
                      </div>
                      
                      <motion.button
                        className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          document.getElementById('response-demo-section')?.scrollIntoView({ behavior: 'smooth' });
                          setTimeout(() => setShowMoodResponse(true), 500);
                        }}
                      >
                        Répondre avec une action de soutien
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Response Demo Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="text-center mb-16"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
              >
                Répondre à un mood
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Découvre comment apporter ton soutien
              </motion.p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              {/* MoodVibeResponse Component */}
              <AnimatePresence>
                {showMoodResponse ? (
                  <MoodVibeResponse
                    moodId="demo-mood"
                    senderName="Sophie"
                    emotion={{
                      name: selectedMood.name,
                      emoji: selectedMood.emoji
                    }}
                    onRespond={(response) => {
                      console.log('Response sent:', response);
                      setShowMoodResponse(false);
                    }}
                    onClose={() => setShowMoodResponse(false)}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-gray-800">Notification reçue</h3>
                      <p className="text-gray-500 text-sm">Voici ce que tes proches recevront</p>
                    </div>
                    
                    <div className="p-6">
                      <div 
                        className="rounded-xl p-5 border-l-4 shadow-md"
                        style={{ 
                          backgroundColor: `${selectedMood.color}15`,
                          borderLeftColor: selectedMood.color
                        }}
                      >
                        <div className="flex items-start mb-4">
                          <motion.span 
                            className="text-3xl mr-4"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: 'reverse'
                            }}
                          >
                            {selectedMood.emoji}
                          </motion.span>
                          <div>
                            <p className="font-semibold text-lg mb-1">{selectedMood.name}</p>
                            <p className="text-gray-600">De: Sophie</p>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowMoodResponse(true)}
                      >
                        Répondre avec une action de soutien
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* (D) TESTIMONIALS SECTION */}
        <section id="testimonials-section" className={`py-20 bg-gradient-to-br ${getMoodBackground()} transition-colors duration-1000 relative overflow-hidden`}>
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white opacity-10"
                style={{
                  width: Math.random() * 80 + 20,
                  height: Math.random() * 80 + 20,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * 50 - 25],
                  x: [0, Math.random() * 50 - 25],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="text-center mb-16"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-4 text-white"
              >
                Ce qu'en disent nos utilisateurs
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-xl text-white/90 max-w-2xl mx-auto"
              >
                Rejoins une communauté qui transforme sa façon de communiquer
              </motion.p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl border border-white/20"
                >
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
                      {testimonials[activeTestimonial].avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-lg md:text-xl italic mb-6">
                        "{testimonials[activeTestimonial].text}"
                      </p>
                      <div className="flex items-center">
                        <div>
                          <p className="font-bold text-white">{testimonials[activeTestimonial].name}</p>
                          <p className="text-white/70 text-sm">{testimonials[activeTestimonial].age} ans</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${activeTestimonial === index ? 'bg-white scale-125' : 'bg-white/40'}`}
                    aria-label={`Voir le témoignage ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* (E) CALL-TO-ACTION SECTION */}
  <section id="cta-section" className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Prêt à transformer tes relations ?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Rejoins notre communauté et découvre une nouvelle façon de partager tes émotions
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.a
              href="/signup"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg inline-flex items-center justify-center hover:from-indigo-700 hover:to-purple-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">✨</span>
              Créer mon compte
            </motion.a>
            <motion.a
              href="#demo-section"
              className="bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center justify-center hover:bg-indigo-50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">🎥</span>
              Voir une démo
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
  </TempLayout>
  );
};

export default WelcomePage;
