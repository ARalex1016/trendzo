import { Types } from "mongoose";

// Repositories
import { ReviewRepository } from "./../Repositories/review.repository.ts";

// Utils
import AppError from "./../Utils/AppError.ts";

interface CreateReviewDTO {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  rating: number;
  comment?: string;
  images?: string[];
  orderId?: Types.ObjectId;
}

export const ReviewService = {
  async createReview(data: CreateReviewDTO) {
    const existing = await ReviewRepository.findByUserAndProduct(
      data.userId,
      data.productId
    );

    if (existing) {
      throw new AppError("You have already reviewed this product", 400);
    }

    return ReviewRepository.create({
      user: data.userId,
      product: data.productId,
      rating: data.rating,
      status: "pending",

      ...(data.comment && { comment: data.comment }),
      ...(data.images && { images: data.images }),
      ...(data.orderId && { order: data.orderId }),
    });
  },

  async getProductReviews(productId: Types.ObjectId) {
    return ReviewRepository.findByProduct(productId);
  },

  async getAllReviews() {
    return ReviewRepository.findAll();
  },

  async updateReviewStatus(
    reviewId: Types.ObjectId,
    status: "approved" | "rejected"
  ) {
    const updated = await ReviewRepository.updateStatus(reviewId, status);

    if (!updated) {
      throw new AppError("Review not found", 404);
    }

    return updated;
  },

  async deleteReview(reviewId: Types.ObjectId) {
    const deleted = await ReviewRepository.delete(reviewId);

    if (!deleted) {
      throw new AppError("Review not found", 404);
    }

    return deleted;
  },
};
