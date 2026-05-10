import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileType = file.type.startsWith("image/") ? "image" : file.type === "application/pdf" ? "pdf" : "text";
    
    if (fileType === "text") {
        return NextResponse.json({ error: "Only images and PDFs are supported" }, { status: 400 });
    }

    const fileUrl = await uploadToCloudinary(file, "trip_together");

    return NextResponse.json({
      success: true,
      fileUrl,
      fileType,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
