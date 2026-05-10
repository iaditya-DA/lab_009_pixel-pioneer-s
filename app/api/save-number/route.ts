import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import User, { IUser } from '@/models/User';

interface SavePhoneRequest {
  phone: string;
}

interface SavePhoneResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  message?: string;
}

// Helper function to validate phone
const validatePhone = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};

export async function POST(
  req: NextRequest
): Promise<NextResponse<SavePhoneResponse>> {
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

    // Parse request body
    const body: SavePhoneRequest = await req.json();
    const { phone } = body;

    // Validation: Check if phone is provided
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Phone number is required' 
        },
        { status: 400 }
      );
    }

    // Validation: Check if phone is valid (10 digits)
    if (!validatePhone(phone)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid phone number. Must be 10 digits.' 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Update user with phone number using email from session
    const user: IUser | null = await User.findOneAndUpdate(
      { email: session.user.email },
      { phone },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('email username phone');

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
        message: 'Phone number saved successfully',
        user: {
          id: user._id?.toString() || '',
          name: user.username,
          email: user.email,
          phone: user.phone || '',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error saving phone:', errorMessage);

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}