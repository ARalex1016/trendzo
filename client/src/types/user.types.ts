export type Role = "customer" | "operator" | "admin";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  emailVerificationOTP?: number | undefined;
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
  address: {
    _id: string;
    label?: string; // Home, Work, Mom, etc
    name: string;
    street: string;
    city: string;
    state: string;
    country?: string;
    postalCode: string;
  };
  // Referral fields
  referralId: string;
  displayCode?: string;
  previousDisplayCodes?: { code: string; changedAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}
