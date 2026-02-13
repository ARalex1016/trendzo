import type { Request, Response } from "express";

// Service
import { UserService } from "../Services/user.service.ts";

// Utils
import AppError from "../Utils/AppError.ts";

// -----------------------------------
// GET MY PROFILE
// -----------------------------------
export const getMyProfile = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Not authenticated", 401);

  const user = await UserService.getMyProfile(req.user._id);

  res.status(200).json({
    status: "success",
    data: user,
  });
};

// -----------------------------------
// UPDATE PROFILE
// -----------------------------------
export const updateProfile = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Not authenticated", 401);

  const updatedUser = await UserService.updateProfile(req.user._id, req.body);

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: updatedUser,
  });
};

// -----------------------------------
// ADMIN: GET ALL USERS
// -----------------------------------
export const getAllUsers = async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);

  res.status(200).json({
    status: "success",
    meta: result.meta,
    data: result.users,
  });
};

// -----------------------------------
// ADMIN: DELETE USER
// -----------------------------------
export const deleteUser = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Not authenticated", 401);

  await UserService.deleteUser(req.user._id, req.targetUser);

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
};
