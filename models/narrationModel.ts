import mongoose, { Schema, Document } from "mongoose";

export interface INarration extends Document {
  monasteryId: mongoose.Types.ObjectId;
  language: string;
  audioUrl: string;
  transcript: string;
  voiceType: "ai" | "real";
}

const NarrationSchema = new Schema<INarration>(
  {
    monasteryId: { type: Schema.Types.ObjectId, ref: "Monastery" },
    language: String,
    audioUrl: String,
    transcript: String,
    voiceType: { type: String, enum: ["ai", "real"] },
  },
  { timestamps: true }
);

export default mongoose.models.Narration ||
  mongoose.model<INarration>("Narration", NarrationSchema);
