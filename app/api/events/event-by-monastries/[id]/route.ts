import { NextResponse } from "next/server";
import eventsModel from "@/models/eventsModel";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request, context: any) {
  try {
    await dbConnect();

    // 👇 FIX: unwrap params from the context
    const { id: monasteryId } = await context.params;

    console.log("params id:", monasteryId);

    if (!monasteryId) {
      return NextResponse.json(
        { success: false, message: "monasteryId is required" },
        { status: 400 }
      );
    }

    const events = await eventsModel.find({ monasteryId }).lean();
    return NextResponse.json(
      {
        success: true,
        count: events.length,
        events,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching events:", err);

    return NextResponse.json(
      { success: false, message: "Server error while fetching events" },
      { status: 500 }
    );
  }
}
