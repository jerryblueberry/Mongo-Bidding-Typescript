import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../model/userModel";

interface DecodedToken extends JwtPayload {
  userId: string; // Adjust the type to match the type of user ID in your MongoDB model
}

interface RequestWithUser extends Request {
  user?: IUser;
}

export const verifyAuth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "JWT must be provided" });
  }

  try {
    const decoded = jwt.verify(token, "MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc=") as DecodedToken;

    console.log("Decoded Token:", decoded); // Log decoded token object

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Include user object in the request object
    req.user = user;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized token" });
  }
};

export const isAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden: Only admin can perform this action" });
  }
};
