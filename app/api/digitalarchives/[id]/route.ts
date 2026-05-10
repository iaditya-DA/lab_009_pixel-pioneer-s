import { NextResponse } from "next/server";
import DigitalArchive from "@/models/digitalArchiveModel";
import dbConnect from "@/lib/dbConnect";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const params = await context.params;
    console.log(params.id);
    const archive = await DigitalArchive.findById(params.id);
    if (!archive) {
      return NextResponse.json(
        { message: "Archive not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(archive, { status: 200 });
  } catch (error) {
    console.error("Error fetching archives:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
