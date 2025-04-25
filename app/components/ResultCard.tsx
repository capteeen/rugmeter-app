'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ResultCardProps {
  score: number;
  twitterUsername?: string;
  onBackHome?: () => void;
}

const getDefaultRank = (score: number) => {
  if (score >= 40) return { 
    title: "🧠 Delusional Degen",
    quote: "Your portfolio is 99% down but you're still calling it a 'buying opportunity'",
    traits: ["Buys every dip", "Thinks bottoms are in", "Still believes in NFTs"],
    copingLevel: 95,
    rugResistance: 20,
    hopiumAddiction: 100
  };
  if (score >= 30) return { 
    title: "💀 Rug PTSD Survivor",
    quote: "You've seen more rugs than a carpet store",
    traits: ["Trust issues", "Sells too early", "Paranoid about devs"],
    copingLevel: 60,
    rugResistance: 80,
    hopiumAddiction: 40
  };
  if (score >= 20) return { 
    title: "🚬 Diamond-Handed Masochist",
    quote: "Pain is temporary, losses are forever",
    traits: ["Never sells", "Loves pain", "Stake & forget"],
    copingLevel: 75,
    rugResistance: 50,
    hopiumAddiction: 70
  };
  if (score >= 10) return { 
    title: "👶 Baby Bull – Still Innocent",
    quote: "Sweet summer child, winter is coming",
    traits: ["FOMO buyer", "Believes in roadmaps", "Telegram expert"],
    copingLevel: 30,
    rugResistance: 10,
    hopiumAddiction: 50
  };
  return { 
    title: "🧘 Enlightened Exit Liquidity",
    quote: "You're not gaining money, you're gaining experience",
    traits: ["Buys tops", "Perfect exit timing (for others)", "Chart pattern believer"],
    copingLevel: 40,
    rugResistance: 30,
    hopiumAddiction: 60
  };
};

const CircleProgress = ({ value }: { value: number }) => (
  <svg 
    className="w-full h-full" 
    viewBox="0 0 36 36" 
    style={{ transform: 'rotate(-90deg)' }}
  >
    <path
      d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
      fill="none"
      stroke="rgba(255, 255, 255, 0.1)"
      strokeWidth="3"
    />
    <path
      d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
      fill="none"
      stroke="url(#gradient)"
      strokeWidth="3"
      strokeDasharray={`${value}, 100`}
    />
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="50%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  </svg>
);

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="mb-2 sm:mb-3 w-full">
    <div className="flex justify-between text-[10px] sm:text-sm mb-1">
      <span className="text-purple-200">{label}</span>
      <span className="text-white">{value}%</span>
    </div>
    <div className="h-1.5 sm:h-2 bg-black/20 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${color}`}
        style={{ width: `${value}%`, transition: 'width 1s ease-out' }}
      />
    </div>
  </div>
);

const ResultCard = ({ score, twitterUsername, onBackHome }: ResultCardProps) => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoadingTitle, setIsLoadingTitle] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentRank, setCurrentRank] = useState(getDefaultRank(score));
  const [traits, setTraits] = useState(currentRank.traits || []);

  useEffect(() => {
    const timer = setTimeout(() => setIsCardFlipped(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!twitterUsername) return;
    
    const img = new window.Image();
    img.onload = () => setProfileImageUrl(`https://unavatar.io/twitter/${twitterUsername}`);
    img.src = `https://unavatar.io/twitter/${twitterUsername}`;
  }, [twitterUsername]);

  const getRank = useCallback((score: number) => {
    return getDefaultRank(score);
  }, []);

  useEffect(() => {
    const rank = getRank(score);
    setCurrentRank(rank);
    setTraits(rank.traits || []);
  }, [score, getRank]);

  useEffect(() => {
    const titleKey = `trauma-title-${score}-${twitterUsername || ''}`;
    const cachedTitle = sessionStorage.getItem(titleKey);

    const generateTitle = async () => {
      if (cachedTitle) {
        setIsLoadingTitle(false);
        return;
      }

      try {
        const response = await fetch('/api/generate-title', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            score: score,
            traits: currentRank.traits,
            username: twitterUsername
          }),
        });

        if (!response.ok) throw new Error('Failed to generate title');

        const data = await response.json();
        if (data.title) {
          sessionStorage.setItem(titleKey, data.title);
        }
      } catch (error) {
        console.error('Error generating title:', error);
      } finally {
        setIsLoadingTitle(false);
      }
    };

    generateTitle();
  }, [score, currentRank.traits, twitterUsername]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div 
        ref={cardRef}
        className="w-full max-w-md mx-auto [perspective:1000px]"
      >
        <div
          className={`relative transition-all duration-700 [transform-style:preserve-3d] ${
            isCardFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* Card Front */}
          <div 
            className="w-full bg-black/30 backdrop-blur-md rounded-2xl p-6 [backface-visibility:hidden]"
          >
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-4xl animate-bounce text-white">
                🎲
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div 
            className="absolute top-0 left-0 w-full bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            {/* Card Header with Twitter Profile */}
            {twitterUsername && !imageError && (
              <div className="flex items-center mb-4 bg-black/20 p-2 sm:p-3 rounded-lg">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-black/20">
                  {profileImageUrl ? (
                    <Image
                      src={profileImageUrl}
                      alt={`@${twitterUsername}'s profile`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <Image
                      src={`https://unavatar.io/twitter/${twitterUsername}`}
                      alt={`@${twitterUsername}'s profile`}
                      width={48}
                      height={48}
                      className="object-cover"
                      onError={() => setImageError(true)}
                      priority
                    />
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-sm sm:text-base text-white font-medium">@{twitterUsername}</div>
                  <div className="text-xs sm:text-sm text-purple-300">Certified Degen</div>
                </div>
              </div>
            )}

            {/* Rank Title */}
            <div className="text-center mb-4">
              {isLoadingTitle ? (
                <div className="h-8 sm:h-9 w-48 mx-auto bg-white/10 animate-pulse rounded"></div>
              ) : (
                <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
                  {currentRank.title}
                </h2>
              )}
            </div>

            {/* Trauma Score Circle */}
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                <CircleProgress value={score} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">{score}%</span>
                  <span className="text-[10px] sm:text-xs text-purple-300">TRAUMA</span>
                </div>
              </div>
            </div>

            {/* Degen Traits */}
            <div className="mb-4">
              <div className="text-purple-200 text-xs sm:text-sm mb-2">DEGEN TRAITS:</div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {traits.map((trait, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/10 rounded-full text-[10px] sm:text-xs text-white"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Bars */}
            <div className="mb-4">
              <StatBar 
                label="Coping Level" 
                value={currentRank.copingLevel} 
                color="bg-gradient-to-r from-green-500 to-emerald-500"
              />
              <StatBar 
                label="Rug Resistance" 
                value={currentRank.rugResistance} 
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
              />
              <StatBar 
                label="Hopium Addiction" 
                value={currentRank.hopiumAddiction} 
                color="bg-gradient-to-r from-pink-500 to-rose-500"
              />
            </div>

            {/* Quote */}
            <div className="text-purple-200 text-center text-xs sm:text-sm mb-4 italic">
              &ldquo;{currentRank.quote}&rdquo;
            </div>

            {/* Share Info */}
            <div className="mt-auto">
              <div className="text-center text-purple-300/50 text-[10px] sm:text-xs">
                Take a screenshot and share your results on X (Twitter) 🎯
              </div>
              <div className="text-center text-purple-300/50 text-[10px] sm:text-xs mt-1">
                rugmeter.app
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={onBackHome}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard; 