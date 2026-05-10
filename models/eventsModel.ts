import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  monasteryId: mongoose.Types.ObjectId;
  eventName: string;
  startDate: string;
  endDate?: string;
  time?: string;
  duration?: string;
  location?: string;
  description?: string;
  highlights?: string[];
  images?: string[];
  bookingAvailable: boolean;
  ticketPrice?: number;
  totaltickets?: number;
  bookedTickets: number;
  userId:mongoose.Types.ObjectId;
}
const EventSchema = new Schema<IEvent>(
  {
    monasteryId: { type: Schema.Types.ObjectId, ref: "Monastery" },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User",
      required: true  // ← ADD THIS
    },
    eventName: { type: String, required: true },  // Also add required to critical fields
    startDate: String,
    endDate: String,
    time: String,
    duration: String,
    location: String,
    description: String,
    highlights: String,
    images: [String],
    bookingAvailable: { type: Boolean, default: true },
    ticketPrice: Number,
    totaltickets: Number,
    bookedTickets: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>("Event", EventSchema);
