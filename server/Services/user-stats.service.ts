import { Types } from "mongoose";

// Repository
import UserStatsRepository from "../Repositories/user-stats.repository.ts";

export const UserStatsService = {
  /*
  |--------------------------------------------------------------------------
  | Initialization
  |--------------------------------------------------------------------------
  */

  async initializeUserStats(userId: Types.ObjectId) {
    return UserStatsRepository.findOrCreate(userId);
  },

  /*
  |--------------------------------------------------------------------------
  | Orders
  |--------------------------------------------------------------------------
  */

  async onOrderPlaced(userId: Types.ObjectId, orderAmount: number) {
    return UserStatsRepository.updateByUserId(userId, {
      $inc: {
        "orders.total": 1,
        "orders.pending": 1,
        "orders.totalSpent": orderAmount,
      },

      $set: {
        "metadata.lastOrderAt": new Date(),
      },
    });
  },

  async onOrderConfirmed(userId: Types.ObjectId) {
    return UserStatsRepository.updateByUserId(userId, {
      $inc: {
        "orders.pending": -1,
        "orders.confirmed": 1,
      },
    });
  },

  async onOrderShipped(userId: Types.ObjectId) {
    return UserStatsRepository.updateByUserId(userId, {
      $inc: {
        "orders.confirmed": -1,
        "orders.shipped": 1,
      },
    });
  },

  async onOrderDelivered(userId: Types.ObjectId) {
    return UserStatsRepository.updateByUserId(userId, {
      $inc: {
        "orders.shipped": -1,
        "orders.delivered": 1,
      },
    });
  },

  async onOrderCancelled(
    userId: Types.ObjectId,
    previousStatus: "pending" | "confirmed" | "shipped",
  ) {
    const decrementMap = {
      pending: "orders.pending",
      confirmed: "orders.confirmed",
      shipped: "orders.shipped",
    };

    return UserStatsRepository.updateByUserId(userId, {
      $inc: {
        [decrementMap[previousStatus]]: -1,
        "orders.cancelled": 1,
      },
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Referrals
  |--------------------------------------------------------------------------
  */

  async onReferralCreated(referrerUserId: Types.ObjectId) {
    return UserStatsRepository.updateByUserId(referrerUserId, {
      $inc: {
        "referrals.totalReferrals": 1,
      },

      $set: {
        "metadata.lastReferralAt": new Date(),
      },
    });
  },

  async onReferralSuccessful(
    referrerUserId: Types.ObjectId,
    commissionAmount: number,
  ) {
    return UserStatsRepository.updateByUserId(referrerUserId, {
      $inc: {
        "referrals.successfulReferrals": 1,

        "referrals.totalCommissionEarned": commissionAmount,

        "wallet.balance": commissionAmount,

        "wallet.totalEarned": commissionAmount,
      },
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Wallet
  |--------------------------------------------------------------------------
  */

  async depositToWallet(userId: Types.ObjectId, amount: number) {
    return UserStatsRepository.updateByUserId(userId, {
      $inc: {
        "wallet.balance": amount,
        "wallet.totalDeposited": amount,
      },
    });
  },

  async deductWalletBalance(userId: Types.ObjectId, amount: number) {
    return UserStatsRepository.updateByUserId(userId, {
      $inc: {
        "wallet.balance": -amount,
      },
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Withdrawals
  |--------------------------------------------------------------------------
  */

  async onWithdrawalRequested(userId: Types.ObjectId, amount: number) {
    return UserStatsRepository.updateByUserId(userId, {
      $inc: {
        "withdrawals.totalWithdrawals": 1,
        "withdrawals.pendingAmount": amount,

        "wallet.balance": -amount,
      },

      $set: {
        "metadata.lastWithdrawalAt": new Date(),
      },
    });
  },

  async onWithdrawalApproved(userId: Types.ObjectId, amount: number) {
    return UserStatsRepository.updateByUserId(userId, {
      $inc: {
        "withdrawals.pendingAmount": -amount,
        "withdrawals.approvedAmount": amount,
      },
    });
  },

  async onWithdrawalRejected(userId: Types.ObjectId, amount: number) {
    return UserStatsRepository.updateByUserId(userId, {
      $inc: {
        "withdrawals.pendingAmount": -amount,
        "withdrawals.rejectedAmount": amount,

        "wallet.balance": amount,
      },
    });
  },
};
