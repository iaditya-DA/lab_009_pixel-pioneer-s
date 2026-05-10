import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/comment';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Extract streamId from query parameters (e.g., ?streamId=123)
    const { searchParams } = new URL(req.url);
    const streamId = searchParams.get('streamId');

    if (!streamId) {
      return NextResponse.json({ success: false, message: 'Stream ID required' }, { status: 400 });
    }

    // Get comments for this stream, sorted by oldest first (standard chat)
    const comments = await Comment.find({ streamId }).sort({ timestamp: 1 });

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch comments' }, { status: 500 });
  }
}