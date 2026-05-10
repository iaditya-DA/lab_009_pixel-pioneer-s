import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStream extends Document {
  title: string;
  admin: string;
  adminId: string;
  streamKey: string;
  hlsUrl: string;
  thumbnail: string;
  viewers: number;
  isLive: boolean;
  startTime: Date;
  endTime?: Date;
}

const StreamSchema: Schema = new Schema({
  title: { type: String, required: true },
  admin: { type: String, required: true },
  adminId: { type: String, required: true },
  streamKey: { type: String, required: true, unique: true }, // Secret key for OBS
  hlsUrl: { type: String, required: true }, // Playback URL
  thumbnail: { type: String, default: '📹' }, // Default emoji or URL
  viewers: { type: Number, default: 0 },
  isLive: { type: Boolean, default: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
}, { timestamps: true });

// Prevent model recompilation error in Next.js
const Stream: Model<IStream> = mongoose.models.Stream || mongoose.model<IStream>('Stream', StreamSchema);

export default Stream;