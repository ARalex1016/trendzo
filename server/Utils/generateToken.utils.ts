import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../Config/env.config.ts";

import type { IUser } from "../Models/user.model.ts";
import type { Response } from "express";

export const generateToken = (user: IUser, res: Response) => {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  // ✅ Ensure expiresIn is compatible with StringValue type
  const expiresIn: `${number}${"s" | "m" | "h" | "d" | "y"}` =
    (env.JWT_EXPIRES_IN || "7d") as `${number}${"s" | "m" | "h" | "d" | "y"}`;

  // ✅ Define options separately
  const options: SignOptions = {
    expiresIn,
  };

  // Create JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    env.JWT_SECRET as jwt.Secret, // ✅ ensure correct type
    options
  );

  //  Set cookie for cross-domain frontend
  res.cookie("token", token, {
    httpOnly: true, // cannot be accessed by JS
    secure: env.NODE_ENV === "production", // true if using HTTPS
    sameSite: "none", // important for cross-domain
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/", // available on all routes
  });

  return token;
};

export const verifyToken = (token: string) => {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.verify(token, env.JWT_SECRET as jwt.Secret);
};

export const clearCookie = (res: Response) => {
  // Clear the cookie
  res.cookie("token", "", {
    httpOnly: true,
    secure: true, // true if using HTTPS
    sameSite: "none", // important for cross-domain
    expires: new Date(0), // immediately expire
    path: "/",
  });
};
