import { Types } from "mongoose";

// Models
import User from "../Models/user.model.ts";

// Types
import type { IUser, IAddress } from "../Models/user.model.ts";
import type {
  AddAddressInput,
  UpdateAddressInput,
} from "../Validations/address.validation.ts";

export const UserRepository = {
  // -----------------------------------
  // BASIC GETTERS
  // -----------------------------------
  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select("+password");
  },

  async getUserById(userId: Types.ObjectId): Promise<IUser> {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }
    return user;
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
  async changeDefaultAddress(
    userId: Types.ObjectId,
    addressId: Types.ObjectId,
  ) {
    const user = await this.getUserById(userId);

    const address = user.addresses.find((addr) => addr._id.equals(addressId));

    if (!address) {
      throw new Error("Address not found");
    }

    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.equals(addressId);
    });

    await user.save();

    return user;
  },

  async updateUser(userId: Types.ObjectId, update: Partial<IUser>) {
    return User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
      context: "query",
    }).select("-password");
  },

  async updateAddress(
    userId: Types.ObjectId,
    addressId: Types.ObjectId,
    addressData: UpdateAddressInput,
  ) {
    const user = await this.getUserById(userId);

    const address = user.addresses.find((addr) => addr._id.equals(addressId));

    if (!address) {
      throw new Error("Address not found");
    }

    if (addressData.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    Object.assign(address, addressData);

    await user.save();

    return user;
  },

  async addAddress(userId: Types.ObjectId, addressData: AddAddressInput) {
    const user = await this.getUserById(userId);

    if (addressData.isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    user.addresses.push(addressData as IAddress);

    await user.save();

    return user;
  },

  // -----------------------------------
  // DELETE
  // -----------------------------------
  async deleteUserById(userId: Types.ObjectId) {
    return User.findByIdAndDelete(userId);
  },

  async removeAddress(userId: Types.ObjectId, addressId: Types.ObjectId) {
    const user = await this.getUserById(userId);

    const addressExists = user.addresses.some(
      (addr) => addr._id.toString() === addressId.toString(),
    );

    if (!addressExists) {
      throw new Error("Address not found");
    }

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId.toString(),
    );

    await user.save();

    return user;
  },

  // -----------------------------------
  // QUERY (for Admin)
  // -----------------------------------
  queryUsers() {
    return User.find();
  },
};
