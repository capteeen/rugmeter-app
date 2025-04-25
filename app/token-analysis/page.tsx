'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface TokenData {
  address: string;
  liquidity: number;
  fdv: number;
  volume24h: number;
  netVolume24h: number;
  buyers24h: number;
  sellers24h: number;
  totalTraders24h: number;
  buyVolume: {
    '5m': string;
    '1h': number;
    '6h': number;
    '24h': number;
  };
  sellVolume: {
    '5m': number;
    '1h': number;
    '6h': number;
    '24h': number;
  };
  totalBuys: {
    '5m': string;
    '1h': number;
    '6h': number;
    '24h': number;
  };
  totalSells: {
    '5m': number;
    '1h': number;
    '6h': number;
    '24h': number;
  };
}

interface AnalysisResult {
  trendAnalysis: {
    direction: string;
    trendStrength: string;
    rsi: string;
    macd: string;
  };
  marketStructure: {
    liquidityRating: string;
    marketEfficiency: string;
    volatilityScore: string;
    betaToSol: string;
  };
  volumeAnalysis: {
    buyPressure: string;
    sellPressure: string;
    volumeProfile: string;
  };
  riskMetrics: {
    sharpeRatio: string;
    maxDrawdown: string;
    volatility: string;
  };
  overallScore: string;
  summary: string;
}

export default function TokenAnalysis() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const truncateAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTokenData(null);
    setAnalysis(null);

    try {
      console.log('Starting token analysis for address:', tokenAddress);
      const response = await fetch(`/api/token-analysis?address=${encodeURIComponent(tokenAddress)}`);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch token data');
      }

      if (!data.tokenData || !data.analysis) {
        throw new Error('Invalid response format');
      }

      setTokenData(data.tokenData);
      setAnalysis(data.analysis);
    } catch (err) {
      console.error('Error in token analysis:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{
      backgroundImage: `url('/ChatGPT Image Apr 25, 2025 at 04_14_03 PM.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-pink-800/80" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto bg-black/30 backdrop-blur-md rounded-2xl p-6 shadow-2xl relative z-10"
      >
        <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-center">
          Token Analysis
        </h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="Enter token contract address"
              className="w-full px-4 py-3 bg-black/20 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Token'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <h3 className="text-lg font-semibold text-red-300 mb-2">Error</h3>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {tokenData && analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-black/20 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Token Metrics</h3>
                <div className="space-y-2">
                  <p className="text-white">
                    <span className="text-purple-300">Address:</span>{" "}
                    <span className="font-mono">{truncateAddress(tokenData.address)}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(tokenData.address)}
                      className="ml-2 text-xs text-purple-300 hover:text-purple-200 transition-colors"
                      title="Copy full address"
                    >
                      📋
                    </button>
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">Liquidity:</span> ${tokenData.liquidity.toLocaleString()}
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">FDV:</span> ${tokenData.fdv.toLocaleString()}
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">24h Volume:</span> ${tokenData.volume24h.toLocaleString()}
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">Net Volume (24h):</span> ${tokenData.netVolume24h.toLocaleString()}
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">Unique Traders (24h):</span> {tokenData.totalTraders24h.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-black/20 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Trend Analysis</h3>
                <div className="space-y-2">
                  <p className="text-white">
                    <span className="text-purple-300">Direction:</span>{" "}
                    <span className={analysis.trendAnalysis.direction === "BULLISH" ? "text-green-400" : analysis.trendAnalysis.direction === "BEARISH" ? "text-red-400" : "text-yellow-400"}>
                      {analysis.trendAnalysis.direction}
                    </span>
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">Trend Strength:</span> {analysis.trendAnalysis.trendStrength}
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">RSI:</span> {analysis.trendAnalysis.rsi}
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">MACD:</span> {analysis.trendAnalysis.macd}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-black/20 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Market Structure</h3>
                <div className="space-y-2">
                  <p className="text-white">
                    <span className="text-purple-300">Liquidity Rating:</span> {analysis.marketStructure.liquidityRating}
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">Market Efficiency:</span> {analysis.marketStructure.marketEfficiency}
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">Volatility Score:</span> {analysis.marketStructure.volatilityScore}
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">Beta to SOL:</span> {analysis.marketStructure.betaToSol}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-black/20 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Volume Analysis</h3>
                <div className="space-y-2">
                  <p className="text-white">
                    <span className="text-purple-300">Buy Pressure:</span> {analysis.volumeAnalysis.buyPressure}
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">Sell Pressure:</span> {analysis.volumeAnalysis.sellPressure}
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">Volume Profile:</span> {analysis.volumeAnalysis.volumeProfile}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-black/20 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Risk Metrics</h3>
                <div className="space-y-2">
                  <p className="text-white">
                    <span className="text-purple-300">Sharpe Ratio:</span> {analysis.riskMetrics.sharpeRatio}
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">Max Drawdown:</span> {analysis.riskMetrics.maxDrawdown}
                  </p>
                  <p className="text-white">
                    <span className="text-purple-300">Volatility:</span> {analysis.riskMetrics.volatility}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-black/20 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Overall Score</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
                    {analysis.overallScore}/100
                  </span>
                  <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
                      style={{ width: `${analysis.overallScore}%` }}
                    />
                  </div>
                </div>
                <p className="mt-4 text-white/80 italic">{analysis.summary}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 