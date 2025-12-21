import mongoose, { Types } from "mongoose";

// Repositories
import { LedgerRepository } from "./../Repositories/ledger.repository.ts";
import { WithdrawalRepository } from "./../Repositories/withdrawal.repository.ts";

// Utils
import AppError from "../Utils/AppError.ts";

export const WithdrawalService = {
  async requestWithdrawal(
    userId: Types.ObjectId,
    amount: number,
    method: "bank" | "esewa" | "khalti"
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const ledgers = await LedgerRepository.findWithdrawableLedger(userId);

      const total = ledgers.reduce((sum, l) => sum + l.amount, 0);
      if (total < amount) {
        throw new AppError("Insufficient balance", 400);
      }

      const selected = [];
      let running = 0;

      for (const l of ledgers) {
        selected.push(l._id);
        running += l.amount;
        if (running >= amount) break;
      }

      await LedgerRepository.lockLedgerEntries(selected, session);

      const withdrawal = await WithdrawalRepository.create(
        {
          user: userId,
          amount,
          ledgerIds: selected,
          method,
        },
        session
      );

      await session.commitTransaction();
      return withdrawal[0];
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },

  async completeWithdrawal(
    withdrawalId: Types.ObjectId,
    success: boolean,
    referenceId?: string
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const withdrawal = await WithdrawalRepository.findById(withdrawalId);
      if (!withdrawal) throw new AppError("Withdrawal not found", 404);

      if (success) {
        await LedgerRepository.markWithdrawn(withdrawal.ledgerIds, session);
        await WithdrawalRepository.updateStatus(
          withdrawalId,
          "successful",
          referenceId,
          session
        );
      } else {
        await LedgerRepository.reverseLedger(withdrawal.ledgerIds, session);
        await WithdrawalRepository.updateStatus(
          withdrawalId,
          "rejected",
          undefined,
          session
        );
      }

      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  },

  async getMyWithdrawals(userId: Types.ObjectId) {
    return WithdrawalRepository.findByUser(userId);
  },

  async getWithdrawal(withdrawalId: Types.ObjectId) {
    const withdrawal = await WithdrawalRepository.findById(withdrawalId);
    if (!withdrawal) {
      throw new AppError("Withdrawal not found", 404);
    }
    return withdrawal;
  },
};
