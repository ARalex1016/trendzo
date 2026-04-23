export type Role = "customer" | "operator" | "admin";

export interface IAddress {
  _id: string;
  label?: string;
  fullName: string;
  phone: string;
  email: string;
  street: string;
  area?: string;
  city: string;
  state?: string;
  country?: string;
  postalCode?: string;
  landmark?: string;
  isDefault: boolean;
}

export interface IAuthProviders {
  google?: {
    id: string;
    email: string;
  };
  facebook?: {
    id: string;
    email: string;
  };
}

export interface IPreviousDisplayCode {
  code: string;
  changedAt: Date;
}

export interface IUser {
  _id: string;

  name: string;
  email: string;

  isEmailVerified: boolean;
  emailVerificationOTP?: number;
  emailVerificationOTPExpiresAt?: Date;

  resetPasswordToken?: string;
  resetPasswordExpiresAt?: Date;

  phone?: string;
  isPhoneVerified: boolean;

  verified: boolean;

  password?: string;

  authProviders?: IAuthProviders;

  role: Role;

  // ✅ FIXED: array instead of single object
  addresses: IAddress[];

  // referral
  referralId: string;
  displayCode?: string;
  previousDisplayCodes?: IPreviousDisplayCode[];

  createdAt: Date;
  updatedAt: Date;
}
