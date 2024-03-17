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
exports.isAdmin = exports.verifyAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const verifyAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ error: "JWT must be provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc=");
        console.log("Decoded Token:", decoded); // Log decoded token object
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid token" });
        }
        const user = yield userModel_1.default.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Include user object in the request object
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Unauthorized token" });
    }
});
exports.verifyAuth = verifyAuth;
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "Admin") {
        next();
    }
    else {
        return res.status(403).json({ message: "Forbidden: Only admin can perform this action" });
    }
};
exports.isAdmin = isAdmin;
