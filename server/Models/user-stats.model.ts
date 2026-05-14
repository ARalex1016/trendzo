import mongoose, { Schema, Types, Document, Model } from "mongoose";

export interface IUserStats extends Document {
  user: Types.ObjectId;

  orders: {
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;

    totalSpent: number;
  };

  referrals: {
    totalReferrals: number;
    successfulReferrals: number;

    totalCommissionEarned: number;
  };

  withdrawals: {
    totalWithdrawals: number;

    pendingAmount: number;
    approvedAmount: number;
    rejectedAmount: number;
  };

  wallet: {
    balance: number;
    totalDeposited: number;
    totalEarned: number;
  };

  metadata: {
    lastOrderAt?: Date;
    lastWithdrawalAt?: Date;
    lastReferralAt?: Date;
  };
}

const UserStatsSchema = new Schema<IUserStats>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    orders: {
      total: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      confirmed: { type: Number, default: 0 },
      shipped: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      cancelled: { type: Number, default: 0 },

      totalSpent: { type: Number, default: 0 },
    },

    referrals: {
      totalReferrals: { type: Number, default: 0 },
      successfulReferrals: { type: Number, default: 0 },

      totalCommissionEarned: {
        type: Number,
        default: 0,
      },
    },

    withdrawals: {
      totalWithdrawals: {
        type: Number,
        default: 0,
      },

      pendingAmount: {
        type: Number,
        default: 0,
      },

      approvedAmount: {
        type: Number,
        default: 0,
      },

      rejectedAmount: {
        type: Number,
        default: 0,
      },
    },

    wallet: {
      balance: {
        type: Number,
        default: 0,
      },

      totalDeposited: {
        type: Number,
        default: 0,
      },

      totalEarned: {
        type: Number,
        default: 0,
      },
    },

    metadata: {
      lastOrderAt: Date,
      lastWithdrawalAt: Date,
      lastReferralAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

const UserStats: Model<IUserStats> = mongoose.model<IUserStats>(
  "UserStats",
  UserStatsSchema,
);

export default UserStats;
