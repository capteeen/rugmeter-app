'use client';

import { useState } from 'react';
import Quiz from '../components/Quiz';

export default function QuizPage() {
  const [score, setScore] = useState(0);

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    // Handle quiz completion, e.g., redirect to results
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