import mongoose, { Schema, Document } from "mongoose";

interface IOrderProduct {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  products: IOrderProduct[];
  total_price?: number;
  timestamp: Date;
}

const orderSchema: Schema<IOrder> = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  total_price: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>("Order", orderSchema);
