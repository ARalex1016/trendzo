import Ledger, { type ILedger } from "../Models/ledger.model.ts";
import { Types, type ClientSession } from "mongoose";

export const LedgerRepository = {
  async create(data: Partial<ILedger>, session?: ClientSession) {
    const ledger = new Ledger(data);
    if (session) {
      ledger.$session(session);
    }
    return ledger.save();
  },

  async getUserBalance(userId: Types.ObjectId) {
    const pending = await Ledger.aggregate([
      { $match: { user: userId, status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const requested = await Ledger.aggregate([
      { $match: { user: userId, status: "requested" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const withdrawn = await Ledger.aggregate([
      { $match: { user: userId, status: "withdrawn" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    return {
      pending: pending[0]?.total || 0,
      requested: requested[0]?.total || 0,
      withdrawn: withdrawn[0]?.total || 0,
      available: pending[0]?.total || 0,
    };
  },

  async findUserLedger(userId: Types.ObjectId) {
    return Ledger.find({ user: userId }).sort({ createdAt: -1 });
  },

  async findWithdrawableLedger(userId: Types.ObjectId) {
    return Ledger.find({
      user: userId,
      status: "pending",
    });
  },

  async lockLedgerEntries(ids: Types.ObjectId[], session?: any) {
    return Ledger.updateMany(
      { _id: { $in: ids }, status: "pending" },
      { $set: { status: "locked" } },
      { session }
    );
  },

  async markWithdrawn(ids: Types.ObjectId[], session?: any) {
    return Ledger.updateMany(
      { _id: { $in: ids } },
      { $set: { status: "withdrawn" } },
      { session }
    );
  },

  async reverseLedger(ids: Types.ObjectId[], session?: any) {
    return Ledger.updateMany(
      { _id: { $in: ids } },
      { $set: { status: "reversed" } },
      { session }
    );
  },

  async aggregateBalance(userId: Types.ObjectId) {
    return Ledger.aggregate([
      { $match: { user: userId, status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
  },
};
