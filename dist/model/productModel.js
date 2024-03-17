"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema
const productSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    type: {
        type: String,
        enum: ["General", "Bidding"],
    },
    isBidding: {
        type: Boolean,
        default: false,
    },
    biddingStartTime: {
        type: Date,
    },
    biddingEndTime: {
        type: Date,
    },
    bids: [
        {
            bidder: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
            amount: {
                type: Number,
            },
        },
    ],
    quantity: {
        type: Number,
    },
    image: {
        type: [String],
    },
    category: {
        type: String,
    },
    store: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
});
exports.default = mongoose_1.default.model("Product", productSchema);
