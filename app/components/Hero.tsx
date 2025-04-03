'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EMOJIS = ['💎', '🚀', '💀', '🔥', '🌙', '💰', '🎰'];

// Token info section
const TokenSection = () => {
  const [copied, setCopied] = useState(false);
  const contractAddress = "0x420691C8D33bF4B7B9c66842d5550kadl2d0E069";
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
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
      className="mt-12 bg-black/30 backdrop-blur-md rounded-xl p-4 max-w-lg mx-auto"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
          $RMETER
        </div>
      </div>
      <div className="flex items-center gap-2 bg-black/20 rounded-lg p-3">
        <div className="text-sm truncate flex-1 font-mono text-white/70">{contractAddress}</div>
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

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-pulse">
          RUG METER
        </h1>
        <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-2xl mx-auto">
          Measure your crypto trauma and get your official Degen Rank™️. Are you a Diamond-Handed Masochist or just Exit Liquidity? 🎰
        </p>
        
        <motion.button
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className={`
            px-8 py-4 text-xl font-bold rounded-lg
            bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500
            text-white shadow-lg transform transition-all
            hover:shadow-pink-500/25 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600
            cursor-pointer
            ${isHovered ? 'animate-glitch' : ''}
          `}
        >
          CHECK YOUR TRAUMA 💀
        </motion.button>

        <div className="mt-8 text-purple-300 text-sm">
          *No financial advice, just pure emotional damage
        </div>

        {/* Token Info Section */}
        <TokenSection />
      </motion.div>

      {/* Floating emojis background */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {EMOJIS.map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              initial={{ 
                x: `${(i + 1) * 10}%`,
                y: `${(i + 1) * 12}%`
              }}
              animate={{
                x: [`${(i + 1) * 10}%`, `${(i + 1) * 10 + 5}%`, `${(i + 1) * 10}%`],
                y: [`${(i + 1) * 12}%`, `${(i + 1) * 12 - 10}%`, `${(i + 1) * 12}%`],
                rotate: [0, 360],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 