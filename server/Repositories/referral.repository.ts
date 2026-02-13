import mongoose, { Types, type ClientSession } from "mongoose";

// Models
import Referral, { type IReferral } from "../Models/referral.model.ts";

const periodOfOrderHold = 7; // days

export const ReferralRepository = {
  async create(
    data: Partial<IReferral>,
    session?: ClientSession
  ): Promise<IReferral> {
    const referral = new Referral(data);
    if (session) referral.$session(session);
    return referral.save();
  },

  async findByInviter(inviterId: Types.ObjectId): Promise<IReferral[]> {
    return Referral.find({ inviter: inviterId })
      .populate("invitee", "name email")
      .sort({ createdAt: -1 });
  },

  async findByInvitee(
    inviteeId: Types.ObjectId,
    session?: ClientSession
  ): Promise<IReferral | null> {
    const query = Referral.findOne({ invitee: inviteeId });
    if (session) query.session(session);
    return query;
  },

  async findAll(): Promise<IReferral[]> {
    return Referral.find().populate("inviter invitee", "name email");
  },

  // Mark referral as qualified (purchase meets minimum)
  async markQualified(
    referralId: Types.ObjectId,
    orderId: Types.ObjectId,
    amount: number,
    session?: ClientSession
  ) {
    return Referral.findByIdAndUpdate(
      referralId,
      {
        status: "qualified",
        qualifyingOrder: orderId,
        qualifyingOrderAmount: amount,
        qualifiedAt: new Date(),
      },
      { new: true, session: session ?? null }
    );
  },

  // Mark referral as holding (after delivery)
  async markHolding(
    referralId: Types.ObjectId,
    deliveredAt: Date,
    session?: ClientSession
  ) {
    const holdUntil = new Date(deliveredAt);
    holdUntil.setDate(holdUntil.getDate() + periodOfOrderHold);

    return Referral.findByIdAndUpdate(
      referralId,
      {
        status: "holding",
        deliveredAt,
        holdUntil,
      },
      { new: true, session: session ?? null }
    );
  },

  async findHoldExpired(now: Date) {
    return Referral.find({
      status: "holding",
      holdUntil: { $lte: now },
    });
  },

  // Mark eligible (add reward to ledger handled separately)
  // async markEligible(referralId: Types.ObjectId): Promise<IReferral | null> {
  //   return Referral.findByIdAndUpdate(
  //     referralId,
  //     {
  //       status: "eligible",
  //       isWithdrawable: true,
  //     },
  //     { new: true }
  //   );
  // },

  // Complete referral (after reward is credited to ledger)
  async markCompleted(
    referralId: Types.ObjectId,
    session?: ClientSession
  ): Promise<IReferral | null> {
    // Build options object dynamically
    const options: mongoose.QueryOptions<IReferral> = { new: true };
    if (session) options.session = session; // only add session if defined

    return Referral.findByIdAndUpdate(
      referralId,
      { status: "completed" },
      options
    )
      .lean<IReferral>()
      .exec();
  },

  // Cancel referral (refund, abuse, etc.)
  async cancel(
    referralId: Types.ObjectId,
    reason: string,
    session?: ClientSession
  ) {
    const options: mongoose.QueryOptions<IReferral> = { new: true };
    if (session) options.session = session; // only add session if defined

    return Referral.findByIdAndUpdate(
      referralId,
      {
        status: "cancelled",
        cancelReason: reason,
      },
      options
    );
  },

  async getEarningsByInviter(inviterId: Types.ObjectId): Promise<number> {
    const referrals = await Referral.find({
      inviter: inviterId,
      status: "paid",
    });
    return referrals.reduce((total, r) => total + r.rewardAmount, 0);
  },

  async getStatsByInviter(inviterId: Types.ObjectId) {
    const stats = await Referral.aggregate([
      { $match: { inviter: inviterId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result: Record<string, number> = {
      total: 0,
      pending: 0,
      qualified: 0,
      holding: 0,
      completed: 0,
      cancelled: 0,
    };

    stats.forEach((s) => {
      result[s._id] = s.count;
      result.total += s.count;
    });

    return result;
  },

  async findEligibleByInviter(inviterId: Types.ObjectId, now: Date) {
    return Referral.find({
      inviter: inviterId,
      status: "holding",
      holdUntil: { $lte: now },
    }).populate("invitee", "name email");
  },

  async findById(referralId: Types.ObjectId) {
    return Referral.findById(referralId).populate(
      "inviter invitee",
      "name email"
    );
  },

  // async updateReferralStatus(
  //   referralId: Types.ObjectId,
  //   status: IReferral["status"]
  // ): Promise<IReferral | null> {
  //   return Referral.findByIdAndUpdate(referralId, { status }, { new: true });
  // },
};
