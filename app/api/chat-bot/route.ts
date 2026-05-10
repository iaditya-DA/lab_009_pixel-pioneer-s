// app/api/assistant/route.ts
import { NextResponse } from "next/server";
import { monasteryAssistant } from "@/lib/assistantResponse";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Assistant API received body:", body);

    if (!body.message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const reply = await monasteryAssistant({
      message: body.message,        // <-- FIXED HERE
      userId: body.userId,
      language: body.language || "en",
    }); 
    console.log("Assistant API reply:", reply)

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Assistant API Error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Try again later." },
      { status: 500 }
    );
  }
}
