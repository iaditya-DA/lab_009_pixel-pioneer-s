import Hotel from "@/models/hotelsModel";
import dbConnect from "@/lib/dbConnect";
export async function GET() {
  try {
    await dbConnect();
    const hotels = await Hotel.find();
    console.log("Fetched Hotel:", hotels);
    return Response.json(hotels, { status: 200 });
  } catch (error) {
    console.error("Error fetching hotels:", error);

    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return Response.json(
      { message: "Failed to fetch hotels", error: message },
      { status: 500 }
    );
  }
}
