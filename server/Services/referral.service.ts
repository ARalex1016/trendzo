import { Types, type ClientSession } from "mongoose";

// Repositories
import { ReferralRepository } from "../Repositories/referral.repository.ts";

// Models
import { type IReferral } from "../Models/referral.model.ts";

// Utils
import AppError from "./../Utils/AppError.ts";

export const ReferralService = {
  // Create referral when a user registers via referral link
  async createReferral(
    inviterId: Types.ObjectId,
    inviteeId: Types.ObjectId,
    referralCodeUsed?: string,
    rewardAmount = 50
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
    session?: ClientSession
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
      session
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

  async getMyReferrals(userId: Types.ObjectId) {
    return ReferralRepository.findByInviter(userId);
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
    role: string
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
