'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onStart: () => void;
}

const ContractSection = () => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("Coming Soon");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-8 bg-black/30 backdrop-blur-md rounded-xl p-4 max-w-lg mx-auto"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
          $RMETER
        </div>
      </div>
      <div className="flex items-center gap-2 bg-black/20 rounded-lg p-3">
        <div className="text-sm truncate flex-1 font-mono text-white/70">Coming Soon</div>
        <button
          onClick={handleCopy}
          className="text-purple-300 hover:text-white transition-colors p-1"
        >
          {copied ? (
            <motion.span
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-green-400 text-lg"
            >
              ✓
            </motion.span>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default function Hero({ onStart }: HeroProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
          RUG METER
        </h1>
        <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-2xl mx-auto">
          Measure your crypto trauma and get your official Degen Rank™️
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-8 py-4 text-xl font-bold rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white shadow-lg transform transition-all hover:shadow-pink-500/25 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 cursor-pointer"
          >
            Start Quiz
          </motion.button>

          <motion.a
            href="/token-analysis"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 text-xl font-bold rounded-lg bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white shadow-lg transform transition-all hover:shadow-purple-500/25 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 cursor-pointer"
          >
            Analyze Token
          </motion.a>
        </div>

        <div className="mt-4">
          <a
            href="https://x.com/rugmeter_sol?s=21&t=ARvJV7n4r1UMTlD-08jo_g"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-300 hover:text-white transition-colors text-sm flex items-center gap-1 justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Follow us
          </a>
        </div>

        <ContractSection />
      </motion.div>
    </div>
  );
} 