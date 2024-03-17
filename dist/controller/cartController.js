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
exports.removeProduct = exports.cartDecreament = exports.cartIncreament = exports.getCart = exports.addCart = void 0;
const cartModel_1 = __importDefault(require("../model/cartModel"));
const productModel_1 = __importDefault(require("../model/productModel"));
//  add product to the cart
const addCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { product, quantity, price } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        let userCart = yield cartModel_1.default.findOne({ userId });
        if (!userCart) {
            userCart = new cartModel_1.default({
                userId,
                products: [{ product, quantity, price }],
                total_price: 0,
            });
        }
        else {
            const existingProductIndex = userCart.products.findIndex((item) => item.product.toString() === product.toString());
            if (existingProductIndex !== -1) {
                userCart.products[existingProductIndex].quantity += 1;
            }
            else {
                userCart.products.push({ product, quantity, price });
            }
        }
        const products = yield productModel_1.default.find({
            _id: { $in: userCart.products.map((p) => p.product) },
        });
        userCart.total_price = products.reduce((total, product) => {
            const cartProduct = userCart === null || userCart === void 0 ? void 0 : userCart.products.find((p) => p.product.toString() === product._id.toString());
            const productPrice = product.price || 0; // Ensure product price is defined
            return total + parseFloat(productPrice.toString()) * ((cartProduct === null || cartProduct === void 0 ? void 0 : cartProduct.quantity) || 0);
        }, 0);
        const savedCart = yield userCart.save();
        res.status(200).json({ userCart: savedCart });
    }
    catch (error) {
        console.log("Error:", error);
        res.status(400).json({ error: "Internal Server Error" });
    }
});
exports.addCart = addCart;
// get cart detail
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
        const userCart = yield cartModel_1.default.findOne({ userId }).populate("products.product");
        if (!userCart) {
            return res.status(404).json({ message: "Cart not found for the User" });
        }
        res.status(200).json({ userCart, userRole, userId });
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getCart = getCart;
//  cart increament
const cartIncreament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { product } = req.body;
    try {
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
        let userCart = yield cartModel_1.default.findOne({ userId });
        if (userCart) {
            const existingProduct = userCart.products.find((item) => item.product.toString() === product.toString());
            if (existingProduct) {
                existingProduct.quantity += 1;
                userCart = yield userCart.save();
                yield updateCartTotal(userCart);
                res.status(200).json(userCart);
            }
            else {
                res.status(404).json({ message: "Product not found in cart" });
            }
        }
        else {
            res.status(401).json({ message: "Cart not found for the user" });
        }
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.cartIncreament = cartIncreament;
// cart decreament
const cartDecreament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const { product } = req.body;
        const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e._id;
        let userCart = yield cartModel_1.default.findOne({ userId });
        if (userCart) {
            const existingProduct = userCart.products.find((item) => item.product.toString() === product.toString());
            if (existingProduct) {
                if (existingProduct.quantity <= 1) {
                    return res.status(400).json({ message: "Product cannot be less than 1 try removing instead" });
                }
                else {
                    existingProduct.quantity -= 1;
                    userCart = yield userCart.save();
                    yield updateCartTotal(userCart);
                    res.status(200).json(userCart);
                }
            }
            else {
                res.status(404).json({ error: "Product Not found" });
            }
        }
        else {
            res.status(404).json({ error: "No cart exists for the user" });
        }
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.cartDecreament = cartDecreament;
//  remove the product from the cart
const removeProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const { product } = req.body;
    try {
        const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f._id;
        let userCart = yield cartModel_1.default.findOne({ userId });
        if (userCart) {
            const productIndex = userCart.products.findIndex((item) => item.product.toString() === product.toString());
            if (productIndex !== -1) {
                userCart.products.splice(productIndex, 1);
                yield updateCartTotal(userCart);
                userCart = yield userCart.save();
                res.status(200).json(userCart);
            }
            else {
                res.status(404).json({ error: "Product not found in the cart" });
            }
        }
        else {
            res.status(404).json({ error: "Cart not found for the given user" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.removeProduct = removeProduct;
// Function to update the total price of the cart
const updateCartTotal = (userCart) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModel_1.default.find({
            _id: { $in: userCart.products.map((p) => p.product) },
        });
        userCart.total_price = products.reduce((total, product) => {
            const cartProduct = userCart.products.find((p) => p.product.toString() === product._id.toString());
            const productPrice = product.price || 0; // Ensure product price is defined
            return total + parseFloat(productPrice.toString()) * ((cartProduct === null || cartProduct === void 0 ? void 0 : cartProduct.quantity) || 0);
        }, 0);
        yield userCart.save();
    }
    catch (error) {
        console.error("Error updating cart total:", error);
    }
});
