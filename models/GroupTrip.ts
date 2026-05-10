import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMessage {
  sender: string;
  content?: string;
  fileUrl?: string;
  fileType?: "text" | "image" | "pdf";
  timestamp: Date;
}

export interface IGroupTrip extends Document {
  name?: string;
  participants: string[];
  messages: IMessage[];
  createdAt: Date;
}

const MessageSchema = new Schema({
  sender: { type: String, required: true },
  content: { type: String },
  fileUrl: { type: String },
  fileType: { type: String, enum: ["text", "image", "pdf"], default: "text" },
  timestamp: { type: Date, default: Date.now },
});

const GroupTripSchema = new Schema(
  {
    name: { type: String },
    participants: [{ type: String, required: true }],
    messages: [MessageSchema],
  },
  { timestamps: true }
);

const GroupTrip: Model<IGroupTrip> =
  mongoose.models.GroupTrip || mongoose.model<IGroupTrip>("GroupTrip", GroupTripSchema);

export default GroupTrip;
