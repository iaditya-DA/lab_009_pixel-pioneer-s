import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Monastery from "@/models/monasteriesModel"
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const params = await context.params;
    console.log(params.id);
    const monastery = await Monastery.findById(params.id);
    if (!monastery) {
      return NextResponse.json(
        { message: "Archive not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(monastery, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}