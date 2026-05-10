import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import hotelsModel,{IHotel} from "@/models/hotelsModel";
import User, { IUser } from "@/models/User";
import dbConnect from "@/lib/dbConnect";

interface MyHotelsResponse {
  success: boolean;
  count?: number;
  data?: IHotel[];
  message?: string;
}

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json<MyHotelsResponse>(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get logged-in user
    const user: IUser | null = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json<MyHotelsResponse>(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Fetch hotels created by this user
    const myHotels: IHotel[] = await hotelsModel.find({ owner: user._id });
     console.log("Here is the MYhotel",myHotels)
    return NextResponse.json<MyHotelsResponse>({
      success: true,
      count: myHotels.length,
      data: myHotels,
    });
  } catch (err) {
    console.error("Error fetching hotels:", err);
    return NextResponse.json<MyHotelsResponse>(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
