'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 p-4 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-[5%] left-[10%] animate-float-slow">
          <Image src="/rocket.svg" alt="rocket" width={60} height={60} className="w-8 h-8 sm:w-12 sm:h-12" />
        </div>
        <div className="absolute top-[10%] right-[15%] animate-float">
          <Image src="/diamond.svg" alt="diamond" width={60} height={60} className="w-8 h-8 sm:w-12 sm:h-12" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl w-full text-center px-4 sm:px-6">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 mb-4 sm:mb-6">
          RUG METER
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
          Measure your crypto trauma and get your official Degen Rank™. Are you a Diamond-Handed Masochist or just Exit Liquidity? 🎰
        </p>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/quiz'}
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-semibold 
                   px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-xl
                   shadow-lg hover:shadow-pink-500/25 transition-shadow"
        >
          CHECK YOUR TRAUMA 💀
        </motion.button>

        {/* Disclaimer */}
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-purple-200/70">
          *No financial advice, just pure emotional damage
        </p>

        {/* Token Info */}
        <div className="mt-12 sm:mt-16 w-full max-w-md mx-auto bg-black/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="text-pink-500 text-base sm:text-lg font-medium mb-2 sm:mb-3">
            $RMETER
          </div>
          <div className="flex items-center justify-between bg-black/30 rounded-lg p-2 sm:p-3">
            <div className="text-[10px] sm:text-xs font-mono text-purple-200 truncate pr-2">
              0x420691C8D33bF4B7B9c66842d5550kad12d0E069
            </div>
            <button className="text-purple-200 hover:text-white p-1.5 rounded-md transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 right-4 text-[10px] sm:text-xs text-purple-200/50 flex items-center gap-1">
        Powered by 🧠 AI & 💀 Trauma
      </div>
    </main>
  );
}
