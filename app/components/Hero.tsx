'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EMOJIS = ['💎', '🚀', '💀', '🔥', '🌙', '💰', '🎰'];

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 p-4 relative overflow-hidden">
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