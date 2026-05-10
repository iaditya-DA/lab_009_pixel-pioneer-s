import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Event from "@/models/eventsModel";
export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find();
    console.log(events);
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching monasteries:", error);

    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json(
      { message: "Failed to fetch monasteries", error: message },
      { status: 500 }
    );
  }
}
