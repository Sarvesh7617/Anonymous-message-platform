import { OpenRouter } from "@openrouter/sdk";
import { NextRequest, NextResponse } from 'next/server';

export const runtime="edge";

const openrouter =new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});


export const POST=async(req:NextRequest)=>{
    let body = {};
try {
  body = await req.json();
} catch (err) {
  console.log("No JSON body sent, continuing with empty object");
}
console.log("Request body received:", body);

    const prompt=
     "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    try {
        const res = await openrouter.chat.send({
            chatGenerationParams: {
                model: "google/gemma-3-12b-it:free",
                messages: [
                {
                    role: "user",
                    content: prompt,
                },
                ],
                stream: false
            }
        });

        // OpenRouter response ko log karo
    console.log("OpenRouter raw response:", res);

    const content = res.choices[0]?.message?.content ?? "";
    console.log("Final content to send:", content);

    return NextResponse.json({ message: content });
  } catch (error) {
    console.log("An unexpected error occurred:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
};