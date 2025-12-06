import type { Request, Response } from "express";
import type { IUser } from "../Models/user.model.ts";

// Models
import User from "../Models/user.model.ts";

// Utils
import ApiFeatures from "../Utils/apiFeatures/ApiFeatures.ts";

// User profile
export const getMyProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  // Success logic here
  res.status(200).json({
    status: "success",
    message: "",
    data: req.user,
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      message: "User not authenticated",
    });
  }

  try {
    // Define allowed fields to update
    const allowedUpdates: (keyof IUser)[] = ["name", "phone", "address"];
    const updates: Partial<IUser> = {};

    // Loop over request body and pick only allowed fields
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key as keyof IUser)) {
        // @ts-ignore
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "No valid fields provided for update",
      });
    }

    // Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true, context: "query" }
    ).select("-password -resetPasswordToken -resetPasswordExpiresAt");

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Admin: Manage users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const features = new ApiFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields();

    await features.paginate();

    const users = await features.query;

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "",
      meta: features.meta,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const targetUser = req.targetUser;

    if (!targetUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Optional: Prevent self-deletion
    if (req.user?._id.equals(targetUser._id)) {
      return res.status(400).json({
        status: "fail",
        message: "You cannot delete your own account",
      });
    }

    await targetUser.deleteOne();

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
