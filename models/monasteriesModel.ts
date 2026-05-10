import mongoose, { Schema, Document } from "mongoose";

export interface IMonastery extends Document {
  id : number,
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  villageOrTown?: string;
  state?: string;
  googleMapsLink?: string;
  altitude?: string;
  buddhistSect?: string;
  district: string;
  images: string[];
  history: string;
  architecture: string;
  foundedYear: number;
  nearbyAttractions: string[];
}

const MonasterySchema = new Schema<IMonastery>(
  {
    id : Number,
    name: { type: String, required: true },
    description: String,
    location: {
      lat: Number,
      lng: Number,
    },
    district: String,
    images: [String],
    history: String,
    architecture: String,
    foundedYear: Number,
    villageOrTown: String, // Add this
    state: String, // Add this
    googleMapsLink: String, // Add this
    altitude: String, // Add this
    buddhistSect: String,
    nearbyAttractions: [String],
  },
  { timestamps: true 
  }
);

export default mongoose.models.Monastery ||
  mongoose.model<IMonastery>("Monastery", MonasterySchema);
