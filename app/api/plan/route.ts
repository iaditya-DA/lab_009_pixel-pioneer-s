import { generateTripPlan, TripPlanParams } from "@/lib/planTrip";
import { NextResponse } from "next/server";

// Helper to clean model's messy JSON output
function cleanJSON(text: string): string {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TripPlanParams;

    // Basic validation
    if (!body.district || !body.days) {
      return NextResponse.json(
        { error: "district and days are required" },
        { status: 400 }
      );
    }

    const planRaw = await generateTripPlan(body);

    if (!planRaw) {
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 500 }
      );
    }

    // Clean fences & sanitize
    const cleaned = cleanJSON(planRaw);

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON parse failed. Raw:", planRaw);

      return NextResponse.json(
        {
          error: "Invalid JSON returned by AI",
          raw: planRaw,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, plan: parsed },
      { status: 200 }
    );

  } catch (err) {
    console.error("Plan API Error:", err);

    const message =
      err instanceof Error ? err.message : "Unknown internal error";

    return NextResponse.json(
      {
        error: "Failed to generate trip plan",
        details: message,
      },
      { status: 500 }
    );
  }
}
