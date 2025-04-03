'use client';

import { useSearchParams } from 'next/navigation';
import ResultCard from '../components/ResultCard';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get('score') || '0', 10);

  return (
    <ResultCard score={score} />
  );
} 