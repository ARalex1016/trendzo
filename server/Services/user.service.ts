import { Types } from "mongoose";
import { UserRepository } from "../Repositories/user.repository.ts";

// Utils
import ApiFeatures from "../Utils/apiFeatures/ApiFeatures.ts";
import AppError from "../Utils/AppError.ts";

export const UserService = {
  // -----------------------------------
  // SELF: My Profile
  // -----------------------------------
  async getMyProfile(userId: Types.ObjectId) {
    const user = await UserRepository.getUserById(userId);
    if (!user) throw new AppError("User not found", 404);

    return user;
  },

  async updateProfile(userId: Types.ObjectId, payload: any) {
    const allowedFields = ["name", "phone", "address"];

    const updates: Record<string, unknown> = {};
    Object.keys(payload).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = payload[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      throw new AppError("No valid fields provided for update", 400);
    }

    const updatedUser = await UserRepository.updateUser(userId, updates);
    if (!updatedUser) throw new AppError("User not found", 404);

    return updatedUser;
  },

  // -----------------------------------
  // ADMIN: Get All Users
  // -----------------------------------
  async getAllUsers(queryParams: any) {
    const baseQuery = UserRepository.queryUsers();

    const features = new ApiFeatures(baseQuery, queryParams)
      .filter()
      .sort()
      .limitFields();

    await features.paginate();

    const users = await features.query;

    return {
      users,
      meta: features.meta,
    };
  },

  // -----------------------------------
  // ADMIN: Delete User
  // -----------------------------------
  async deleteUser(authUserId: Types.ObjectId, targetUser: any) {
    if (!targetUser) throw new AppError("User not found", 404);

    // Prevent self-deletion
    if (authUserId.equals(targetUser._id)) {
      throw new AppError("You cannot delete your own account", 400);
    }

    await UserRepository.deleteUserById(targetUser._id);

    return true;
  },
};
