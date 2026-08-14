import mongoose, { Schema, Document, Types, Model } from "mongoose";

export type ReferralStatus =
  | "pending" // When Invitee Registered
  | "qualified" // When Invitee Made Qualifying Order (with referral requirements)
  | "holding" // After Order Delivered, and Holding until Holding Period
  | "completed" // After Holding Period Finished
  | "cancelled"; // Referral Never Receives Reward (Maybe Because Invitee Cancelled, Refund, etc)

export interface IReferral extends Document {
  inviter: Types.ObjectId;
  invitee: Types.ObjectId;
  referralCodeUsed?: string; // displayCode or referralId used
  rewardAmount: number;

  // Purchase tracking
  qualifyingOrder?: Types.ObjectId;
  qualifyingOrderAmount?: number;
  minPurchaseRequired: number;

  // Time control
  qualifiedAt?: Date;
  deliveredAt?: Date;
  holdUntil?: Date; // qualifiedAt + 7 days

  status: ReferralStatus;
  cancelReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    inviter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    invitee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    referralCodeUsed: { type: String }, // store which code was used (optional)

    rewardAmount: { type: Number, default: 50 },
    minPurchaseRequired: { type: Number, default: 1500 },

    qualifyingOrder: { type: Schema.Types.ObjectId, ref: "Order" },
    qualifyingOrderAmount: { type: Number },

    qualifiedAt: { type: Date },
    deliveredAt: { type: Date },
    holdUntil: { type: Date },

    status: {
      type: String,
      enum: ["pending", "qualified", "holding", "completed", "cancelled"],
      default: "pending",
    },

    cancelReason: { type: String },
  },
  { timestamps: true },
);

referralSchema.index({ invitee: 1 }, { unique: true }); // prevent abuse

const Referral: Model<IReferral> = mongoose.model<IReferral>(
  "Referral",
  referralSchema,
);
export default Referral;
