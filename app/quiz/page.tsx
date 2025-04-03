'use client';

import { useState } from 'react';
import Quiz from '../components/Quiz';

interface QuizPageProps {
  onComplete?: (score: number) => void;
}

export default function QuizPage({ onComplete }: QuizPageProps) {
  const [score, setScore] = useState(0);

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    onComplete?.(finalScore);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800">
      <Quiz onComplete={handleQuizComplete} />
      {score > 0 && (
        <div className="text-center text-white mt-4">
          Your current score: {score}%
        </div>
      )}
    </div>
  );
} 