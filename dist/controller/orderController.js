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
exports.getOrders = exports.orderProduct = void 0;
const orderModel_1 = __importDefault(require("../model/orderModel"));
const cartModel_1 = __importDefault(require("../model/cartModel"));
//  create an order
const orderProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const userCart = yield cartModel_1.default.findOne({ userId });
        if (!userCart) {
            return res.status(404).json({ message: "User's cart not found" });
        }
        if (userCart.total_price < 100) {
            return res.status(401).json({ error: "Cart Total price must be greater than 100" });
        }
        const newOrder = new orderModel_1.default({
            userId,
            products: userCart.products,
            total_price: userCart.total_price,
        });
        const savedOrder = yield newOrder.save();
        userCart.products = [];
        userCart.total_price = 0;
        yield userCart.save();
        // respond with the saved Order
        res.status(200).json(savedOrder);
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.orderProduct = orderProduct;
//  get the users orders history
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        const purchases = yield orderModel_1.default.find({ userId }).populate("products.product");
        if (!purchases) {
            return res.status(400).json({ message: "No Orders" });
        }
        res.status(200).json({ purchases });
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getOrders = getOrders;
