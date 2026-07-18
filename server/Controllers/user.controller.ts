import { Types } from "mongoose";
import type { Request, Response } from "express";

// Service
import { UserService } from "../Services/user.service.ts";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";
import AppError from "../Utils/AppError.ts";

// -----------------------------------
// GET MY PROFILE
// -----------------------------------
export const getMyProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Not authenticated", 401);

    const user = await UserService.getMyProfile(req.user._id);

    res.status(200).json({
      status: "success",
      data: user,
    });
  },
);

// -----------------------------------
// UPDATE PROFILE
// -----------------------------------
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Not authenticated", 401);

    const updatedUser = await UserService.updateProfile(req.user._id, req.body);

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: updatedUser,
    });
  },
);

// -----------------------------------
// User : Address Manage
// -----------------------------------
export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserService.addAddress(req.user!, req.body);

  return res.status(201).json({
    success: true,
    message: "Address added successfully.",
    data: user.addresses,
  });
});

export const updateAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const addressId = new Types.ObjectId(req.params.addressId);

    const user = await UserService.updateAddress(userId, addressId, req.body);

    return res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      data: user.addresses,
    });
  },
);

export const changeDefaultAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const addressId = new Types.ObjectId(req.params.addressId);

    const user = await UserService.changeDefaultAddress(userId, addressId);

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully.",
      data: user.addresses,
    });
  },
);

export const removeAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const addressId = new Types.ObjectId(req.params.addressId);

    const user = await UserService.removeAddress(userId, addressId);

    return res.status(200).json({
      success: true,
      message: "Address removed successfully.",
      data: user.addresses,
    });
  },
);

// -----------------------------------
// ADMIN: GET ALL USERS
// -----------------------------------
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);

  res.status(200).json({
    status: "success",
    meta: result.meta,
    data: result.users,
  });
});

// -----------------------------------
// ADMIN: DELETE USER
// -----------------------------------
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Not authenticated", 401);

  await UserService.deleteUser(req.user._id, req.targetUser);

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});
