'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ResultCard from '../components/ResultCard';

function ResultContent() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get('score') || '0', 10);

  return <ResultCard score={score} />;
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading your results...</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
} 