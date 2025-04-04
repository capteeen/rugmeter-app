import React from 'react';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// Remove edge runtime to use default Node.js runtime
// export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { score, rank, traits, quote } = await req.json();

    // Validate input
    if (!score || !rank || !traits || !quote) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const image = await new ImageResponse(
      (
        <div
          style={{
            height: '600px',
            width: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, rgb(88, 28, 135), rgb(30, 27, 75), rgb(134, 25, 143))',
            padding: '20px',
            borderRadius: '16px',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              textAlign: 'center',
              width: '100%',
              wordBreak: 'break-word',
            }}
          >
            {rank}
          </div>

          {/* Score Circle */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              border: '3px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              background: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
              {score}%
            </div>
            <div style={{ fontSize: '14px', color: 'rgb(216, 180, 254)' }}>
              TRAUMA
            </div>
          </div>

          {/* Traits */}
          <div style={{ marginBottom: '20px', width: '100%' }}>
            <div style={{ fontSize: '14px', color: 'rgb(216, 180, 254)', marginBottom: '8px' }}>
              DEGEN TRAITS:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {traits.map((trait: string, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: '4px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    color: 'white',
                  }}
                >
                  {trait}
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div
            style={{
              fontSize: '14px',
              color: 'rgb(216, 180, 254)',
              textAlign: 'center',
              fontStyle: 'italic',
              marginBottom: '20px',
              padding: '0 20px',
              width: '100%',
              wordBreak: 'break-word',
            }}
          >
            "{quote}"
          </div>

          {/* Watermark */}
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(216, 180, 254, 0.5)',
              position: 'absolute',
              bottom: '12px',
            }}
          >
            rugmeter.app
          </div>
        </div>
      ),
      {
        width: 400,
        height: 600,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000',
        },
      },
    );

    // Verify the image was generated
    if (!image || !image.body) {
      throw new Error('Failed to generate image');
    }

    return image;
  } catch (error) {
    console.error('Image generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate image', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 