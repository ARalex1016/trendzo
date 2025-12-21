import { Types } from "mongoose";
import Withdrawal from "./../Models/withdraw.model.ts";

export const WithdrawalRepository = {
  async create(data: Partial<any>, session?: any) {
    return Withdrawal.create([{ ...data }], { session });
  },

  async findByUser(userId: Types.ObjectId) {
    return Withdrawal.find({ user: userId }).sort({ createdAt: -1 });
  },

  async findById(id: Types.ObjectId) {
    return Withdrawal.findById(id).populate("ledgerIds");
  },

  async updateStatus(
    id: Types.ObjectId,
    status: "successful" | "rejected",
    referenceId?: string,
    session?: any
  ) {
    return Withdrawal.findByIdAndUpdate(
      id,
      { status, referenceId },
      { new: true, session }
    );
  },
};
