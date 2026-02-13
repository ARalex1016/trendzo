import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IWithdrawal extends Document {
  user: Types.ObjectId;
  amount: number;
  ledgerIds: Types.ObjectId[]; // references ledger entries used
  method: "bank" | "esewa" | "khalti";
  status: "processing" | "successful" | "rejected";
  referenceId?: string; // optional for payment gateway
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new Schema<IWithdrawal>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 1 },
    ledgerIds: [{ type: Schema.Types.ObjectId, ref: "Ledger", required: true }],
    method: { type: String, enum: ["bank", "esewa", "khalti"], required: true },
    status: {
      type: String,
      enum: ["processing", "successful", "rejected"],
      default: "processing",
    },
    referenceId: String,
  },
  { timestamps: true }
);

const Withdrawal: Model<IWithdrawal> = mongoose.model<IWithdrawal>(
  "Withdrawal",
  withdrawalSchema
);
export default Withdrawal;
