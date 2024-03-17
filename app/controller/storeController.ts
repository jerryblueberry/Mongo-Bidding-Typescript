import { Request, Response } from "express";

import Store, { IStore } from "../model/storeModel";
import Product, { IProduct } from "../model/productModel";
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

export const createStore = async (req: CustomRequest, res: Response): Promise<void> => {
  const userId = req.user?._id;
  const logo = req.file ? req.file.path : null;
  try {
    const { name, type, latitude, longitude } = req.body;

    const existingUser = await Store.findOne({ userId });

    if (existingUser) {
      res.status(401).json({ message: "User Id already in use" });
    }
    const newStore: IStore = new Store({
      name,
      type,
      userId,
      logo: logo || null,
      location: {
        coordinates: [longitude, latitude],
      },
    });
    await newStore.save();
    res.status(200).json({ message: "Store added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  get all the stores
//  left to add the filter and searching

export const getAllStore = async (req: Request, res: Response) => {
  try {
    const stores = await Store.find();
    res.status(200).json({ stores });
  } catch (error) {
    res.status(200).json({ error: "Internal Server Error" });
  }
};

//  endpoint to add product from the store

export const addProductToStore = async (req: CustomRequest, res: Response) => {
  const userId = req.user?._id;
  const storeId = req.params._id;

  try {
    const { title, description, rating, price, category, type, quantity, biddingStartTime, biddingEndTime } = req.body;
    const imageFiles = (req.files as Express.Multer.File[])?.map((file) => file.path) || null; // Type assertion for files

    const isBidding: boolean = type === "General" ? false : true;

    const newProduct: IProduct = new Product({
      title,
      description,
      rating,
      category,
      price,
      isBidding,
      type,
      biddingStartTime: isBidding ? biddingStartTime : undefined,
      biddingEndTime: isBidding ? biddingEndTime : undefined,
      bids: [],
      quantity,
      image: imageFiles,
      store: storeId,
    });

    const savedProduct: IProduct = await newProduct.save();
    console.log(userId);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// endpoint to get the product of specific store
export const getProductsByStore = async (req: CustomRequest, res: Response) => {
  try {
    const storeId = req.params._id;
    const userId = req.user?._id;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: "Store Not found" });
    }
    const products = await Product.find({ store: storeId }).populate("store");
    res.status(200).json({ store, products, userId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// endpoint to get the stores by its categories
export const getStoresByCategory = async (req: CustomRequest, res: Response) => {
  try {
    const type = req.params.type;
    const userId = req.user?._id;
    const longitude = req.user?.location?.coordinates[0]; // Get user location
    const latitude = req.user?.location?.coordinates[1]; // Get user location
    console.log("Longitude", longitude);
    console.log("latitude", latitude);

    const stores = await Store.find({ type });
    res.status(200).json({ stores, userId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// endpoint to find the store with the aggregration pipeline
// export const getStoresWithinRadius = async (req: CustomRequest, res: Response) => {
//   const userId = req.user?._id;
//   const userRole = req.user?.role;
//   const { search } = req.query;

//   try {
//     // Extract latitude and longitude from request query
//     const latitude = req.user?.location?.coordinates[1];
//     const longitude = req.user?.location?.coordinates[0];

//     // Ensure latitude and longitude are provided
//     if (!latitude || !longitude) {
//       return res.status(400).json({ error: "Latitude and longitude are required" });
//     }

//     // Define the maximum distance (1KM) in meters
//     const maxDistance = 100000;

//     // Perform aggregation pipeline to find stores within 1KM radius of the provided location
//     let stores: IStore[] = await Store.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: "Point",
//             coordinates: [longitude, latitude],
//           },
//           distanceField: "distance",
//           maxDistance: maxDistance,
//           spherical: true,
//         },
//       },
//     ]);
//     console.log(stores);

//     const searchStore = (stores: IStore[], search: string) => {
//       return search ? stores.filter((store) => store.name.toLowerCase().includes(search.toLowerCase())) : stores;
//     };

//     stores = searchStore(stores, search as string);

//     stores.forEach((store) => {
//       store.distance = store?.distance;
//       console.log(store.distance);
//     });

//     res.status(200).json({ stores, userId, userRole });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
