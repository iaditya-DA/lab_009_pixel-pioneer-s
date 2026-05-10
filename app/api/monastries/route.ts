// import dbConnect from "@/lib/dbConnect";
// import Monastery from "@/models/monasteriesModel"
// export async function GET() {
//   await dbConnect();
//   const monasteries = await Monastery.find();
//   console.log(monasteries);
//   return Response.json(monasteries);
// }
import dbConnect from "@/lib/dbConnect";
import Monastery from "@/models/monasteriesModel";
import { monasteries as STATIC_MONASTERIES } from "@/data/MapData/mapData";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    await dbConnect();
    const monasteries = await Monastery.find();
    console.log("Fetched monasteries from DB:", monasteries?.length ?? 0);

    // If DB is empty, fallback to static data file (mapData.ts)
    if (!monasteries || monasteries.length === 0) {
      console.log("Using static monastery data fallback...");
      // Use the static dataset as-is; provide an _id field for consistency
      const withId = STATIC_MONASTERIES.map((m) => ({ ...m, _id: m.id }));
      return NextResponse.json(withId, { status: 200 });
    }

    return NextResponse.json(monasteries, { status: 200 });
  } catch (error) {
    console.error("Error fetching monasteries:", error);
    // If DB is unreachable or any error occured, fall back to static data
    try {
      const withId = STATIC_MONASTERIES.map((m) => ({ ...m, _id: m.id }));
      return NextResponse.json(withId, { status: 200 });
    } catch (e) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return NextResponse.json({ message: "Failed to fetch monasteries", error: message }, { status: 500 });
    }
  }
}
