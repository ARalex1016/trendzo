import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IWithdrawal extends Document {
  user: Types.ObjectId;
  amount: number;
  method: "bank" | "esewa" | "khalti";
  status: "processing" | "successful" | "rejected";
  referenceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new Schema<IWithdrawal>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
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
