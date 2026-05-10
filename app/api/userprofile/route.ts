// Server-only API route
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

import TicketBooking from "@/models/ticketbookingModel";
import "@/models/eventsModel"; 
import "@/models/monasteriesModel"; 

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 1️⃣ Fetch user info (no bookings here)
    const user = await User.findById(userId)
      .select("-password -__v")
      .populate({
        path: "savedMonasteries",
        select: "name district state images",
      })
      .lean()
      .exec();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Fetch bookings separately based on userId
    const bookings = await TicketBooking.find({ user: userId })
      .populate({
        path: "event",
        select: "eventName startDate ticketPrice", // what you want in response
      })
      .lean();
      console.log("Fetched bookings for user and user info :", bookings,user);
    // 3️⃣ Return combined response
    return NextResponse.json(
      {
        success: true,
        user,
        bookings,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching user profile:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
