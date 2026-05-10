import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import DigitalArchive from "@/models/digitalArchiveModel";
export async function GET() {
  try {
    await dbConnect();
    const digitalarchive = await DigitalArchive.find();
    return NextResponse.json(digitalarchive,{status : 200})
    
  } catch (error) {
      console.error("Error fetching monasteries:", error);

  const message =
    error instanceof Error ? error.message : "Something went wrong";

  return NextResponse.json(
    { message: "Failed to fetch monasteries", error: message },
    { status: 500 }
  );
  }
}
