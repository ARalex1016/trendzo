import { Types } from "mongoose";
// Repositories
import { UserRepository } from "../Repositories/user.repository.ts";

// Services
import { ReferralService } from "./referral.service.ts";

// Utils
import { hashPassword, comparePassword } from "../Utils/password.utils.ts";
import AppError from "../Utils/AppError.ts";

export const AuthService = {
  async getUserById(userId: Types.ObjectId) {
    return UserRepository.getUserById(userId);
  },

  async getUserByEmail(email: string) {
    return UserRepository.getUserByEmail(email);
  },

  async getUserByReferralCode(referralCode: string) {
    return UserRepository.getUserByReferralCode(referralCode);
  },

  async getUserByResetToken(token: string) {
    return UserRepository.getUserByResetToken(token);
  },

  async registerUser(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: "user" | "operator";
    address?: any;
    referralCode?: string;
  }) {
    const { name, email, password, phone, role, address, referralCode } = data;

    // Check if email exists
    const existingUser = await UserRepository.getUserByEmail(email);
    if (existingUser) throw new AppError("Email already in use", 400);

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await UserRepository.createUser({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "user",
      address,
    });

    // Handle referral
    if (referralCode) {
      const inviter = await UserRepository.getUserByReferralCode(referralCode);
      if (inviter) {
        await ReferralService.createReferral(
          inviter._id,
          user._id,
          referralCode
        );
      }
    }

    return user;
  },

  async registerAdmin(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: any;
    adminSecret: string;
  }) {
    const { adminSecret, name, email, password, phone, address } = data;

    if (adminSecret !== process.env.ADMIN_MASTER_KEY)
      throw new AppError("Unauthorized", 403);

    const existingUser = await UserRepository.getUserByEmail(email);
    if (existingUser) throw new AppError("Email already exists", 400);

    const hashedPassword = await hashPassword(password);

    return UserRepository.createUser({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
      address,
    });
  },

  async loginUser(email: string, password: string) {
    const user = await UserRepository.getUserByEmail(email);
    console.log(user);

    if (!user || !user.password) throw new AppError("Invalid credentials", 401);

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new AppError("Invalid credentials", 401);

    return user;
  },

  async resetPassword(userId: Types.ObjectId, newPassword: string) {
    const hashedPassword = await hashPassword(newPassword);
    return UserRepository.updateUser(userId, { password: hashedPassword });
  },
};
