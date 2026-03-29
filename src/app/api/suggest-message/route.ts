import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime="edge";

const openrouter =createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});


export const POST=async(req:NextRequest)=>{
  await req.json();

  const prompt="Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  try {
    const res=await streamText({
      model:openrouter.chat("google/gemma-3-12b-it:free"),
      prompt:prompt
    })
    return res.toTextStreamResponse();
  }
  catch (error) {
    console.error('OpenRouter error:', error);
    return NextResponse.json(
      { success: false, message: 'internal server error' },
      { status: 500 }
    );
  }
};