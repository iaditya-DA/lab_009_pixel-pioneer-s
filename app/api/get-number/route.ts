import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import User, { IUser } from '@/models/User';

interface UserResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    hasPhone: boolean;
  };
  message?: string;
}

export async function GET(req: NextRequest): Promise<NextResponse<UserResponse>> {
  try {
    // Get session using NextAuth
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User not authenticated' 
        },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Fetch user from database using email from session
    const user: IUser | null = await User.findOne({ 
      email: session.user.email 
    }).select('email username phone');

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id?.toString() || '',
          name: user.username,
          email: user.email,
          phone: user.phone || null,
          hasPhone: !!user.phone,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching user details:', errorMessage);
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}