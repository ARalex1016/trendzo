import { Router } from "express";

// Controllers
import {
  registerUser,
  registerAdmin,
  loginUser,
  refreshAccessToken,
  verifyEmail,
  sendEmailOtp,
  verifyPhone,
  sendPhoneOtp,
  forgotPassword,
  resetPassword,
  logoutUser,
} from "../Controllers/auth.controller.ts";

// Middleware
import { protect } from "../Controllers/auth.controller.ts";
import { validateRequest } from "../Middleware/validateRequest.middleware.ts";

// Validation Schemas
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
} from "../Validations/user.validator.ts";

const router = Router();

// Public routes
router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/register-admin", validateRequest(registerSchema), registerAdmin);
router.post("/login", validateRequest(loginSchema), loginUser);
router.post("/refresh-token", refreshAccessToken);

// Verification
router.post("/verify-email", protect, verifyEmail);
router.post("/send-email-verification", protect, sendEmailOtp);
router.post("/verify-phone", verifyPhone);
router.post("/send-phone-otp", sendPhoneOtp);

// Password reset
router.post("/forgot-password", forgotPassword);
router.post(
  "/reset-password/:token",
  validateRequest(resetPasswordSchema),
  resetPassword
);

// Logout
router.post("/logout", protect, logoutUser);

export default router;
