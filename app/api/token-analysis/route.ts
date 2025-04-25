import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with error handling
let openai: OpenAI | null = null;
try {
  console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

// Common headers for all responses
const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Make sure we're exporting using the proper Next.js 13+ API route handlers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    console.log('Starting token analysis for address:', address);

    if (!address) {
      return NextResponse.json(
        { error: 'Token address is required' },
        { status: 400, headers: jsonHeaders }
      );
    }

    if (!process.env.MORALIS_API_KEY) {
      return NextResponse.json(
        { error: 'Moralis API key is not configured' },
        { status: 500, headers: jsonHeaders }
      );
    }

    // Fetch token data from Moralis
    const moralisUrl = `https://deep-index.moralis.io/api/v2.2/tokens/${address}/analytics?chain=solana`;
    console.log('Fetching from Moralis:', moralisUrl);

    let moralisResponse;
    try {
      moralisResponse = await fetch(moralisUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'X-API-Key': process.env.MORALIS_API_KEY,
        },
      });
    } catch (error) {
      console.error('Failed to fetch from Moralis:', error);
      return NextResponse.json(
        { error: 'Failed to connect to Moralis API' },
        { status: 500, headers: jsonHeaders }
      );
    }

    if (!moralisResponse.ok) {
      const errorText = await moralisResponse.text();
      console.error('Moralis API error:', errorText);
      return NextResponse.json(
        { 
          error: 'Moralis API error',
          details: errorText.substring(0, 200)
        },
        { status: moralisResponse.status, headers: jsonHeaders }
      );
    }

    // Parse Moralis response
    let tokenData;
    try {
      tokenData = await moralisResponse.json();
    } catch (error) {
      console.error('Failed to parse Moralis response:', error);
      return NextResponse.json(
        { error: 'Invalid response from Moralis API' },
        { status: 500, headers: jsonHeaders }
      );
    }

    // If OpenAI is not configured, return basic response
    if (!openai) {
      console.error('OpenAI client not initialized');
      return NextResponse.json({
        tokenData: {
          address: tokenData.tokenAddress,
          liquidity: parseFloat(tokenData.totalLiquidityUsd || '0'),
          fdv: parseFloat(tokenData.totalFullyDilutedValuation || '0'),
          volume24h: parseFloat(tokenData.totalVolume?.['24h'] || '0'),
          netVolume24h: parseFloat(tokenData.netVolume?.['24h'] || '0'),
          buyers24h: parseInt(tokenData.totalBuyers?.['24h'] || '0'),
          sellers24h: parseInt(tokenData.totalSellers?.['24h'] || '0'),
          totalTraders24h: parseInt(tokenData.totalTraders?.['24h'] || '0'),
          buyVolume: tokenData.totalBuyVolume || {},
          sellVolume: tokenData.totalSellVolume || {},
          totalBuys: tokenData.totalBuys || {},
          totalSells: tokenData.totalSells || {},
        },
        analysis: {
          trendAnalysis: {
            direction: "NEUTRAL",
            trendStrength: "50%",
            rsi: "50",
            macd: "0"
          },
          marketStructure: {
            liquidityRating: "50",
            marketEfficiency: "50%",
            volatilityScore: "50",
            betaToSol: "1.0"
          },
          volumeAnalysis: {
            buyPressure: "50%",
            sellPressure: "50%",
            volumeProfile: "Neutral"
          },
          riskMetrics: {
            sharpeRatio: "0",
            maxDrawdown: "0%",
            volatility: "50%"
          },
          overallScore: "50",
          summary: "AI analysis is currently unavailable. Please check OpenAI API configuration."
        }
      }, { headers: jsonHeaders });
    }

    try {
      // Calculate metrics for OpenAI analysis
      const liquidity = parseFloat(tokenData.totalLiquidityUsd || '0');
      const fdv = parseFloat(tokenData.totalFullyDilutedValuation || '0');
      const buyVolume24h = parseFloat(tokenData.totalBuyVolume?.['24h'] || '0');
      const sellVolume24h = parseFloat(tokenData.totalSellVolume?.['24h'] || '0');
      const totalVolume24h = buyVolume24h + sellVolume24h;
      const netVolume24h = buyVolume24h - sellVolume24h;
      const buyers24h = parseInt(tokenData.totalBuyers?.['24h'] || '0');
      const sellers24h = parseInt(tokenData.totalSellers?.['24h'] || '0');
      const totalTraders24h = buyers24h + sellers24h;

      // Prepare analysis prompt
      const analysisPrompt = `
        Perform an advanced technical analysis of this Solana token based on the following data:

        Token Metrics:
        - Token Address: ${tokenData.tokenAddress}
        - 24h Trading Volume: $${totalVolume24h.toLocaleString()}
        - Net Volume (Buys - Sells): $${netVolume24h.toLocaleString()}
        - Liquidity: $${liquidity.toLocaleString()}
        - Fully Diluted Valuation: $${fdv.toLocaleString()}
        - Unique Buyers (24h): ${buyers24h}
        - Unique Sellers (24h): ${sellers24h}
        - Total Unique Traders (24h): ${totalTraders24h}
        
        Trading Activity:
        - 5m Buy Volume: $${tokenData.totalBuyVolume?.['5m'] || '0'}
        - 5m Sell Volume: $${tokenData.totalSellVolume?.['5m'] || '0'}
        - 1h Buy Volume: $${tokenData.totalBuyVolume?.['1h'] || '0'}
        - 1h Sell Volume: $${tokenData.totalSellVolume?.['1h'] || '0'}
        - 6h Buy Volume: $${tokenData.totalBuyVolume?.['6h'] || '0'}
        - 6h Sell Volume: $${tokenData.totalSellVolume?.['6h'] || '0'}
        
        Please provide a comprehensive technical analysis including:

        1. Trend Analysis:
           - Direction (BULLISH/BEARISH/NEUTRAL)
           - Trend Strength (0-100%)
           - RSI (Relative Strength Index)
           - MACD (Moving Average Convergence Divergence)
        
        2. Market Structure:
           - Liquidity Rating (0-100)
           - Market Efficiency (0-100%)
           - Volatility Score (0-100)
           - Beta to SOL
        
        3. Volume Analysis:
           - Buy Pressure (0-100%)
           - Sell Pressure (0-100%)
           - Volume Profile (Accumulation/Distribution/Neutral)
        
        4. Risk Metrics:
           - Sharpe Ratio
           - Max Drawdown
           - Volatility (0-100%)
        
        Format your response as a JSON object with the following structure:
        {
          "trendAnalysis": {
            "direction": "BULLISH/BEARISH/NEUTRAL",
            "trendStrength": "0-100%",
            "rsi": "0-100",
            "macd": "number"
          },
          "marketStructure": {
            "liquidityRating": "0-100",
            "marketEfficiency": "0-100%",
            "volatilityScore": "0-100",
            "betaToSol": "number"
          },
          "volumeAnalysis": {
            "buyPressure": "0-100%",
            "sellPressure": "0-100%",
            "volumeProfile": "Accumulation/Distribution/Neutral"
          },
          "riskMetrics": {
            "sharpeRatio": "number",
            "maxDrawdown": "0-100%",
            "volatility": "0-100%"
          },
          "overallScore": "0-100",
          "summary": "Brief analysis summary"
        }
      `;

      // Get OpenAI analysis
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an advanced crypto technical analyst specializing in Solana tokens. Provide detailed technical analysis based on the provided data. Use realistic values for technical indicators based on the trading data provided."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" }
      });

      console.log('OpenAI response:', completion.choices[0].message.content);
      
      const analysisText = completion.choices[0].message.content;
      if (!analysisText) {
        throw new Error('Empty response from OpenAI');
      }

      let analysisData;
      try {
        analysisData = JSON.parse(analysisText);
      } catch (error) {
        console.error('Failed to parse OpenAI response:', error);
        throw new Error('Invalid JSON response from OpenAI');
      }

      return NextResponse.json({
        tokenData: {
          address: tokenData.tokenAddress,
          liquidity: parseFloat(tokenData.totalLiquidityUsd || '0'),
          fdv: parseFloat(tokenData.totalFullyDilutedValuation || '0'),
          volume24h: totalVolume24h,
          netVolume24h: netVolume24h,
          buyers24h: buyers24h,
          sellers24h: sellers24h,
          totalTraders24h: totalTraders24h,
          buyVolume: tokenData.totalBuyVolume || {},
          sellVolume: tokenData.totalSellVolume || {},
          totalBuys: tokenData.totalBuys || {},
          totalSells: tokenData.totalSells || {},
        },
        analysis: analysisData
      }, { headers: jsonHeaders });
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      return NextResponse.json({
        tokenData: {
          address: tokenData.tokenAddress,
          liquidity: parseFloat(tokenData.totalLiquidityUsd || '0'),
          fdv: parseFloat(tokenData.totalFullyDilutedValuation || '0'),
          volume24h: parseFloat(tokenData.totalVolume?.['24h'] || '0'),
          netVolume24h: parseFloat(tokenData.netVolume?.['24h'] || '0'),
          buyers24h: parseInt(tokenData.totalBuyers?.['24h'] || '0'),
          sellers24h: parseInt(tokenData.totalSellers?.['24h'] || '0'),
          totalTraders24h: parseInt(tokenData.totalTraders?.['24h'] || '0'),
          buyVolume: tokenData.totalBuyVolume || {},
          sellVolume: tokenData.totalSellVolume || {},
          totalBuys: tokenData.totalBuys || {},
          totalSells: tokenData.totalSells || {},
        },
        analysis: {
          trendAnalysis: {
            direction: "NEUTRAL",
            trendStrength: "50%",
            rsi: "50",
            macd: "0"
          },
          marketStructure: {
            liquidityRating: "50",
            marketEfficiency: "50%",
            volatilityScore: "50",
            betaToSol: "1.0"
          },
          volumeAnalysis: {
            buyPressure: "50%",
            sellPressure: "50%",
            volumeProfile: "Neutral"
          },
          riskMetrics: {
            sharpeRatio: "0",
            maxDrawdown: "0%",
            volatility: "50%"
          },
          overallScore: "50",
          summary: `AI analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      }, { headers: jsonHeaders });
    }
  } catch (error) {
    console.error('Unexpected error in token analysis:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: jsonHeaders }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: jsonHeaders
  });
}