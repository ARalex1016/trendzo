import { Types } from "mongoose";

// Repositories
import { ReferralRepository } from "../Repositories/referral.repository.ts";

// Models
import { type IReferral } from "../Models/referral.model.ts";

// Utils
import AppError from "./../Utils/AppError.ts";

export const ReferralService = {
  async getMyReferrals(userId: Types.ObjectId) {
    return ReferralRepository.getReferralsByInviter(userId);
  },

  async getReferralEarnings(userId: Types.ObjectId) {
    return ReferralRepository.getEarningsByInviter(userId);
  },

  async getAllReferrals() {
    return ReferralRepository.getAllReferrals();
  },

  async rewardReferral(userId: Types.ObjectId) {
    // Find referral
    const referral = await ReferralRepository.getReferralByInvitee(userId);
    if (!referral) throw new AppError("Referral not found", 404);

    if (referral.status === "completed")
      throw new AppError("Referral already rewarded", 400);

    // Update status
    return ReferralRepository.updateReferralStatus(referral._id, "completed");
  },

  async createReferral(
    inviterId: Types.ObjectId,
    inviteeId: Types.ObjectId,
    referralCodeUsed?: string,
    rewardAmount = 50
  ) {
    const existing = await ReferralRepository.getReferralByInvitee(inviteeId);

    if (existing) return existing; // avoid duplicates

    const data: Partial<IReferral> = {
      inviter: inviterId,
      invitee: inviteeId,
      rewardAmount,
      status: "pending",
    };

    if (referralCodeUsed) {
      data.referralCodeUsed = referralCodeUsed;
    }

    return ReferralRepository.createReferral(data);
  },
};
