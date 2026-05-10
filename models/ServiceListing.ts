import mongoose, { Document, Model, Schema } from "mongoose";

export interface IServiceListing extends Document {
  providerEmail: string;
  providerName: string;
  serviceType: "Tourist Guide" | "Home Kitchen" | "Rent 2 Wheeler" | "Rent 4 Wheeler";
  startDate: Date;
  endDate: Date;
  price?: number;
  location?: string;
  phone: string;
  description?: string;
  status: "pending" | "verified" | "rejected";
  createdAt: Date;
}

const ServiceListingSchema: Schema<IServiceListing> = new Schema(
  {
    providerEmail: { type: String, required: true },
    providerName: { type: String, required: true },
    serviceType: {
      type: String,
      enum: ["Tourist Guide", "Home Kitchen", "Rent 2 Wheeler", "Rent 4 Wheeler"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number },
    location: { type: String },
    phone: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ServiceListing: Model<IServiceListing> =
  mongoose.models.ServiceListing ||
  mongoose.model<IServiceListing>("ServiceListing", ServiceListingSchema);

export default ServiceListing;
