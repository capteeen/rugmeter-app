'use client';

import { useState } from 'react';
import Quiz from '../components/Quiz';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
  const router = useRouter();
  const [score, setScore] = useState(0);

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    // Navigate to result page with the score
    router.push(`/result?score=${finalScore}`);
  };

  return (
    <Quiz onComplete={handleQuizComplete} />
  );
} 