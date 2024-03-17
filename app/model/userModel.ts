// userModel.ts

import mongoose, { Schema, Document } from "mongoose";

// Interface representing the user document
export interface IUser extends Document {
  _id: object;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "User";
  profileImage?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
}

// Define the schema
const userSchema: Schema<IUser> = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    required: true,
  },
  profileImage: {
    type: String,
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
  },
});

// Add 2dsphere index to the location field
userSchema.index({ location: "2dsphere" });

// Define the model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
