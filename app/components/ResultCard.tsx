'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import * as htmlToImage from 'html-to-image';

interface ResultCardProps {
  score: number;
  twitterUsername?: string;
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
    quote: "You're not losing money, you're gaining experience",
    traits: ["Buys tops", "Perfect exit timing (for others)", "Chart pattern believer"],
    copingLevel: 40,
    rugResistance: 30,
    hopiumAddiction: 60
  };
};

const generateTraumaPercentage = (score: number) => {
  // Convert score to a percentage (max score possible is 50)
  return Math.min(Math.round((score / 50) * 100), 100);
};

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="mb-2">
    <div className="flex justify-between text-sm mb-1">
      <span className="text-purple-200">{label}</span>
      <span className="text-white">{value}%</span>
    </div>
    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${color}`}
        style={{ width: `${value}%`, transition: 'width 1s ease-out' }}
      />
    </div>
  </div>
);

export default function ResultCard({ score, twitterUsername }: ResultCardProps) {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [aiTitle, setAiTitle] = useState<string>('');
  const [isLoadingTitle, setIsLoadingTitle] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const defaultRank = getDefaultRank(score);
  const rank = {
    ...defaultRank,
    title: aiTitle || defaultRank.title
  };
  const traumaPercentage = generateTraumaPercentage(score);

  useEffect(() => {
    const timer = setTimeout(() => setIsCardFlipped(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Generate title only once when component mounts
  useEffect(() => {
    const titleKey = `trauma-title-${twitterUsername}-${score}`;
    const cachedTitle = sessionStorage.getItem(titleKey);

    const generateTitle = async () => {
      if (cachedTitle) {
        setAiTitle(cachedTitle);
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
            score: traumaPercentage,
            traits: defaultRank.traits,
            username: twitterUsername
          }),
        });

        if (!response.ok) throw new Error('Failed to generate title');

        const data = await response.json();
        if (data.title) {
          setAiTitle(data.title);
          sessionStorage.setItem(titleKey, data.title);
        }
      } catch (error) {
        console.error('Error generating title:', error);
        // Fallback to default title if AI generation fails
      } finally {
        setIsLoadingTitle(false);
      }
    };

    generateTitle();
  }, [twitterUsername, score]); // Only regenerate if username or score changes

  const generateImage = async () => {
    const cardBack = cardRef.current?.querySelector('.card-back') as HTMLDivElement;
    if (!cardBack || !isCardFlipped) return null;
    
    try {
      setIsGeneratingImage(true);
      
      // Temporarily modify styles for capture
      const originalTransform = cardBack.style.transform;
      const originalRotation = cardBack.style.rotate;
      cardBack.style.transform = 'none';
      cardBack.style.rotate = '0deg';

      // Add background temporarily for capture
      cardBack.style.background = 'linear-gradient(to bottom right, rgb(88, 28, 135), rgb(30, 27, 75), rgb(134, 25, 143))';

      const dataUrl = await htmlToImage.toPng(cardBack, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#1e1b4b',
        style: {
          transform: 'none',
          rotate: '0deg'
        }
      });

      // Restore original styles
      cardBack.style.transform = originalTransform;
      cardBack.style.rotate = originalRotation;
      cardBack.style.background = '';

      return dataUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleTwitterShare = async () => {
    const imageUrl = await generateImage();
    
    if (!imageUrl) {
      alert('Failed to generate image. Please try again.');
      return;
    }

    const text = `I got ${rank.title} with ${traumaPercentage}% Crypto Trauma.\n${rank.quote}\n\nCheck your trauma score at rugmeter.app 👉`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleDownload = async () => {
    const imageUrl = await generateImage();
    
    if (!imageUrl) {
      alert('Failed to generate image. Please try again.');
      return;
    }

    const link = document.createElement('a');
    link.download = 'crypto-trauma-card.png';
    link.href = imageUrl;
    link.click();
  };

  const CardContent = () => {
    const [profileImageUrl, setProfileImageUrl] = useState<string>('');

    useEffect(() => {
      if (twitterUsername) {
        // Preload the image URL
        const img = new window.Image();
        img.onload = () => setProfileImageUrl(`https://unavatar.io/twitter/${twitterUsername}`);
        img.src = `https://unavatar.io/twitter/${twitterUsername}`;
      }
    }, [twitterUsername]);

    return (
      <div className="w-full h-full bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex flex-col">
        {/* Card Header with Twitter Profile */}
        {twitterUsername && !imageError && (
          <div className="flex items-center mb-4 bg-black/20 p-3 rounded-lg">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-black/20">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={`@${twitterUsername}'s profile`}
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
              <div className="text-white font-medium">@{twitterUsername}</div>
              <div className="text-purple-300 text-sm">Certified Degen</div>
            </div>
          </div>
        )}

        {/* Rank Title */}
        <div className="text-center mb-4">
          {isLoadingTitle ? (
            <div className="h-9 w-48 mx-auto bg-white/10 animate-pulse rounded"></div>
          ) : (
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
              {rank.title}
            </h2>
          )}
        </div>

        {/* Trauma Score Circle */}
        <div className="flex justify-center mb-4">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
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
                strokeDasharray={`${traumaPercentage}, 100`}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{traumaPercentage}%</span>
              <span className="text-xs text-purple-300">TRAUMA</span>
            </div>
          </div>
        </div>

        {/* Degen Traits */}
        <div className="mb-4">
          <div className="text-purple-200 text-sm mb-2">DEGEN TRAITS:</div>
          <div className="flex flex-wrap gap-2">
            {rank.traits.map((trait, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 rounded-full text-xs text-white"
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
            value={rank.copingLevel} 
            color="bg-gradient-to-r from-green-500 to-emerald-500"
          />
          <StatBar 
            label="Rug Resistance" 
            value={rank.rugResistance} 
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
          />
          <StatBar 
            label="Hopium Addiction" 
            value={rank.hopiumAddiction} 
            color="bg-gradient-to-r from-pink-500 to-rose-500"
          />
        </div>

        {/* Quote */}
        <div className="text-purple-200 text-center text-sm mb-4 italic">
          "{rank.quote}"
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTwitterShare}
            disabled={isGeneratingImage}
            className="w-full py-3 px-4 bg-[#1DA1F2] hover:bg-[#1a8cd8]
                     text-white rounded-lg font-semibold shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {isGeneratingImage ? (
              'Generating Image...'
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Share on Twitter
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            disabled={isGeneratingImage}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 
                     text-white rounded-lg font-semibold shadow-lg hover:shadow-pink-500/25
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {isGeneratingImage ? (
              'Generating Image...'
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download Card
              </>
            )}
          </motion.button>
        </div>

        {/* Watermark */}
        <div className="mt-2 text-center text-purple-300/50 text-xs">
          rugmeter.app
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 p-4">
      <motion.div
        ref={cardRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="perspective"
      >
        <motion.div
          animate={{ rotateY: isCardFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative w-[320px] sm:w-[400px] aspect-[3/4] preserve-3d"
        >
          {/* Front of card */}
          <div className="absolute inset-0 backface-hidden card-front">
            <div className="w-full h-full bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center">
              <div className="text-white text-2xl">Calculating your trauma... 💭</div>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 card-back bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800">
            <CardContent />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 