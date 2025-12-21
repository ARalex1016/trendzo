import { Types } from "mongoose";
import { LedgerRepository } from "./../Repositories/ledger.repository.ts";

export const LedgerService = {
  async getUserBalance(userId: Types.ObjectId) {
    const result = await LedgerRepository.aggregateBalance(userId);
    return result[0]?.total || 0;
  },

  async getUserLedger(userId: Types.ObjectId) {
    return LedgerRepository.findUserLedger(userId);
  },
};
