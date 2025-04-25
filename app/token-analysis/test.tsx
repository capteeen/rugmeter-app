'use client';

import { useEffect, useState } from 'react';

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

interface ApiResponse {
  tokenData: TokenData;
  analysis: AnalysisResult;
}

interface TestProps {
  data: {
    name: string;
    value: string | number;
  };
}

export default function Test({ data }: TestProps) {
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.value}</p>
    </div>
  );
}

export function TokenAnalysisTest() {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        const testAddress = '6zBBFyHtSmBAfayad3FeUNtsBbGq1eaxyucFoARqpump';
        const url = `/api/token-analysis?address=${encodeURIComponent(testAddress)}`;
        
        console.log('Testing API with URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const text = await response.text();
        console.log('Raw response:', text.substring(0, 500));
        
        try {
          const data = JSON.parse(text);
          setResult(data);
        } catch (e) {
          console.error('Failed to parse response:', e);
          setError(`Parse error: ${e instanceof Error ? e.message : String(e)}`);
        }
      } catch (e) {
        console.error('API test error:', e);
        setError(`Fetch error: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setLoading(false);
      }
    };
    
    testApi();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
          <h3 className="text-lg font-semibold text-red-300 mb-2">Error</h3>
          <p className="text-red-200">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <h3 className="text-lg font-semibold text-green-300 mb-2">Success</h3>
          <pre className="bg-black/30 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-4">
        <a href="/token-analysis" className="text-blue-400 hover:underline">
          Back to Token Analysis
        </a>
      </div>
    </div>
  );
} 