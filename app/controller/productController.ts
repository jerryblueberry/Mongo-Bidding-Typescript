import { Request, Response } from "express";
import Product, { IProduct } from "../model/productModel"; // Import Product model and IProduct interface
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

export const getProducts = async (req: CustomRequest, res: Response): Promise<void> => {
  const { search, sort, filter } = req.query;

  try {
    const userId = req.user?._id;
    const userRole = req.user?.role;
    // const userLocation = req.user?.location;
    let products: IProduct[] = await Product.find();

    const searchProducts = (products: IProduct[], search: string | undefined): IProduct[] => {
      return search
        ? products.filter(
            (product) =>
              product.title?.toLowerCase().includes(search.toLowerCase()) ||
              product.description?.toLowerCase().includes(search.toLowerCase()),
          )
        : products;
    };

    const sortProducts = (products: IProduct[], sort: string | undefined): IProduct[] => {
      if (sort === "price-low") {
        return [...products].sort((a, b) => (a.price ?? 0) - (b.price ?? 0)); // Sort in ascending order for 'price-low'
      } else if (sort === "price-high") {
        return [...products].sort((a, b) => (b.price ?? 0) - (a.price ?? 0)); // Sort in descending order for 'price-high'
      } else {
        return products; // Return original products array if sort is not specified or is invalid
      }
    };

    const filterProducts = (products: IProduct[], filter: string | undefined): IProduct[] => {
      return filter ? products.filter((product) => product.category?.toLowerCase() === filter.toLowerCase()) : products;
    };

    products = searchProducts(products, search as string | undefined);
    products = sortProducts(products, sort as string | undefined);
    products = filterProducts(products, filter as string | undefined);

    if (products.length === 0) {
      res.status(404).json({ message: "Product not available" });
    }
    res.status(200).json({ products, userId, userRole });
    // res.render("products", { products, userId, userRole, userLocation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  get specific products
export const getSpecificProduct = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const userRole = req.user?.role;
    const productId = req.params.productId;
    const product = await Product.findById(productId).populate("store");
    if (!product) {
      return res.status(404).json({ message: "Product Not found" });
    }
    res.status(200).json({ product, userId, userRole });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  get the product stock  for the product bellow 5 units in quantity
export const getStock = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const outOfStock = await Product.find({ quantity: { $lt: 7 } });

    res.status(200).json({ outOfStock, userId });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  update all fields in the product
export const updateProduct = async (req: CustomRequest, res: Response) => {
  try {
    const { title, description, price, quantity, category, rating } = req.body;
    const productId = req.params._id;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        description,
        price,
        quantity,
        category,
        rating,
      },
      {
        new: true,
      },
    );
    res.status(200).json({ updatedProduct, message: "product Updated Successfully" });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
