import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Livestream from "@/models/livestreamModel";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const monasteryId = req.nextUrl.searchParams.get("monasteryId");
    if (!monasteryId) {
      return NextResponse.json({ success: false, message: "monasteryId required" }, { status: 400 });
    }

    const doc = await Livestream.findOne({ monasteryId }).lean();
    if (!doc) return NextResponse.json({ success: true, livestream: null }, { status: 200 });

    return NextResponse.json({ success: true, livestream: doc }, { status: 200 });
  } catch (err) {
    console.error("/api/livestream/get error:", err);
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
