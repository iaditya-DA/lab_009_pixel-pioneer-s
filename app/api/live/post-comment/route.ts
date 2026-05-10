import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/comment';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { streamId, user, text } = await req.json();

    if (!streamId || !user || !text) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    const newComment = await Comment.create({
      streamId,
      user,
      text,
      timestamp: new Date()
    });

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json({ success: false, message: 'Failed to post comment' }, { status: 500 });
  }
}