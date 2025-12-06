import crypto from "crypto";
import { env } from "../Config/env.config.ts";

// Models
import User from "./../Models/user.model.ts";

// Utils
import { hashPassword, comparePassword } from "../Utils/password.utils.ts";
import {
  generateToken,
  clearCookie,
  verifyToken,
} from "../Utils/generateToken.utils.ts";
import { generateOTPandSendVerificationEmail } from "../Utils/generateOTPandSendVerificationEmail.utils.ts";
import { sendEmail } from "../Utils/sendEmail.ts";

// Lib
import { passwordResetTemplate } from "../Lib/emailTemplates.lib.ts";

// Types
import type { Request, Response } from "express";

// Public routes
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, phone, password, role, address } = req.body;

  try {
    // Prevent self-registering as Admin (Security)
    const finalRole = role === "admin" ? "user" : role || "user";

    //  Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email already in use",
      });
    }

    //  Hash password
    const hashedPassword = await hashPassword(password);

    //  Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: finalRole,
      address,
    });

    //  Generate JWT token
    generateToken(user, res);

    //  Remove password before sending response
    const { password: _, ...userData } = user.toObject();

    // Success logic here
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { adminSecret } = req.body;

    if (!adminSecret) {
      return res.status(400).json({
        status: "fail",
        message: "Admin secret is required",
      });
    }

    if (adminSecret !== env.ADMIN_MASTER_KEY) {
      return res.status(403).json({
        status: "fail",
        message: "Unauthorized",
      });
    }

    const { name, email, phone, password, address } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const admin = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
      address,
    });

    generateToken(admin, res);

    //  Remove password before sending response
    const { password: _, ...adminData } = admin.toObject();

    return res.status(201).json({
      status: "success",
      message: "Admin created successfully",
      data: adminData,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    // Ensure password exists
    if (!user.password) {
      return res
        .status(500)
        .json({ status: "fail", message: "User password not set" });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // ✅ Generate token & set cookie
    generateToken(user, res);

    // ✅ Return user info (without password) and token
    const { password: _, ...userData } = user.toObject();

    // Success logic here
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const protect = async (req: Request, res: Response, next: Function) => {
  const token = req.cookies?.token || "";

  try {
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Authentication required",
      });
    }

    const decoded = verifyToken(token) as { id: string };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User no longer exists",
      });
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: Invalid token",
    });
  }
};

export const authorize =
  (...role: string[]) =>
  (req: Request, res: Response, next: Function) => {
    if (!req.user || !role.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action!",
      });
    }

    next();
  };

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    // Success logic here
    res.status(200).json({
      status: "success",
      message: "",
    });
  } catch (error) {}
};

// Verification
export const verifyEmail = async (req: Request, res: Response) => {
  const { otp } = req.body;
  const { user } = req;

  try {
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User no longer exists",
      });
    }

    // Verify OTP
    const isMatch = String(user?.emailVerificationOTP!) === String(otp);

    if (!isMatch) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid OTP",
      });
    }

    // Check OTP expiration
    if (new Date() > user?.emailVerificationOTPExpiresAt!) {
      return res.status(400).json({
        status: "fail",
        message: "Expired Verification Code",
      });
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
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Error verifying OTP",
    });
  }
};

export const sendEmailOtp = async (req: Request, res: Response) => {
  const { user } = req;

  try {
    await generateOTPandSendVerificationEmail(user);

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Email with OTP sent successfully",
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Error sending email",
    });
  }
};

export const verifyPhone = async (req: Request, res: Response) => {
  try {
    // Success logic here
    res.status(200).json({
      status: "success",
      message: "",
    });
  } catch (error) {}
};

export const sendPhoneOtp = async (req: Request, res: Response) => {
  try {
    // Success logic here
    res.status(200).json({
      status: "success",
      message: "",
    });
  } catch (error) {}
};

// Password reset
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "fail",
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email });

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
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ status: "fail", message: "Reset token is missing" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid or expired token",
      });
    }

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
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Logout
export const logoutUser = async (req: Request, res: Response) => {
  try {
    // Clear the cookie
    clearCookie(res);

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while logging out",
    });
  }
};
