import express from "express";

// Controllers
import {
  getAllCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
} from "../Controllers/category.controller.ts";

// Middleware
import { protect, authorize } from "../Controllers/auth.controller.ts";
import { categoryIdParamHandler } from "../Middleware/param.middleware.ts";

const router = express.Router();

router.param("categoryId", categoryIdParamHandler);

// Public
router.get("/", getAllCategories);

// Admin
router.post("/", protect, authorize("admin"), createCategory);
router.patch("/:categoryId", protect, authorize("admin"), updateCategory);
router.patch(
  "/:categoryId/toggle",
  protect,
  authorize("admin"),
  toggleCategoryStatus
);
router.delete("/:categoryId", protect, authorize("admin"), deleteCategory);

export default router;
