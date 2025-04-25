'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './components/Hero';
import Quiz from './components/Quiz';
import ResultCard from './components/ResultCard';
import TwitterInput from './components/TwitterInput';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'home' | 'quiz' | 'twitter' | 'result'>('home');
  const [score, setScore] = useState(0);
  const [twitterUsername, setTwitterUsername] = useState('');

  const handleStartQuiz = () => {
    setCurrentStep('quiz');
  };

  const handleTwitterSubmit = (username: string) => {
    setTwitterUsername(username);
    setCurrentStep('result');
  };

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    setCurrentStep('twitter');
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden" style={{
      backgroundImage: `url('/ChatGPT Image Apr 25, 2025 at 04_14_03 PM.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-pink-800/80" />
      <AnimatePresence mode="wait">
        {currentStep === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <Hero onStart={handleStartQuiz} />
          </motion.div>
        )}

        {currentStep === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <Quiz onComplete={handleQuizComplete} />
          </motion.div>
        )}

        {currentStep === 'twitter' && (
          <motion.div
            key="twitter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <TwitterInput onSubmit={handleTwitterSubmit} />
          </motion.div>
        )}

        {currentStep === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <ResultCard 
              score={score} 
              twitterUsername={twitterUsername} 
              onBackHome={() => setCurrentStep('home')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="absolute bottom-4 right-4 text-[10px] sm:text-xs text-purple-200/50 flex items-center gap-1">
        Powered by 🧠 AI & 💀 Trauma
      </div>
    </main>
  );
}
