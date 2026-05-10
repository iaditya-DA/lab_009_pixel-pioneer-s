import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import hotelsModel from "@/models/hotelsModel";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";

export const config = {
  api: {
    bodyParser: false, // Disabling bodyParser for FormData
  },
};

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const owner = session.user.id; // <-- get owner from auth

    const form = await req.formData();

    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const address = form.get("address") as string;
    const pricePerNight = Number(form.get("pricePerNight"));
    const rating = Number(form.get("rating"));
    const closestMonastery = form.get("closestMonastery") as string;
    const lng = Number(form.get("lng"));
    const lat = Number(form.get("lat"));
    const googleMapsEmbedUrl = form.get("googleMapsEmbedUrl") as string;
    const images = form.getAll("images") as File[];

    console.log("Hotel Data Received:", { name, address, pricePerNight, lng, lat, imageCount: images.length });

    if (!name || !address || isNaN(pricePerNight) || isNaN(lng) || isNaN(lat)) {
      console.log("Validation failed: Missing or invalid required fields");
      return NextResponse.json(
        { success: false, message: "Missing or invalid required fields (Name, Address, Price, Lng, Lat)" },
        { status: 400 }
      );
    }

    const uploadedImages: string[] = [];
    for (const img of images) {
      try {
        const url = await uploadToCloudinary(img, "hotel-images");
        if (url) uploadedImages.push(url);
      } catch (error) {
        console.error("Image upload failed for one image:", error);
      }
    }

    if (uploadedImages.length === 0) {
        return NextResponse.json({ success: false, message: "At least one image must be successfully uploaded" }, { status: 400 });
    }

    // Create DB entry
    const hotel = await hotelsModel.create({
      name,
      description,
      address,
      pricePerNight,
      rating: rating || 0,
      owner,
      closestMonastery,
      images: uploadedImages,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      googleMapsEmbedUrl,
    });

    console.log("✅ Hotel created successfully:", hotel._id);
    return NextResponse.json({ success: true, hotel });
  } catch (err: any) {
    console.error("❌ Hotel Creation Error:", err);
    return NextResponse.json({ 
      success: false, 
      message: err.message || "Internal Server Error",
      error: err.toString()
    }, { status: 500 });
  }
}
