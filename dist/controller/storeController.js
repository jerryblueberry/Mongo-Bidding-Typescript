"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoresByCategory = exports.getProductsByStore = exports.addProductToStore = exports.getAllStore = exports.createStore = void 0;
const storeModel_1 = __importDefault(require("../model/storeModel"));
const productModel_1 = __importDefault(require("../model/productModel"));
const createStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const logo = req.file ? req.file.path : null;
    try {
        const { name, type, latitude, longitude } = req.body;
        const existingUser = yield storeModel_1.default.findOne({ userId });
        if (existingUser) {
            res.status(401).json({ message: "User Id already in use" });
        }
        const newStore = new storeModel_1.default({
            name,
            type,
            userId,
            logo: logo || null,
            location: {
                coordinates: [longitude, latitude],
            },
        });
        yield newStore.save();
        res.status(200).json({ message: "Store added successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createStore = createStore;
//  get all the stores
//  left to add the filter and searching
const getAllStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield storeModel_1.default.find();
        res.status(200).json({ stores });
    }
    catch (error) {
        res.status(200).json({ error: "Internal Server Error" });
    }
});
exports.getAllStore = getAllStore;
//  endpoint to add product from the store
const addProductToStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    const storeId = req.params._id;
    try {
        const { title, description, rating, price, category, type, quantity, biddingStartTime, biddingEndTime } = req.body;
        const imageFiles = ((_c = req.files) === null || _c === void 0 ? void 0 : _c.map((file) => file.path)) || null; // Type assertion for files
        const isBidding = type === "General" ? false : true;
        const newProduct = new productModel_1.default({
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
        const savedProduct = yield newProduct.save();
        console.log(userId);
        res.status(201).json(savedProduct);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.addProductToStore = addProductToStore;
// endpoint to get the product of specific store
const getProductsByStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const storeId = req.params._id;
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
        const store = yield storeModel_1.default.findById(storeId);
        if (!store) {
            return res.status(404).json({ error: "Store Not found" });
        }
        const products = yield productModel_1.default.find({ store: storeId }).populate("store");
        res.status(200).json({ store, products, userId });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getProductsByStore = getProductsByStore;
// endpoint to get the stores by its categories
const getStoresByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h, _j;
    try {
        const type = req.params.type;
        const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e._id;
        const longitude = (_g = (_f = req.user) === null || _f === void 0 ? void 0 : _f.location) === null || _g === void 0 ? void 0 : _g.coordinates[0]; // Get user location
        const latitude = (_j = (_h = req.user) === null || _h === void 0 ? void 0 : _h.location) === null || _j === void 0 ? void 0 : _j.coordinates[1]; // Get user location
        console.log("Longitude", longitude);
        console.log("latitude", latitude);
        const stores = yield storeModel_1.default.find({ type });
        res.status(200).json({ stores, userId });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getStoresByCategory = getStoresByCategory;
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
