import mongoose, { Document } from "mongoose";

// Define interface representing the product document
export interface IProduct extends Document {
  title?: string;
  description?: string;
  price?: number;
  rating?: number;
  type?: "General" | "Bidding";
  isBidding?: boolean;
  biddingStartTime?: Date;
  biddingEndTime?: Date;
  bids?: { bidder: mongoose.Types.ObjectId; amount: number }[];
  quantity?: number;
  image?: string[];
  category?: string;
  store: mongoose.Types.ObjectId;
}

// Define the schema
const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  type: {
    type: String,
    enum: ["General", "Bidding"],
  },
  isBidding: {
    type: Boolean,
    default: false,
  },
  biddingStartTime: {
    type: Date,
  },
  biddingEndTime: {
    type: Date,
  },
  bids: [
    {
      bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      amount: {
        type: Number,
      },
    },
  ],
  quantity: {
    type: Number,
  },
  image: {
    type: [String],
  },
  category: {
    type: String,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
});

export default mongoose.model<IProduct>("Product", productSchema);
