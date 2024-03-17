import mongoose, { Schema, Document } from "mongoose";

// Define interface representing the store document
export interface IStore extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  logo: string;
  type: "Electronics" | "Grocery" | "Fashion" | "Stationery";
  location: {
    type: string;
    coordinates: [number, number];
  };
  verified: boolean;
}

// Define the schema
const storeSchema: Schema<IStore> = new Schema<IStore>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Electronics", "Grocery", "Fashion", "Stationery"],
    required: true,
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

// Index the location field for geospatial queries
storeSchema.index({ location: "2dsphere" });

// Define the model
const Store = mongoose.model<IStore>("Store", storeSchema);

export default Store;
