import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type PaymentMethodType = "bank" | "esewa" | "khalti";

export interface IPaymentMethod extends Document {
  user: Types.ObjectId;
  type: PaymentMethodType;
  label?: string; // optional friendly name for user e.g., "My Bank Account"
  details: {
    // use different fields depending on type
    accountName?: string; // for bank
    accountNumber?: string; // for bank
    bankName?: string; // for bank
    phone?: string; // for esewa or khalti
    [key: string]: any; // future-proof for extra fields
  };
  qrCode?: string; // could be a URL or base64 string of QR code
  isDefault: boolean; // user can choose default method
  createdAt: Date;
  updatedAt: Date;
}

const paymentMethodSchema = new Schema<IPaymentMethod>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["bank", "esewa", "khalti"], required: true },
    label: { type: String },
    details: { type: Object, required: true },
    qrCode: { type: String }, // optional QR code
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

paymentMethodSchema.index({ user: 1 });

const PaymentMethod: Model<IPaymentMethod> = mongoose.model<IPaymentMethod>(
  "PaymentMethod",
  paymentMethodSchema
);
export default PaymentMethod;
