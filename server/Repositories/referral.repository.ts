// Models
import Referral, { type IReferral } from "../Models/referral.model.ts";
import { Types } from "mongoose";

export const ReferralRepository = {
  async createReferral(data: Partial<IReferral>): Promise<IReferral> {
    const referral = new Referral(data);
    return referral.save();
  },

  async getReferralsByInviter(inviterId: Types.ObjectId): Promise<IReferral[]> {
    return Referral.find({ inviter: inviterId }).populate(
      "invitee",
      "name email"
    );
  },

  async getReferralByInvitee(
    inviteeId: Types.ObjectId
  ): Promise<IReferral | null> {
    return Referral.findOne({ invitee: inviteeId });
  },

  async getAllReferrals(): Promise<IReferral[]> {
    return Referral.find().populate("inviter invitee", "name email");
  },

  async updateReferralStatus(
    referralId: Types.ObjectId,
    status: IReferral["status"]
  ): Promise<IReferral | null> {
    return Referral.findByIdAndUpdate(referralId, { status }, { new: true });
  },

  async getEarningsByInviter(inviterId: Types.ObjectId): Promise<number> {
    const referrals = await Referral.find({
      inviter: inviterId,
      status: "completed",
    });
    return referrals.reduce((total, r) => total + r.rewardAmount, 0);
  },
};
