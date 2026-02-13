import { Types } from "mongoose";
import User, { type IUser } from "../Models/user.model.ts";

export const UserRepository = {
  // -----------------------------------
  // BASIC GETTERS
  // -----------------------------------
  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select("+password");
  },

  async getUserById(userId: Types.ObjectId): Promise<IUser | null> {
    return User.findById(userId).select("-password");
  },

  async getUserByReferralCode(referralCode: string): Promise<IUser | null> {
    return User.findOne({
      $or: [
        { referralId: referralCode },
        { displayCode: referralCode },
        { "previousDisplayCodes.code": referralCode },
      ],
    });
  },

  async getUserByResetToken(token: string): Promise<IUser | null> {
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: new Date() },
    });
  },

  // -----------------------------------
  // CREATE
  // -----------------------------------
  async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    return user.save();
  },

  // -----------------------------------
  // UPDATE
  // -----------------------------------
  async updateUser(userId: Types.ObjectId, update: Partial<IUser>) {
    return User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
      context: "query",
    }).select("-password");
  },

  // -----------------------------------
  // DELETE
  // -----------------------------------
  async deleteUserById(userId: Types.ObjectId) {
    return User.findByIdAndDelete(userId);
  },

  // -----------------------------------
  // QUERY (for Admin)
  // -----------------------------------
  queryUsers() {
    return User.find();
  },
};
