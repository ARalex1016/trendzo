import { Types } from "mongoose";
import type { Request, Response } from "express";
import crypto from "crypto";

// Services
import { AuthService } from "../Services/auth.service.ts";

// Utils
import { generateToken, clearCookie } from "../Utils/generateToken.utils.ts";
import { asyncHandler } from "../Utils/asyncHandler.ts";
import { verifyToken } from "../Utils/generateToken.utils.ts";
import { hashPassword } from "../Utils/password.utils.ts";
import { generateOTPandSendVerificationEmail } from "../Utils/generateOTPandSendVerificationEmail.utils.ts";
import { sendEmail } from "../Utils/sendEmail.ts";
import AppError from "../Utils/AppError.ts";

// Lib
import { passwordResetTemplate } from "../Lib/emailTemplates.lib.ts";

// Register User
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await AuthService.registerUser(req.body);

    generateToken(user, res);

    const { password, ...userData } = user.toObject();

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: userData,
    });
  }
);

// Register Admin
export const registerAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const admin = await AuthService.registerAdmin(req.body);

    generateToken(admin, res);

    const { password, ...adminData } = admin.toObject();

    res.status(201).json({
      status: "success",
      message: "Admin created successfully",
      data: adminData,
    });
  }
);

// Login
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await AuthService.loginUser(email, password);

  generateToken(user, res);
  const { password: _, ...userData } = user.toObject();

  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: userData,
  });
});

// Logout
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  clearCookie(res);
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
});

export const protect = asyncHandler(
  async (req: Request, res: Response, next: Function) => {
    const token = req.cookies?.token || "";

    if (!token) throw new AppError("Authentication required", 401);

    const decoded = verifyToken(token) as { id: string };

    const user = await AuthService.getUserById(new Types.ObjectId(decoded.id));

    if (!user) throw new AppError("User not found", 401);

    // Attach user to request object
    req.user = user;

    next();
  }
);

export const authorize =
  (...role: string[]) =>
  (req: Request, res: Response, next: Function) => {
    if (!req.user || !role.includes(req.user.role)) {
      throw new AppError(
        "You do not have permission to perform this action!",
        403
      );
    }

    next();
  };

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // Success logic here
      res.status(200).json({
        status: "success",
        message: "",
      });
    } catch (error) {}
  }
);

// Password reset
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) throw new AppError("Email is required", 400);

    const user = await AuthService.getUserByEmail(email);

    // Always return same response
    res.status(200).json({
      message: "If this email exists, we have sent a reset link.",
    });

    if (!user) return;

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    sendEmail(
      user.email,
      "Reset your password",
      passwordResetTemplate(resetUrl, user.name),
      "Password Reset"
    );
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token) throw new AppError("Reset token is missing", 400);

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await AuthService.getUserByResetToken(hashedToken);

    if (!user) throw new AppError("Invalid or expired token", 400);

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    // ✅ Generate token & set cookie
    generateToken(user, res);

    // ✅ Return user info (without password) and token
    const { password: _, ...userData } = user.toObject();

    // Success logic here
    return res.status(200).json({
      status: "success",
      message: "Password reset successfully",
      data: userData,
    });
  }
);

// Verification
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { otp } = req.body;
  const user = req.user!;

  // Verify OTP
  const isMatch = String(user?.emailVerificationOTP!) === String(otp);

  if (!isMatch) throw new AppError("Invalid OTP", 400);

  // Check OTP expiration
  if (new Date() > user?.emailVerificationOTPExpiresAt!) {
    throw new AppError("Expired Verification Code", 400);
  }

  // Mark user as verified
  user.isEmailVerified = true;
  user.emailVerificationOTP = undefined;
  user.emailVerificationOTPExpiresAt = undefined;
  await user.save();

  // Success logic here
  res.status(200).json({
    status: "success",
    message: "OTP verified successfully",
    data: user,
  });
});

export const sendEmailOtp = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    await generateOTPandSendVerificationEmail(user);

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Email with OTP sent successfully",
    });
  }
);

export const verifyPhone = asyncHandler(async (req: Request, res: Response) => {
  // Success logic here
  res.status(200).json({
    status: "success",
    message: "",
  });
});

export const sendPhoneOtp = asyncHandler(
  async (req: Request, res: Response) => {
    // Success logic here
    res.status(200).json({
      status: "success",
      message: "",
    });
  }
);
