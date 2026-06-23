import { Types } from "mongoose";
import type { Request, Response, NextFunction } from "express";

// Services
import { AuthService } from "../Services/auth.service.ts";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";
import { verifyToken } from "../Utils/generateToken.utils.ts";
import AppError from "../Utils/AppError.ts";
import { env } from "../Config/env.config.ts";

// Protects, if user is not logged in
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || "";

    if (!token) throw new AppError("Authentication required", 401);

    const decoded = verifyToken(token) as { id: string };

    const user = await AuthService.getUserById(new Types.ObjectId(decoded.id));

    if (!user) throw new AppError("User not found", 401);

    // Attach user to request object
    req.user = user;

    next();
  },
);

// Just check if user is logged in or not
export const optionalAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || "";

    if (!token) {
      // No token, just continue without error
      return next();
    }

    try {
      const decoded = verifyToken(token) as { id: string };
      const user = await AuthService.getUserById(
        new Types.ObjectId(decoded.id),
      );

      if (user) {
        // Attach user if found
        req.user = user;
      }
    } catch (err) {
      // If token invalid or user not found, ignore and continue
      //   req.user = undefined;
    }

    next();
  },
);

export const authorize =
  (...role: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !role.includes(req.user.role)) {
      throw new AppError(
        "You do not have permission to perform this action!",
        403,
      );
    }

    next();
  };
