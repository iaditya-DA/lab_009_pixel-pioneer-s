// File: /app/api/events/booked/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import eventsModel from "@/models/eventsModel";

export async function GET() {
  try {
    await dbConnect();

    // Get auth session
    const session = await getServerSession(authOptions);
   console.log("User session:", session)
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Find the user so we can get bookedEvents
    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const bookedIds: string[] = user.BookedEvents || [];
    console.log("Booked Event IDs:", bookedIds);
    if (bookedIds.length === 0) {
      return NextResponse.json(
        { success: true, events: [] },
        { status: 200 }
      );
    }

    // Pull all events with those IDs
    const events = await eventsModel.find({
      _id: { $in: bookedIds }
    }).lean();
   console.log(events);
    return NextResponse.json(
      { success: true, events },
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ Error fetching booked events:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
