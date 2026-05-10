import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import eventsModel from "@/models/eventsModel";
import { getServerSession } from "next-auth/next";   // ✅ REQUIRED
import { authOptions } from "@/lib/authOptions";     // ✅ REQUIRED

export async function GET(req: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions); // now works

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const events = await eventsModel
      .find({ userId: session.user.id })
      .populate("monasteryId", "name")
      .sort({ startDate: -1 });

    return NextResponse.json({ success: true, events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
