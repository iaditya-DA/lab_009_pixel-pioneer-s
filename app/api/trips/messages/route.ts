import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import GroupTrip from "@/models/GroupTrip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { tripId, content, fileUrl, fileType } = await request.json();

  if (!tripId || (!content && !fileUrl)) {
    return NextResponse.json({ success: false, message: "Trip ID and content/file are required" }, { status: 400 });
  }

  try {
    await dbConnect();
    const trip = await GroupTrip.findById(tripId);

    if (!trip) {
      return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 });
    }

    if (!trip.participants.includes(session.user.email)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const newMessage = {
      sender: session.user.email,
      content,
      fileUrl,
      fileType: fileType || "text",
      timestamp: new Date(),
    };

    trip.messages.push(newMessage);
    await trip.save();

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
