import mongoose, { Schema, Document } from "mongoose";

export interface IHotel extends Document {
  name: string;
  description?: string;
  images: string[];
  address: string;
  pricePerNight: number;
  rating?: number;
  available: boolean;
  owner: mongoose.Schema.Types.ObjectId;
  closestMonastery?: string;
  // new fields
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  googleMapsEmbedUrl?: string;
  monasteryId : mongoose.Schema.Types.ObjectId;
}

const HotelSchema = new Schema<IHotel>(
  {
    name: { type: String, required: true },
    description: String,
    images: { type: [String], default: [] },
    address: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    rating: Number,
    available: { type: Boolean, default: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    closestMonastery: {
        type: String,
    },
    // 🌍 GeoJSON location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    // Optional embed URL for iframe
    googleMapsEmbedUrl: { type: String },
    monasteryId : {type : Schema.Types.ObjectId}
  },
  { timestamps: true }
);

HotelSchema.index({ location: "2dsphere" });

export default mongoose.models.Hotel ||
  mongoose.model<IHotel>("Hotel", HotelSchema);
