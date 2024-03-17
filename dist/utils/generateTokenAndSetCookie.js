"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenAndSetCookie = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokenAndSetCookie = (userId, userName, userEmail, userRole, res) => {
    const token = jsonwebtoken_1.default.sign({ userId, userName, userEmail, userRole }, "MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc=", {
        expiresIn: "15d",
    });
    console.log("Received Token", token);
    res.cookie("jwt", token, {
        maxAge: 15 * 60 * 60 * 24 * 1000, // MS
        httpOnly: false, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    });
};
exports.generateTokenAndSetCookie = generateTokenAndSetCookie;
