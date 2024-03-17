"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema
const cartSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    products: [
        {
            product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 1 },
            price: { type: Number },
        },
    ],
    total_price: {
        type: Number,
        default: 0,
    },
});
exports.default = mongoose_1.default.model("Cart", cartSchema);
