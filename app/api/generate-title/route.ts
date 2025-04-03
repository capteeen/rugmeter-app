import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { score, traits, username } = await request.json();

    const prompt = `Generate a creative and funny crypto trader title for Twitter user ${username || 'anon'} who scored ${score}% on a crypto trauma test.
Their traits include: ${traits.join(', ')}.

The title should:
- Be funny and meme-worthy
- Include an emoji
- Be max 40 characters
- Feel like a crypto/web3 title
- Be slightly edgy but not offensive
- Reference crypto/trading culture
- Be unique to their personality

Example formats:
"🧠 Delusional Degen"
"💀 Rug PTSD Survivor"
"🚬 Diamond-Handed Masochist"

Return ONLY the title, nothing else.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.9,
      max_tokens: 50,
    });

    const title = completion.choices[0].message.content?.trim();

    return NextResponse.json({ title });
  } catch (error) {
    console.error('Error generating title:', error);
    return NextResponse.json(
      { error: 'Failed to generate title' },
      { status: 500 }
    );
  }
} 