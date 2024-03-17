import { Request, Response } from "express";
import Order, { IOrder } from "../model/orderModel";
import Cart from "../model/cartModel";
import mongoose from "mongoose";

interface User {
  eventId: number;
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: string;
  location?: {
    coordinates: [number, number];
  };
}

interface CustomRequest extends Request {
  user?: User;
}

//  create an order
export const orderProduct = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res.status(404).json({ message: "User's cart not found" });
    }
    if (userCart.total_price < 100) {
      return res.status(401).json({ error: "Cart Total price must be greater than 100" });
    }
    const newOrder: IOrder = new Order({
      userId,
      products: userCart.products,
      total_price: userCart.total_price,
    });
    const savedOrder = await newOrder.save();
    userCart.products = [];
    userCart.total_price = 0;
    await userCart.save();

    // respond with the saved Order
    res.status(200).json(savedOrder);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  get the users orders history
export const getOrders = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const purchases = await Order.find({ userId }).populate("products.product");
    if (!purchases) {
      return res.status(400).json({ message: "No Orders" });
    }
    res.status(200).json({ purchases });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
