import mongoose, { Schema, Document } from "mongoose";

export interface ILivestream extends Document {
  monasteryId: string;
  streamKey: string;
  rtmpUrl: string;
  playbackUrl: string;
  isLive: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}

const LivestreamSchema = new Schema<ILivestream>(
  {
    monasteryId: { type: String, required: true, index: true },
    streamKey: { type: String, required: true },
    rtmpUrl: { type: String, required: true },
    playbackUrl: { type: String, required: true },
    isLive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Livestream =
  mongoose.models.Livestream || mongoose.model<ILivestream>("Livestream", LivestreamSchema);

export default Livestream;
