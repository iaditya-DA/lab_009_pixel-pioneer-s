import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, username, password, type } = await req.json();

    // Validate
    if (!email || !username || !password || !type) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      type, // ← uses your enum EXACTLY
      savedMonasteries: [],
      bookings: [],
    });

    // Return user info (for redirect)
    return NextResponse.json(
      {
        message: "Signup success",
        user: {
          id: newUser._id,
          email: newUser.email,
          username: newUser.username,
          type: newUser.type, // ← important
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Signup error" },
      { status: 500 }
    );
  }
}
