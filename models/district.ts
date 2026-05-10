import mongoose, { Document, Schema } from "mongoose";
import { model } from "mongoose";

export interface IDistrict extends Document {
  district: string;
  description?: string;
  image?: string;
  population: number;
  area_km2: number;
  villages?: number;
  literacy_rate?: string; // e.g. "83.85%"
  district_code: string;
  latitude: number;
  longitude: number;
  languages?: string[];
  festivals?: string[];
  foods?: string[];
}

const DistrictSchema = new Schema<IDistrict>({
  district: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  population: { type: Number, required: true },
  area_km2: { type: Number, required: true },
  villages: { type: Number },
  literacy_rate: { type: String }, // can store as string with % or parse to number if you want
  district_code: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  languages: [{ type: String }],
  festivals: [{ type: String }],
  foods: [{ type: String }],
});

export default mongoose.models.District|| model<IDistrict>("District", DistrictSchema);