import mongoose, { Document, Schema, Model } from "mongoose";

export type Role = "user" | "operator" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  isEmailVerified: boolean;
  emailVerificationOTP?: number | undefined;
  emailVerificationOTPExpiresAt?: Date | undefined;
  resetPasswordToken?: string | undefined;
  resetPasswordExpiresAt?: Date | undefined;
  phone?: string;
  isPhoneVerified: boolean;
  verified: boolean;
  password?: string; // only for local auth
  authProviders?: {
    google?: { id: string; email: string };
    facebook?: { id: string; email: string };
  };
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  address: {
    _id: mongoose.Types.ObjectId;
    label?: string; // Home, Work, Mom, etc
    name: string;
    street: string;
    city: string;
    state: string;
    country?: string;
    postalCode: string;
  };
}

const AddressSchema = new Schema(
  {
    label: { type: String },
    street: { type: String, required: true },
    city: { type: String },
    state: String,
    country: { type: String, default: "Nepal" },
    postalCode: String,
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationOTP: {
      type: Number,
    },
    emailVerificationOTPExpiresAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiresAt: {
      type: Date,
    },
    phone: {
      type: String,
      index: true,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    password: {
      // optional if OAuth
      type: String,
      select: false,
    },
    authProviders: {
      google: { id: String, email: String },
      facebook: { id: String, email: String },
    },
    role: {
      type: String,
      enum: ["user", "operator", "admin"],
      default: "user",
    },
    address: {
      type: AddressSchema,
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
