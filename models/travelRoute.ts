import mongoose, { Schema, Document } from "mongoose";

export interface IRoute extends Document {
  monasteryId: mongoose.Types.ObjectId;
  nearestBusStop: string;
  nearestTaxiStand: string;
  travelTime: string;
  lat: number;
  lng: number;
  routeDescription: string;
}

const RouteSchema = new Schema<IRoute>(
  {
    monasteryId: { type: Schema.Types.ObjectId, ref: "Monastery" },
    nearestBusStop: String,
    nearestTaxiStand: String,
    travelTime: String,
    lat: Number,
    lng: Number,
    routeDescription: String,
  },
  { timestamps: true }
);

export default mongoose.models.Route ||
  mongoose.model<IRoute>("Route", RouteSchema);
