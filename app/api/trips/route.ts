import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import GroupTrip from "@/models/GroupTrip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const trips = await GroupTrip.find({
      participants: session.user.email,
    }).sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, trips });
  } catch (error) {
    console.error("Fetch trips error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { participantEmail, tripName } = await request.json();

  if (!participantEmail) {
    return NextResponse.json({ success: false, message: "Participant email is required" }, { status: 400 });
  }

  try {
    await dbConnect();
    
    // Check if trip with exactly these participants already exists (for 1-on-1 chats)
    // Actually, for groups, we might want multiple groups with same people, so let's just create new.
    // But if it's a 1-on-1 and no name is given, maybe reuse?
    // Let's just always create a new one if a name is provided, or if it's a new pair.
    
    const newTrip = await GroupTrip.create({
      name: tripName || undefined,
      participants: [session.user.email, participantEmail],
      messages: [],
    });

    return NextResponse.json({ success: true, trip: newTrip });
  } catch (error) {
    console.error("Create trip error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { tripId, participantEmail } = await request.json();

  if (!tripId || !participantEmail) {
    return NextResponse.json({ success: false, message: "Trip ID and participant email are required" }, { status: 400 });
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

    if (trip.participants.includes(participantEmail)) {
      return NextResponse.json({ success: false, message: "User already in group" }, { status: 400 });
    }

    trip.participants.push(participantEmail);
    await trip.save();

    return NextResponse.json({ success: true, trip });
  } catch (error) {
    console.error("Add participant error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { tripId } = await request.json();

  if (!tripId) {
    return NextResponse.json({ success: false, message: "Trip ID is required" }, { status: 400 });
  }

  try {
    await dbConnect();
    // Only allow deletion if the user is a participant
    const trip = await GroupTrip.findById(tripId);
    if (!trip) {
      return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 });
    }
    
    if (!trip.participants.includes(session.user.email)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await GroupTrip.findByIdAndDelete(tripId);
    return NextResponse.json({ success: true, message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Delete trip error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
