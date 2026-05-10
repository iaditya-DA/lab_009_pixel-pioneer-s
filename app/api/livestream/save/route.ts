import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Livestream from "@/models/livestreamModel";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { monasteryId, streamKey, rtmpUrl, playbackUrl } = body;

    if (!monasteryId || !streamKey || !rtmpUrl || !playbackUrl) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const doc = await Livestream.findOneAndUpdate(
      { monasteryId },
      { streamKey, rtmpUrl, playbackUrl, isLive: false },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({ success: true, livestream: doc }, { status: 200 });
  } catch (err) {
    console.error("/api/livestream/save error:", err);
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
