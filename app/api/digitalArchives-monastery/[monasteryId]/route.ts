import dbConnect from "@/lib/dbConnect";
import { NextResponse, NextRequest } from "next/server";
import DigitalArchive from "@/models/digitalArchiveModel";
import mongoose from "mongoose";
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ monasteryId: string }> }
) {
  //   try {
  //     await dbConnect();
  //     const params = await context.params;
  //     const monasteryId = params.monasteryId;
  //     console.log("Monastery ID from params:", monasteryId);
  //     if (!monasteryId) {
  //       return NextResponse.json(
  //         { message: "Monastery ID missing" },
  //         { status: 400 }
  //       );
  //     }

  //     const archives = await DigitalArchive.find({ monasteryId: monasteryId });

  //     return NextResponse.json(archives, { status: 200 });
  //   }
  try {
     await dbConnect();

    const params = await context.params;
    const monasteryId = params.monasteryId;

    console.log("Monastery ID from params:", monasteryId);

    if (!monasteryId || !mongoose.Types.ObjectId.isValid(monasteryId)) {
      return NextResponse.json({ message: "Invalid or missing monasteryId" }, { status: 400 });
    }
    console.log(typeof monasteryId);
    
    const objectId = new mongoose.Types.ObjectId(monasteryId);
    console.log(typeof objectId);
    
    const archives = await DigitalArchive.find({ monasteryId: objectId });

    console.log("Archives found:", archives.length);

    return NextResponse.json(archives, { status: 200 });
  } catch (error) {
    console.error("Error fetching archives:", error);

    return NextResponse.json(
      { message: "Failed to fetch archives" },
      { status: 500 }
    );
  }
}
