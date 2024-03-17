import mongoose, { Document } from "mongoose";

// Define interface representing the cart document
export interface ICart extends Document {
  userId?: mongoose.Types.ObjectId;
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price?: number;
  }[];
  total_price: number;
}

// Define the schema
const cartSchema = new mongoose.Schema<ICart>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      price: { type: Number },
    },
  ],
  total_price: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model<ICart>("Cart", cartSchema);
