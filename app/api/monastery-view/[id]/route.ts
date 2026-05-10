
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import MonasteryImage from "@/models/monasteryImageSchema";

interface Params {
  params: Promise<{ id: string }>;
}

export interface MonasteryImagesResponse {
  success: boolean;
  data?: {
    _id: string;
    title: string;
    iframe: string;
  }[];
  message?: string;
}

export async function GET(req: Request, { params }: Params) {
  try {
    await dbConnect();

    const { id } = await params;
     console.log("Fetching images for monastery id:", id);

    const images = await MonasteryImage.find({ monastery: id }).select(
      "_id title iframe"
    );

    if (!images.length) {
      return NextResponse.json<MonasteryImagesResponse>(
        { success: false, message: "No frames found for this monastery" },
        { status: 404 }
      );
    }

    return NextResponse.json<MonasteryImagesResponse>({
      success: true,
      data: images.map((img) => ({
        _id: img._id.toString(),
        title: img.title,
        iframe: img.iframe,
      })),
    });
  } catch (error) {
    console.error("Error fetching monastery images:", error);

    return NextResponse.json<MonasteryImagesResponse>(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
