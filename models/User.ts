import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  phone?: string; 
  savedMonasteries: string[];
  bookings: string[];
  BookedEvents: string[];
  type: "user" | "hotelier" | "monasteryAdmin";

  uploads: {
    imageUrl: string;
    type: "archive" | "monastery" | "festival" | "profile";
    uploadedAt?: Date;
    caption?: string;
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}

const UploadSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    type: {
      type: String,
      enum: ["archive", "monastery", "festival", "profile"],
      required: true,
    },
    uploadedAt: { type: Date, default: Date.now },
    description: { type: String },
  },
  { _id: false } // prevents nested _id fields
);

const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    type: {
      type: String,
      enum: ["user", "hotelier", "monasteryAdmin"],
      default: "user",
    },
    phone: { type: String, required: false },
    savedMonasteries: [{ type: Schema.Types.ObjectId, ref: "Monastery" }],
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
    BookedEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],

    // 🆕 Uploads field
    uploads: [UploadSchema],
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
