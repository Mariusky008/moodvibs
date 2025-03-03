import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';

const WelcomePage = () => {
  return (
    <Layout title="Bienvenue sur MoodVibes - Exprimez et partagez vos émotions">
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-16 relative z-10">
            <motion.h1 
              className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-sm leading-tight"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 10, 
                delay: 0.2 
              }}
              whileHover={{ scale: 1.05 }}
            >
              Bienvenue sur
              <br />
              MoodVibes
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-medium mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 50, 
                delay: 0.5 
              }}
            >
              Exprimez, partagez et enrichissez vos relations avec une application qui donne une nouvelle dimension à vos émotions
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <a 
                href="/signup"
                className="mood-button bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full text-lg font-semibold transform hover:scale-105 transition-all inline-flex items-center justify-center"
              >
                <span className="mr-2">✨</span>
                Commencer l'aventure
              </a>
              <a 
                href="/login"
                className="mood-button bg-white hover:bg-gray-50 text-white px-8 py-4 rounded-full text-lg font-semibold transform hover:scale-105 transition-all border-2 border-primary-600 inline-flex items-center justify-center"
              >
                <span className="mr-2">👋</span>
                Se connecter
              </a>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              className="feature-card bg-white rounded-xl shadow-lg overflow-hidden"
              whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="h-48 bg-blue-100 flex items-center justify-center">
                <motion.div 
                  className="text-8xl"
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
                </motion.div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Mood Vibes</h3>
                <p className="text-gray-600">
                  Exprimez vos émotions avec des animations interactives et partagez-les avec vos proches
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="feature-card bg-white rounded-xl shadow-lg overflow-hidden"
              whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="h-48 bg-purple-100 flex items-center justify-center">
                <motion.div 
                  className="text-8xl"
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
                </motion.div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Mood Pulse</h3>
                <p className="text-gray-600">
                  Activez votre présence bienveillante et montrez à vos proches que vous êtes là pour eux
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="feature-card bg-white rounded-xl shadow-lg overflow-hidden"
              whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="h-48 bg-green-100 flex items-center justify-center">
                <motion.div 
                  className="text-8xl"
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
                </motion.div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Mood Challenge</h3>
                <p className="text-gray-600">
                  Relevez des défis adaptés à votre humeur pour améliorer votre bien-être au quotidien
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Pourquoi choisir MoodVibes ?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xl">🔄</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Connexion authentique</h3>
                    <p className="text-gray-600 text-sm">Créez des liens plus profonds avec vos proches grâce à des interactions émotionnelles riches</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-xl">🛡️</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Confidentialité assurée</h3>
                    <p className="text-gray-600 text-sm">Contrôlez qui peut voir vos émotions et vos interactions avec un système de confidentialité avancé</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-xl">📈</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Suivi de progression</h3>
                    <p className="text-gray-600 text-sm">Visualisez l'évolution de votre bien-être émotionnel et de vos relations au fil du temps</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-xl">🎯</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Défis personnalisés</h3>
                    <p className="text-gray-600 text-sm">Relevez des défis adaptés à votre humeur pour améliorer votre bien-être au quotidien</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <a 
              href="/index" 
              className="mood-button inline-block px-8 py-3 text-lg"
            >
              Découvrir l'application
            </a>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default WelcomePage;