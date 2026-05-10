import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId; 
  date: Date;
  orderId: string;
  numberOfPeople: number;
  ticketPrice: number;
  totalAmount: number;
  paymentStatus: "pending" | "success" | "failed";
}

const BookingSchema = new Schema<IBooking>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  event: {
    type: Schema.Types.ObjectId,
    ref: "Event", // ← changed from Monastery
    required: true,
  },
  orderId: { type: String, required: true },
  date: { type: Date, required: true },
  numberOfPeople: { type: Number, required: true },
  ticketPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },

  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
});

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
