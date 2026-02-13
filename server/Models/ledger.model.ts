import mongoose, { Schema, Document, Model, Types } from "mongoose";

type LedgerSource = "referral" | "ads" | "spin" | "competition";

export type LedgerStatus = "pending" | "requested" | "withdrawn" | "cancelled";

export interface ILedger extends Document {
  user: Types.ObjectId;
  amount: number; // always positive
  source: {
    type: LedgerSource;
    id: Types.ObjectId;
  };
  reason: string;
  status: LedgerStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ledgerSchema = new Schema<ILedger>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    source: {
      type: {
        type: String,
        enum: ["referral", "ads", "spin", "competition"],
        required: true,
      },
      id: { type: Schema.Types.ObjectId, required: true },
    },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "locked", "withdrawn", "reversed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

ledgerSchema.index({ user: 1, status: 1 });

const Ledger: Model<ILedger> = mongoose.model<ILedger>("Ledger", ledgerSchema);

export default Ledger;
