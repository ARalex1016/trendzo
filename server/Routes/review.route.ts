import express from "express";

// Controllers
import {
  createReview,
  getProductReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} from "../Controllers/review.controller.ts";

// Middlewares
import { protect, authorize } from "../Controllers/auth.controller.ts";

const router = express.Router();

// User reviews
router.post("/:productId", protect, createReview);
router.get("/:productId", getProductReviews);

// Admin moderation
router.get("/", protect, authorize("admin"), getAllReviews);
router.put(
  "/:reviewId/status",
  protect,
  authorize("admin"),
  updateReviewStatus
);
router.delete("/:reviewId", protect, authorize("admin"), deleteReview);

export default router;
