import { Types, type ClientSession } from "mongoose";

// Repositories
import { ReferralRepository } from "../Repositories/referral.repository.ts";

// Models
import User from "../Models/user.model.ts";
import {
  type IReferral,
  type ReferralStatus,
} from "../Models/referral.model.ts";

import ApiFeatures from "../Utils/apiFeatures/ApiFeatures.ts";

// Utils
import AppError from "./../Utils/AppError.ts";
import { maskEmail } from "../Utils/emailManager.ts";

export interface ReferralQueryOptions {
  page: number;
  limit: number;

  search?: string;

  status?: ReferralStatus;

  sortBy?: "createdAt" | "rewardAmount" | "status";
  sortOrder?: "asc" | "desc";

  dateFrom?: string;
  dateTo?: string;
}

export const ReferralService = {
  // Create referral when a user registers via referral link
  async createReferral(
    inviterId: Types.ObjectId,
    inviteeId: Types.ObjectId,
    referralCodeUsed?: string,
    rewardAmount = 50,
  ) {
    const existing = await ReferralRepository.findByInvitee(inviteeId);

    if (existing) return existing; // avoid duplicates

    const data: Partial<IReferral> = {
      inviter: inviterId,
      invitee: inviteeId,
      status: "pending",
      rewardAmount,
    };

    if (referralCodeUsed) {
      data.referralCodeUsed = referralCodeUsed;
    }

    return ReferralRepository.create(data);
  },

  // Mark referral as qualified when order meets minimum
  async qualifyReferral(
    inviteeId: Types.ObjectId,
    orderId: Types.ObjectId,
    orderAmount: number,
    session?: ClientSession,
  ) {
    const referral = await ReferralRepository.findByInvitee(inviteeId, session);
    if (!referral) throw new AppError("Referral not found", 404);

    if (referral.status !== "pending") return referral;

    if (orderAmount < referral.minPurchaseRequired) {
      throw new AppError("Order does not meet referral minimum", 400);
    }

    return ReferralRepository.markQualified(
      referral._id,
      orderId,
      orderAmount,
      session,
    );
  },

  // Mark referral as holding after delivery
  async holdReferral(inviteeId: Types.ObjectId, deliveredAt: Date) {
    const referral = await ReferralRepository.findByInvitee(inviteeId);
    if (!referral) return null;

    if (referral.status !== "qualified") return referral;

    return ReferralRepository.markHolding(referral._id, deliveredAt);
  },

  // Check and mark expired holding referrals as completed
  async processHoldExpired(): Promise<IReferral[]> {
    const now = new Date();
    const expired = await ReferralRepository.findHoldExpired(now);

    const results: IReferral[] = [];

    for (const ref of expired) {
      const eligible = await ReferralRepository.markCompleted(ref._id);
      if (eligible) results.push(eligible);
    }
    return results;
  },

  // async requestWithdrawal(referralId: Types.ObjectId, userId: Types.ObjectId) {
  //   const referral = await ReferralRepository.findByInvitee(userId);

  //   if (!referral || !referral._id.equals(referralId))
  //     throw new AppError("Referral not found", 404);

  //   if (referral.status !== "eligible")
  //     throw new AppError("Referral not withdrawable yet", 400);

  //   referral.withdrawalRequested = true;
  //   referral.withdrawalRequestedAt = new Date();

  //   return referral.save();
  // },

  async cancelReferral(inviteeId: Types.ObjectId, reason = "Order refunded") {
    const referral = await ReferralRepository.findByInvitee(inviteeId);
    if (!referral) return null;

    if (["paid", "cancelled"].includes(referral.status)) return referral;

    return ReferralRepository.cancel(referral._id, reason);
  },

  async getMyReferrals(reqQuery: any, userId: Types.ObjectId) {
    const fields =
      "_id inviter invitee referralCodeUsed rewardAmount qualifyingOrder qualifyingOrderAmount minPurchaseRequired qualifiedAt deliveredAt holdUntil status cancelR eason createdAt";

    let query = ReferralRepository.findByInviter(userId, fields);

    const features = new ApiFeatures(query, reqQuery);

    // --------------------------------
    // FILTER
    // --------------------------------

    features.filter();

    // --------------------------------
    // SEARCH
    // --------------------------------

    features.search(["referralCodeUsed", "status"]);

    await features.searchRelations([
      {
        field: "invitee",
        model: User,
        searchFields: ["name", "email"],
      },
    ]);

    // --------------------------------
    // SORT
    // --------------------------------

    features.sort("-createdAt");

    // --------------------------------
    // FIELDS
    // --------------------------------

    features.limitFields();

    // --------------------------------
    // PAGINATION
    // --------------------------------

    await features.paginate(10);

    // --------------------------------
    // EXECUTE
    // --------------------------------

    const data = await features.query.populate("invitee", "name email");

    // --------------------------------
    // MASK EMAIL
    // --------------------------------

    const mappedData = data.map((referral: any) => {
      const referralObject = referral.toObject();

      if (referralObject.invitee) {
        referralObject.invitee.email = maskEmail(referralObject.invitee.email);
      }

      return referralObject;
    });

    return {
      data: mappedData,
      meta: features.meta,
    };
  },

  async getReferralEarnings(userId: Types.ObjectId) {
    return ReferralRepository.getEarningsByInviter(userId);
  },

  async getAllReferrals(): Promise<IReferral[]> {
    return ReferralRepository.findAll();
  },

  async getReferralStats(inviterId: Types.ObjectId) {
    return ReferralRepository.getStatsByInviter(inviterId);
  },

  async getEligibleReferrals(inviterId: Types.ObjectId) {
    const now = new Date();
    return ReferralRepository.findEligibleByInviter(inviterId, now);
  },

  async getReferralById(
    referralId: Types.ObjectId,
    userId: Types.ObjectId,
    role: string,
  ) {
    const referral = await ReferralRepository.findById(referralId);
    if (!referral) throw new AppError("Referral not found", 404);

    const isOwner = referral.inviter.toString() === userId.toString();
    if (!isOwner && role !== "admin") {
      throw new AppError("Not authorized to view this referral", 403);
    }

    return referral;
  },

  // async rewardReferral(userId: Types.ObjectId) {
  //   // Find referral
  //   const referral = await ReferralRepository.getReferralByInvitee(userId);

  //   if (!referral) throw new AppError("Referral not found", 404);

  //   if (referral.status === "completed")
  //     throw new AppError("Referral already rewarded", 400);

  //   // Update status
  //   return ReferralRepository.updateReferralStatus(referral._id, "completed");
  // },
};
