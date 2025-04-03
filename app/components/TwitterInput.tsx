'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface TwitterInputProps {
  onSubmit: (username: string) => void;
}

export default function TwitterInput({ onSubmit }: TwitterInputProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(username.trim());
    } catch {
      setError('Failed to validate username');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 mb-2">
          Add Your Twitter
        </h2>
        <p className="text-purple-200 mb-6">
          Let&apos;s make your trauma card more personal 🎭
        </p>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-purple-300/70 text-lg">@</span>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-9 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl 
                       text-white text-lg placeholder-purple-300/30 focus:outline-none focus:border-purple-500/50
                       transition-colors"
              placeholder="username"
            />
          </div>

          {error && (
            <div className="mt-2 text-pink-500 text-sm">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500
                     text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Checking..." : "Continue"}
          </motion.button>
        </form>

        <button
          onClick={() => onSubmit('')}
          className="w-full mt-4 text-purple-300 text-sm hover:text-white transition-colors"
        >
          Skip for now
        </button>

        <div className="mt-6 text-xs text-center text-purple-300/50">
          *We&apos;ll use this to display your profile picture on your trauma card
        </div>
      </motion.div>
    </div>
  );
} 