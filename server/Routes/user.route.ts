import express from "express";

// Controllers
import {
  getMyProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
} from "../Controllers/user.controller.ts";

// Middlewares
import { authorize, protect } from "../Controllers/auth.controller.ts";
import { userIdParamHandler } from "../Middleware/param.middleware.ts";

const router = express.Router();

// Param Handlers
router.param("userId", userIdParamHandler);

// User profile
router.get("/me", protect, getMyProfile);
router.patch("/update-profile", protect, updateProfile);

// Admin: Manage users
router.get("/", protect, authorize("admin"), getAllUsers);
router.delete("/:userId", protect, authorize("admin"), deleteUser);

export default router;
