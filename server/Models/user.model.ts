import mongoose, { Document, Schema, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type Role = "customer" | "operator" | "admin";

export interface IAddress {
  _id: mongoose.Types.ObjectId;
  label?: string; // Home, Work, Mom, etc.
  fullName: string; // recipient name
  phone: string;
  email: string;
  street: string;
  area?: string; // optional local area / landmark
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  landmark?: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  isEmailVerified: boolean;
  emailVerificationOTP?: string | undefined;
  emailVerificationOTPExpiresAt?: Date | undefined;
  resetPasswordToken?: string | undefined;
  resetPasswordExpiresAt?: Date | undefined;
  phone: string | undefined;
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
  addresses: IAddress[];

  // Referral fields
  referralId: string;
  displayCode?: string;
  previousDisplayCodes?: { code: string; changedAt: Date }[];
}

const AddressSchema = new Schema<IAddress>(
  {
    label: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    street: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      default: "Nepal",
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true, timestamps: false },
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
      type: String,
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
      unique: true,
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
      enum: ["customer", "operator", "admin"],
      default: "customer",
    },
    addresses: {
      type: [AddressSchema],
      default: [],
    },
    // Referral fields
    referralId: {
      type: String,
      required: true,
      default: () => uuidv4(),
      immutable: true,
      unique: true,
    },
    displayCode: { type: String, unique: true, sparse: true }, // optional, can change
    previousDisplayCodes: {
      type: [
        {
          code: { type: String, required: true },
          changedAt: { type: Date, required: true, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

// Ensure only one default address per user
UserSchema.pre("save", async function () {
  if (!this.addresses || this.addresses.length === 0) {
    return;
  }

  const defaultAddresses = this.addresses.filter((addr) => addr.isDefault);

  if (defaultAddresses.length === 0 && this.addresses.length > 0) {
    this.addresses[0]!.isDefault = true;
  }

  if (defaultAddresses.length > 1) {
    let foundFirst = false;

    this.addresses.forEach((addr) => {
      if (addr.isDefault && !foundFirst) {
        foundFirst = true;
      } else {
        addr.isDefault = false;
      }
    });
  }
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
