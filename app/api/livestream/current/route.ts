import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Livestream from "@/models/livestreamModel";

export async function GET() {
  try {
    await dbConnect();
    const live = await Livestream.findOne({ isLive: true }).lean();
    if (!live) {
      return NextResponse.json({ isLive: false }, { status: 200 });
    }
    return NextResponse.json({ isLive: true, playbackUrl: live.playbackUrl }, { status: 200 });
  } catch (err) {
    console.error("/api/livestream/current error:", err);
    return NextResponse.json({ isLive: false }, { status: 500 });
  }
}
