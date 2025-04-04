import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
  try {
    const { score, rank, traits, quote } = await req.json();

    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 400, height: 600, deviceScaleFactor: 2 });

    // Create the HTML content
    const html = `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
              margin: 0;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, rgb(88, 28, 135) 0%, rgb(30, 27, 75) 50%, rgb(134, 25, 143) 100%);
              height: 600px;
              width: 400px;
              display: flex;
              flex-direction: column;
              padding: 24px;
              box-sizing: border-box;
              color: white;
              position: relative;
            }

            .profile {
              display: flex;
              align-items: center;
              background: rgba(0, 0, 0, 0.2);
              padding: 12px;
              border-radius: 8px;
              margin-bottom: 24px;
            }

            .profile-image {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: rgba(0, 0, 0, 0.2);
              margin-right: 12px;
            }

            .profile-info {
              display: flex;
              flex-direction: column;
            }

            .username {
              font-size: 16px;
              font-weight: 500;
              color: white;
            }

            .certified {
              font-size: 14px;
              color: rgb(216, 180, 254);
            }

            .title {
              font-size: 32px;
              font-weight: 700;
              text-align: center;
              margin-bottom: 48px;
              background: linear-gradient(to right, #ec4899, #a855f7, #06b6d4);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              width: 100%;
              word-break: break-word;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            }

            .title-emoji {
              font-size: 24px;
              -webkit-text-fill-color: initial;
            }

            .score-circle {
              width: 140px;
              height: 140px;
              border-radius: 50%;
              border: 3px solid rgba(255, 255, 255, 0.1);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin: 0 auto 48px;
              background: rgba(0, 0, 0, 0.2);
              position: relative;
            }

            .score {
              font-size: 40px;
              font-weight: 700;
              margin-bottom: 4px;
            }

            .trauma-text {
              font-size: 14px;
              color: rgb(216, 180, 254);
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }

            .traits-container {
              width: 100%;
              margin-bottom: 32px;
            }

            .traits-title {
              font-size: 14px;
              color: rgb(216, 180, 254);
              margin-bottom: 16px;
              text-align: left;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }

            .traits-list {
              display: flex;
              flex-wrap: wrap;
              gap: 12px;
            }

            .trait {
              padding: 8px 16px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 9999px;
              font-size: 14px;
              font-weight: 500;
              white-space: nowrap;
            }

            .stats-container {
              width: 100%;
              margin-bottom: 32px;
            }

            .stat-row {
              margin-bottom: 12px;
            }

            .stat-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;
              font-size: 14px;
            }

            .stat-label {
              color: rgb(216, 180, 254);
            }

            .stat-value {
              color: white;
            }

            .stat-bar {
              height: 8px;
              border-radius: 4px;
              background: rgba(0, 0, 0, 0.2);
              overflow: hidden;
            }

            .stat-fill {
              height: 100%;
              border-radius: 4px;
              transition: width 1s ease-out;
            }

            .stat-fill.coping {
              background: linear-gradient(to right, #22c55e, #10b981);
            }

            .stat-fill.resistance {
              background: linear-gradient(to right, #3b82f6, #06b6d4);
            }

            .stat-fill.addiction {
              background: linear-gradient(to right, #ec4899, #f43f5e);
            }

            .quote {
              font-size: 16px;
              color: rgb(216, 180, 254);
              text-align: center;
              font-style: italic;
              margin-bottom: 32px;
              padding: 0 24px;
              line-height: 1.5;
              font-weight: 500;
            }

            .watermark {
              font-size: 12px;
              color: rgba(216, 180, 254, 0.5);
              position: absolute;
              bottom: 16px;
              left: 50%;
              transform: translateX(-50%);
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="profile">
            <div class="profile-image"></div>
            <div class="profile-info">
              <div class="username">@h</div>
              <div class="certified">Certified Degen</div>
            </div>
          </div>

          <div class="title">
            <span class="title-emoji">🚬</span>
            ${rank}
          </div>

          <div class="score-circle">
            <div class="score">${score}%</div>
            <div class="trauma-text">Trauma</div>
          </div>

          <div class="traits-container">
            <div class="traits-title">Degen Traits:</div>
            <div class="traits-list">
              ${traits.map((trait: string) => `<div class="trait">${trait}</div>`).join('')}
            </div>
          </div>

          <div class="stats-container">
            <div class="stat-row">
              <div class="stat-header">
                <div class="stat-label">Coping Level</div>
                <div class="stat-value">75%</div>
              </div>
              <div class="stat-bar">
                <div class="stat-fill coping" style="width: 75%"></div>
              </div>
            </div>

            <div class="stat-row">
              <div class="stat-header">
                <div class="stat-label">Rug Resistance</div>
                <div class="stat-value">50%</div>
              </div>
              <div class="stat-bar">
                <div class="stat-fill resistance" style="width: 50%"></div>
              </div>
            </div>

            <div class="stat-row">
              <div class="stat-header">
                <div class="stat-label">Hopium Addiction</div>
                <div class="stat-value">70%</div>
              </div>
              <div class="stat-bar">
                <div class="stat-fill addiction" style="width: 70%"></div>
              </div>
            </div>
          </div>

          <div class="quote">"${quote}"</div>
          <div class="watermark">rugmeter.app</div>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const screenshot = await page.screenshot({
      type: 'png',
      omitBackground: false,
      encoding: 'binary'
    });

    await browser.close();

    return new NextResponse(screenshot, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate image' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 