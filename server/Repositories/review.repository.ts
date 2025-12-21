import { Types } from "mongoose";
import Review, { type IReview } from "./../Models/review.model.ts";

export const ReviewRepository = {
  async create(data: Partial<IReview>) {
    return Review.create(data);
  },

  async findByUserAndProduct(
    userId: Types.ObjectId,
    productId: Types.ObjectId
  ) {
    return Review.findOne({ user: userId, product: productId });
  },

  async findByProduct(productId: Types.ObjectId) {
    return Review.find({ product: productId, status: "approved" })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });
  },

  async findAll() {
    return Review.find()
      .populate("user", "name email")
      .populate("product", "name")
      .sort({ createdAt: -1 });
  },

  async updateStatus(reviewId: Types.ObjectId, status: IReview["status"]) {
    return Review.findByIdAndUpdate(reviewId, { status }, { new: true });
  },

  async delete(reviewId: Types.ObjectId) {
    return Review.findByIdAndDelete(reviewId);
  },
};
