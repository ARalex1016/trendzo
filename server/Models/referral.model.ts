import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IReferral extends Document {
  inviter: Types.ObjectId;
  invitee: Types.ObjectId;
  commission: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    inviter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    invitee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    commission: { type: Number, default: 50 },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Referral: Model<IReferral> = mongoose.model<IReferral>(
  "Referral",
  referralSchema
);
export default Referral;
