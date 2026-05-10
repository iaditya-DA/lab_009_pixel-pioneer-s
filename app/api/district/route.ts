import { NextResponse } from "next/server";
import District from "@/models/district";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    const districts = await District.find().sort({ district: 1 }); // sort alphabetically
    return NextResponse.json(districts);
  } catch (error) {
    console.error("Error fetching districts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
