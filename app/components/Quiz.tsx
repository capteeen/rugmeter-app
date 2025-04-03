'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Quiz questions data
const questions = [
  {
    id: 1,
    question: "Your favorite token just dumped 80% in a day. What's your move?",
    options: [
      { text: "Buy more, it's just a dip! 🤑", score: 8 },
      { text: "Panic sell everything 😱", score: 5 },
      { text: "Stare at the chart frozen 😶", score: 3 },
      { text: "What dump? I never check prices 👶", score: 1 }
    ]
  },
  {
    id: 2,
    question: "How many rugs have you 'believed in'?",
    options: [
      { text: "Lost count after 10+ 💀", score: 10 },
      { text: "3-5 rugs (I'm learning!) 🎓", score: 7 },
      { text: "Just 1 (never again!) 😤", score: 4 },
      { text: "I DYOR everything 🧐", score: 1 }
    ]
  },
  {
    id: 3,
    question: "Do you still believe in utility?",
    options: [
      { text: "Utility is dead, only memes matter 🐸", score: 8 },
      { text: "Yes! My NFTs will moon any day now 🚀", score: 10 },
      { text: "I'm here for the tech 🤓", score: 3 },
      { text: "What's utility? 🤔", score: 5 }
    ]
  },
  {
    id: 4,
    question: "Your portfolio is down 90%. What's your move?",
    options: [
      { text: "Double down, can't go lower 📉", score: 9 },
      { text: "Stake it and forget it 🥩", score: 6 },
      { text: "Call it a tax write-off 📝", score: 7 },
      { text: "What portfolio? 👻", score: 4 }
    ]
  },
  {
    id: 5,
    question: "How do you cope with market crashes?",
    options: [
      { text: "That's my secret - I'm always coping 🤡", score: 10 },
      { text: "Crypto Twitter hopium 🐦", score: 8 },
      { text: "Touch grass and meditate 🧘‍♂️", score: 3 },
      { text: "Delete all apps and hibernate 🐻", score: 6 }
    ]
  }
];

interface QuizProps {
  onComplete: (score: number) => void;
}

export default function Quiz({ onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (answerScore: number) => {
    const newScore = score + answerScore;
    
    if (currentQuestion < questions.length - 1) {
      setScore(newScore);
      setCurrentQuestion(prev => prev + 1);
    } else {
      onComplete(newScore);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl w-full bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl"
        >
          <div className="mb-8">
            <div className="text-purple-300 mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {questions[currentQuestion].question}
            </h2>
          </div>

          <div className="grid gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option.score)}
                className="w-full text-left p-4 rounded-lg bg-white/10 hover:bg-white/20 
                         transition-colors duration-200 text-white border border-white/10"
              >
                {option.text}
              </motion.button>
            ))}
          </div>

          <div className="mt-8 text-center text-purple-300 text-sm">
            *Your trauma score is being calculated... 💀
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 