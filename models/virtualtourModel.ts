import mongoose, { Schema, Document } from "mongoose";

export interface IVirtualTour extends Document {
  monasteryId: mongoose.Types.ObjectId;
  title: string;
  panoramaUrl: string;
  type: "interior" | "exterior" | "aerial";
  narrationTracks: string[];
  metadata: Record<string, unknown>;
}

const VirtualTourSchema = new Schema<IVirtualTour>(
  {
    monasteryId: { type: Schema.Types.ObjectId, ref: "Monastery" },
    title: String,
    panoramaUrl: String,
    type: { type: String, enum: ["interior", "exterior", "aerial"] },
    narrationTracks: [String],
    metadata: Object,
  },
  { timestamps: true }
);

export default mongoose.models.VirtualTour ||
  mongoose.model<IVirtualTour>("VirtualTour", VirtualTourSchema);
