'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './components/Hero';
import Quiz from './components/Quiz';
import ResultCard from './components/ResultCard';
import TwitterInput from './components/TwitterInput';
import Image from 'next/image';

// Floating meme elements
const MemeElements = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <motion.div
      className="absolute text-6xl"
      animate={{
        x: ['0%', '100%'],
        y: ['0%', '100%'],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      🚀
    </motion.div>
    <motion.div
      className="absolute right-0 text-6xl"
      animate={{
        x: ['0%', '-100%'],
        y: ['100%', '0%'],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      💎
    </motion.div>
    <motion.div
      className="absolute bottom-0 text-6xl"
      animate={{
        x: ['100%', '0%'],
        y: ['0%', '-100%'],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      🌙
    </motion.div>
  </div>
);

// Progress bar component
const ProgressBar = ({ step }: { step: string }) => {
  const steps = ['home', 'quiz', 'twitter', 'result'];
  const currentIndex = steps.indexOf(step);
  
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
        initial={{ width: '0%' }}
        animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

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
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 relative overflow-hidden">
      <div className="w-full flex-1 flex flex-col items-center justify-center p-4">
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-[5%] left-[10%] animate-float-slow">
            <Image src="/rocket.svg" alt="rocket" width={60} height={60} className="w-8 h-8 sm:w-12 sm:h-12" />
          </div>
          <div className="absolute top-[10%] right-[15%] animate-float">
            <Image src="/diamond.svg" alt="diamond" width={60} height={60} className="w-8 h-8 sm:w-12 sm:h-12" />
          </div>
        </div>

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
              <ResultCard score={score} twitterUsername={twitterUsername} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="absolute bottom-4 right-4 text-[10px] sm:text-xs text-purple-200/50 flex items-center gap-1">
          Powered by 🧠 AI & 💀 Trauma
        </div>
      </div>
    </main>
  );
}
