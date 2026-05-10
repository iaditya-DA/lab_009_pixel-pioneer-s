// models/MonasteryImage.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IMonasteryImage extends Document {
  monastery: mongoose.Types.ObjectId;
  title: string;
  iframe: string;
}

const MonasteryImageSchema = new Schema(
  {
    monastery: {
      type: Schema.Types.ObjectId,
      ref: "Monastery",
      required: true,
    },
    title: { type: String, required: true },
    iframe: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.MonasteryImage ||
  mongoose.model<IMonasteryImage>("MonasteryImage", MonasteryImageSchema);
