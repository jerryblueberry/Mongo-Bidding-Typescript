import { Request, Response } from "express";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import User, { IUser } from "../model/userModel";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
const saltRounds = 10;

export const SignUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, longitude, latitude } = req.body;
    console.log("NAme", name);
    console.log("email", email);
    const profileImage = req.file ? req.file.path : "";

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser: IUser = new User({
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

    await newUser.save();
    res.status(200).json({ message: "User Created Successfully" });
  } catch (error) {
    console.log("Error Occurred", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  for login endpoint

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Password Didnot match" });
    }
    generateTokenAndSetCookie(user._id, user.name ?? "", user.email, user.role, res);
    res.status(200).json({ message: "login successfull" });
  } catch (error) {
    console.log("Error Ocurred", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
