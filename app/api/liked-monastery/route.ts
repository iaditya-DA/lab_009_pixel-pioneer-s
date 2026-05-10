import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { monasteryId, liked } = await req.json();

    if (!monasteryId) {
      return NextResponse.json(
        { success: false, message: "monasteryId is required" },
        { status: 400 }
      );
    }

    // find the logged in user
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Toggle logic
    if (liked) {
      // Add monasteryId if not already saved
      if (!user.savedMonasteries.includes(monasteryId)) {
        user.savedMonasteries.push(monasteryId);
      }
    } else {
      // Remove monasteryId
      user.savedMonasteries = user.savedMonasteries.filter(
        (id) => id.toString() !== monasteryId.toString()
      );
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: liked
          ? "Monastery added to saved list"
          : "Monastery removed from saved list",
        savedMonasteries: user.savedMonasteries,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error saving monastery:", err);

    return NextResponse.json(
      { success: false, message: "Server error while updating saved items" },
      { status: 500 }
    );
  }
}
