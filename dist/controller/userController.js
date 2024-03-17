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
exports.Login = exports.SignUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// import jwt from "jsonwebtoken";
const userModel_1 = __importDefault(require("../model/userModel"));
const generateTokenAndSetCookie_1 = require("../utils/generateTokenAndSetCookie");
const saltRounds = 10;
const SignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role, longitude, latitude } = req.body;
        console.log("NAme", name);
        console.log("email", email);
        const profileImage = req.file ? req.file.path : "";
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const newUser = new userModel_1.default({
            name,
            email,
            password: hashedPassword,
            role,
            profileImage: profileImage,
            location: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
        });
        yield newUser.save();
        res.status(200).json({ message: "User Created Successfully" });
    }
    catch (error) {
        console.log("Error Occurred", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.SignUp = SignUp;
//  for login endpoint
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: "Password Didnot match" });
        }
        (0, generateTokenAndSetCookie_1.generateTokenAndSetCookie)(user._id, (_a = user.name) !== null && _a !== void 0 ? _a : "", user.email, user.role, res);
        res.status(200).json({ message: "login successfull" });
    }
    catch (error) {
        console.log("Error Ocurred", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.Login = Login;
