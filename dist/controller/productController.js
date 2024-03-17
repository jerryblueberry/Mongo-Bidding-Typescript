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
exports.updateProduct = exports.getStock = exports.getSpecificProduct = exports.getProducts = void 0;
const productModel_1 = __importDefault(require("../model/productModel")); // Import Product model and IProduct interface
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { search, sort, filter } = req.query;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        // const userLocation = req.user?.location;
        let products = yield productModel_1.default.find();
        const searchProducts = (products, search) => {
            return search
                ? products.filter((product) => {
                    var _a, _b;
                    return ((_a = product.title) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search.toLowerCase())) ||
                        ((_b = product.description) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(search.toLowerCase()));
                })
                : products;
        };
        const sortProducts = (products, sort) => {
            if (sort === "price-low") {
                return [...products].sort((a, b) => { var _a, _b; return ((_a = a.price) !== null && _a !== void 0 ? _a : 0) - ((_b = b.price) !== null && _b !== void 0 ? _b : 0); }); // Sort in ascending order for 'price-low'
            }
            else if (sort === "price-high") {
                return [...products].sort((a, b) => { var _a, _b; return ((_a = b.price) !== null && _a !== void 0 ? _a : 0) - ((_b = a.price) !== null && _b !== void 0 ? _b : 0); }); // Sort in descending order for 'price-high'
            }
            else {
                return products; // Return original products array if sort is not specified or is invalid
            }
        };
        const filterProducts = (products, filter) => {
            return filter ? products.filter((product) => { var _a; return ((_a = product.category) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === filter.toLowerCase(); }) : products;
        };
        products = searchProducts(products, search);
        products = sortProducts(products, sort);
        products = filterProducts(products, filter);
        if (products.length === 0) {
            res.status(404).json({ message: "Product not available" });
        }
        res.status(200).json({ products, userId, userRole });
        // res.render("products", { products, userId, userRole, userLocation });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getProducts = getProducts;
//  get specific products
const getSpecificProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
        const userRole = (_d = req.user) === null || _d === void 0 ? void 0 : _d.role;
        const productId = req.params.productId;
        const product = yield productModel_1.default.findById(productId).populate("store");
        if (!product) {
            return res.status(404).json({ message: "Product Not found" });
        }
        res.status(200).json({ product, userId, userRole });
    }
    catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getSpecificProduct = getSpecificProduct;
//  get the product stock  for the product bellow 5 units in quantity
const getStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e._id;
        const outOfStock = yield productModel_1.default.find({ quantity: { $lt: 7 } });
        res.status(200).json({ outOfStock, userId });
    }
    catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getStock = getStock;
//  update all fields in the product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, price, quantity, category, rating } = req.body;
        const productId = req.params._id;
        const updatedProduct = yield productModel_1.default.findByIdAndUpdate(productId, {
            title,
            description,
            price,
            quantity,
            category,
            rating,
        }, {
            new: true,
        });
        res.status(200).json({ updatedProduct, message: "product Updated Successfully" });
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateProduct = updateProduct;
