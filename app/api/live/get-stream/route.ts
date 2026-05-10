import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Stream from '@/models/Stream';

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch only streams that are currently live, sort by newest
    const streams = await Stream.find({ isLive: true }).sort({ startTime: -1 });

    return NextResponse.json({ success: true, streams });
  } catch (error) {
    console.error('Error fetching streams:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch streams' }, { status: 500 });
  }
}