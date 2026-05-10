import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Livestream from "@/models/livestreamModel";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const monasteryId = req.nextUrl.searchParams.get("monasteryId");
    const state = req.nextUrl.searchParams.get("state");

    if (!monasteryId || typeof state !== "string") {
      return NextResponse.json({ success: false, message: "monasteryId and state required" }, { status: 400 });
    }

    const isLive = state === "true";

    const doc = await Livestream.findOneAndUpdate(
      { monasteryId },
      { isLive },
      { new: true }
    ).lean();

    return NextResponse.json({ success: true, livestream: doc }, { status: 200 });
  } catch (err) {
    console.error("/api/livestream/set-live error:", err);
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
