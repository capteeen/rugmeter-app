'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface TwitterInputProps {
  onSubmit: (username: string) => void;
}

export default function TwitterInput({ onSubmit }: TwitterInputProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!username) {
      setError('Please enter your Twitter username');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Remove @ if user included it
      const cleanUsername = username.replace('@', '');
      onSubmit(cleanUsername);
    } catch (err) {
      setError('Failed to fetch Twitter profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onSubmit('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            Add Your Twitter
          </h2>
          <p className="text-purple-200 mt-2">
            Let's make your trauma card more personal 🎭
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@username"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white placeholder-purple-300 focus:outline-none focus:ring-2 
                       focus:ring-purple-500 focus:border-transparent"
            />
            {error && (
              <p className="text-pink-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 
                     text-white rounded-lg font-semibold shadow-lg hover:shadow-pink-500/25
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Continue 🚀'}
          </motion.button>

          <button
            onClick={handleSkip}
            className="w-full text-purple-300 text-sm hover:text-white transition-colors"
          >
            Skip for now
          </button>
        </div>

        <div className="mt-8 text-center text-purple-300 text-xs">
          *We'll use this to display your profile picture on your trauma card
        </div>
      </motion.div>
    </div>
  );
} 