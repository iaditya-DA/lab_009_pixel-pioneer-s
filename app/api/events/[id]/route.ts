import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Event from "@/models/eventsModel";
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const params = await context.params;
    console.log(params.id);
    const events = await Event.findById(params.id);
    if (!events) {
      return NextResponse.json(
        { message: "Archive not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
