import nodeHtmlToImage from 'node-html-to-image';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { html, css } = await req.json();
    console.log('Starting image generation...');

    const image = await nodeHtmlToImage({
      html: `
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              ${css}
              
              body {
                margin: 0;
                padding: 16px;
                background: linear-gradient(135deg, rgb(76, 29, 149) 0%, rgb(46, 16, 101) 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
              }
              
              .card {
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(8px);
                border-radius: 16px;
                padding: 24px;
                width: 100%;
                max-width: 400px;
                color: white;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              }
            </style>
          </head>
          <body>
            <div class="card">
              ${html}
            </div>
          </body>
        </html>
      `,
      type: 'png',
      quality: 100,
      puppeteerArgs: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
      },
      transparent: true,
      encoding: 'binary'
    });

    console.log('Image generated successfully');

    return new NextResponse(image as Buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Screenshot error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate image' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 