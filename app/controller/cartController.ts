import { Request, Response } from "express";
import Cart, { ICart } from "../model/cartModel";
import Product from "../model/productModel";
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
//  add product to the cart
export const addCart = async (req: CustomRequest, res: Response) => {
  try {
    const { product, quantity, price } = req.body;
    const userId = req.user?._id;

    let userCart: ICart | null = await Cart.findOne({ userId });

    if (!userCart) {
      userCart = new Cart({
        userId,
        products: [{ product, quantity, price }],
        total_price: 0,
      });
    } else {
      const existingProductIndex = userCart.products.findIndex(
        (item) => item.product.toString() === product.toString(),
      );

      if (existingProductIndex !== -1) {
        userCart.products[existingProductIndex].quantity += 1;
      } else {
        userCart.products.push({ product, quantity, price });
      }
    }

    const products = await Product.find({
      _id: { $in: userCart.products.map((p) => p.product) },
    });

    userCart.total_price = products.reduce((total, product) => {
      const cartProduct = userCart?.products.find((p) => p.product.toString() === product._id.toString());
      const productPrice = product.price || 0; // Ensure product price is defined
      return total + parseFloat(productPrice.toString()) * (cartProduct?.quantity || 0);
    }, 0);

    const savedCart = await userCart.save();

    res.status(200).json({ userCart: savedCart });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({ error: "Internal Server Error" });
  }
};

// get cart detail
export const getCart = async (req: CustomRequest, res: Response) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?._id;
    const userCart = await Cart.findOne({ userId }).populate("products.product");
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found for the User" });
    }
    res.status(200).json({ userCart, userRole, userId });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  cart increament
export const cartIncreament = async (req: CustomRequest, res: Response) => {
  const { product } = req.body;

  try {
    const userId = req.user?._id;
    let userCart = await Cart.findOne({ userId });

    if (userCart) {
      const existingProduct = userCart.products.find((item) => item.product.toString() === product.toString());

      if (existingProduct) {
        existingProduct.quantity += 1;
        userCart = await userCart.save();
        await updateCartTotal(userCart);
        res.status(200).json(userCart);
      } else {
        res.status(404).json({ message: "Product not found in cart" });
      }
    } else {
      res.status(401).json({ message: "Cart not found for the user" });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// cart decreament
export const cartDecreament = async (req: CustomRequest, res: Response) => {
  try {
    const { product } = req.body;
    const userId = req.user?._id;
    let userCart = await Cart.findOne({ userId });
    if (userCart) {
      const existingProduct = userCart.products.find((item) => item.product.toString() === product.toString());
      if (existingProduct) {
        if (existingProduct.quantity <= 1) {
          return res.status(400).json({ message: "Product cannot be less than 1 try removing instead" });
        } else {
          existingProduct.quantity -= 1;
          userCart = await userCart.save();
          await updateCartTotal(userCart);
          res.status(200).json(userCart);
        }
      } else {
        res.status(404).json({ error: "Product Not found" });
      }
    } else {
      res.status(404).json({ error: "No cart exists for the user" });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  remove the product from the cart
export const removeProduct = async (req: CustomRequest, res: Response) => {
  const { product } = req.body;

  try {
    const userId = req.user?._id;
    let userCart = await Cart.findOne({ userId });

    if (userCart) {
      const productIndex = userCart.products.findIndex((item) => item.product.toString() === product.toString());

      if (productIndex !== -1) {
        userCart.products.splice(productIndex, 1);
        await updateCartTotal(userCart);

        userCart = await userCart.save();
        res.status(200).json(userCart);
      } else {
        res.status(404).json({ error: "Product not found in the cart" });
      }
    } else {
      res.status(404).json({ error: "Cart not found for the given user" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to update the total price of the cart
const updateCartTotal = async (userCart: ICart) => {
  try {
    const products = await Product.find({
      _id: { $in: userCart.products.map((p: { product: mongoose.Types.ObjectId }) => p.product) },
    });

    userCart.total_price = products.reduce((total, product) => {
      const cartProduct = userCart.products.find((p) => p.product.toString() === product._id.toString());
      const productPrice = product.price || 0; // Ensure product price is defined
      return total + parseFloat(productPrice.toString()) * (cartProduct?.quantity || 0);
    }, 0);

    await userCart.save();
  } catch (error) {
    console.error("Error updating cart total:", error);
  }
};
