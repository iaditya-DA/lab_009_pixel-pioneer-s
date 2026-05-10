import Hotel from "@/models/hotelsModel"
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    console.log("Fetching hotel with ID:", params.id);
    await dbConnect();
    console.log(params.id);
    const hotel = await Hotel.findById(params.id);

    if (!hotel) {
      return new NextResponse("Hotel not found", { status: 404 });
    }

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
