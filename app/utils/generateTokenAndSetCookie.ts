import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (
  userId: object,
  userName: string,
  userEmail: string,
  userRole: string,

  res: Response,
) => {
  const token = jwt.sign({ userId, userName, userEmail, userRole }, "MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc=", {
    expiresIn: "15d",
  });
  console.log("Received Token", token);

  res.cookie("jwt", token, {
    maxAge: 15 * 60 * 60 * 24 * 1000, // MS
    httpOnly: false, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
  });
};
