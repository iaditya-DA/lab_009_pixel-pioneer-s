import mongoose, { Schema, Document } from "mongoose";

export interface IDigitalArchive extends Document {
  monasteryId: mongoose.Types.ObjectId;
  title: string;
  fileUrl: string;
  description: string;
  language?: string;
  images: string[];
}
const DigitalArchiveSchema = new Schema<IDigitalArchive>(
  {
    monasteryId: { type: Schema.Types.ObjectId, ref: "Monastery" },
    title: String,
    fileUrl: String,
    images: [String],
    description: String,
    language : String,
  },
  { timestamps: true }
);

export default mongoose.models.DigitalArchive ||
  mongoose.model<IDigitalArchive>("DigitalArchive", DigitalArchiveSchema);
