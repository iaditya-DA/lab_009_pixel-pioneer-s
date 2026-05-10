import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Stream from '@/models/Stream';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { title, admin, adminId } = await req.json();

    if (!title || !admin) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    // Generate a secure random stream key
    const streamKey = `live_${crypto.randomBytes(4).toString('hex')}_${Date.now()}`;
    
    // Simulate an HLS URL (In a real app, this comes from Livepeer/Mux/AWS IVS)
    // For now, we mock it so the frontend has something to display
    const hlsUrl = `https://cdn.monastery360.in/hls/${streamKey}.m3u8`;

    const newStream = await Stream.create({
      title,
      admin,
      adminId,
      streamKey,
      hlsUrl,
      isLive: true,
      viewers: 0,
      thumbnail: '🧘' // Default thumbnail
    });

    return NextResponse.json({ success: true, stream: newStream });
  } catch (error) {
    console.error('Error starting stream:', error);
    return NextResponse.json({ success: false, message: 'Failed to start stream' }, { status: 500 });
  }
}