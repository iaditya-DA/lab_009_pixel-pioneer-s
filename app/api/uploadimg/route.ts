import { NextResponse } from "next/server";
import User from "@/models/User";
import { uploadToCloudinary } from  "@/lib/uploadCloudinary"
import dbConnect from "@/lib/dbConnect"

export async function POST(req: Request) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const userId = formData.get("userId") as string;
    if (!userId) {
      return NextResponse.json({ error: "userId missing" }, { status: 400 });
    }

    // Files (multiple)
    const files = formData.getAll("files") as File[];

    // Upload metadata (parallel arrays)
    const types = formData.getAll("types") as string[];
    const descriptions = formData.getAll("descriptions") as string[];

    if (!files.length) {
      return NextResponse.json({ error: "No files received" }, { status: 400 });
    }

    // --- Upload all files to Cloudinary ---
    const uploadedResults = await Promise.all(
      files.map((file, index) =>
        uploadToCloudinary(file, "user_uploads")
          .then((imageUrl) => ({
            imageUrl,
            type: types[index] || "profile",
            description: descriptions[index] || "",
            uploadedAt: new Date(),
          }))
          .catch((err) => {
            console.error("Upload error:", err);
            return null;
          })
      )
    );

    // Filter failed uploads
    const successfulUploads = uploadedResults.filter(Boolean);

    if (successfulUploads.length === 0) {
      return NextResponse.json(
        { error: "All uploads failed" },
        { status: 500 }
      );
    }

    // --- Push to user.uploads ---
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { uploads: { $each: successfulUploads } },
      },
      { new: true }
    );

    return NextResponse.json({
      message: "Uploads successful",
      uploaded: successfulUploads,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Server failed while uploading" },
      { status: 500 }
    );
  }
}
