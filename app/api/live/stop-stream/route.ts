import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Stream from '@/models/Stream';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { streamId } = await req.json();

    if (!streamId) {
      return NextResponse.json({ success: false, message: 'Stream ID required' }, { status: 400 });
    }

    const updatedStream = await Stream.findByIdAndUpdate(
      streamId,
      { 
        isLive: false,
        endTime: new Date()
      },
      { new: true }
    );

    if (!updatedStream) {
      return NextResponse.json({ success: false, message: 'Stream not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Stream stopped' });
  } catch (error) {
    console.error('Error stopping stream:', error);
    return NextResponse.json({ success: false, message: 'Internal Error' }, { status: 500 });
  }
}