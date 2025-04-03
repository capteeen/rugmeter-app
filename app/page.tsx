'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Quiz from './components/Quiz';
import ResultCard from './components/ResultCard';
import TwitterInput from './components/TwitterInput';

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
  const steps = ['hero', 'twitter', 'quiz', 'result'];
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

// Stats counter
const StatsCounter = () => {
  const [degens, setDegens] = useState(42069);
  const [rugs, setRugs] = useState(1337);

  useEffect(() => {
    const interval = setInterval(() => {
      setDegens(prev => prev + Math.floor(Math.random() * 3));
      setRugs(prev => prev + Math.floor(Math.random() * 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 bg-black/30 backdrop-blur-md rounded-lg p-3 text-xs text-white/70">
      <div>🤡 {degens.toLocaleString()} Degens Traumatized</div>
      <div>🏃 {rugs.toLocaleString()} Rugs Pulled</div>
    </div>
  );
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'hero' | 'twitter' | 'quiz' | 'result'>('hero');
  const [score, setScore] = useState(0);
  const [twitterUsername, setTwitterUsername] = useState('');

  const handleStartQuiz = () => {
    setCurrentStep('twitter');
  };

  const handleTwitterSubmit = (username: string) => {
    setTwitterUsername(username);
    setCurrentStep('quiz');
  };

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    setCurrentStep('result');
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800">
      {/* Background elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black/50 to-black/80" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-20" />
      
      {/* Meme elements */}
      <MemeElements />
      
      {/* Progress bar */}
      <ProgressBar step={currentStep} />
      
      {/* Stats counter */}
      <StatsCounter />

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 'hero' && (
            <div onClick={handleStartQuiz} className="cursor-pointer">
              <Hero />
            </div>
          )}
          
          {currentStep === 'twitter' && (
            <TwitterInput onSubmit={handleTwitterSubmit} />
          )}
          
          {currentStep === 'quiz' && (
            <Quiz onComplete={handleQuizComplete} />
          )}
          
          {currentStep === 'result' && (
            <ResultCard score={score} twitterUsername={twitterUsername} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="fixed bottom-4 right-4 text-white/30 text-xs">
        Powered by 🧠 AI & 💀 Trauma
      </div>
    </main>
  );
}
