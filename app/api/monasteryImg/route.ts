import dbConnect from "@/lib/dbConnect";
import Monastery from "@/models/monasteriesModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Projection: sirf ye 3 fields return karo
    const monasteries = await Monastery.find(
      {},
      { _id: 1, name: 1, images: 1 }
    );
    const monasteriesWithSingleImage = monasteries.map((monastery) => ({
      _id: monastery._id,
      name: monastery.name,
      image:
        monastery.images && monastery.images.length > 0
          ? monastery.images[0]
          : null,
    }));

    console.log("Fetched monasteries:", monasteriesWithSingleImage);
    return NextResponse.json(monasteries, { status: 200 });
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
