export type ICode = string;

export type CouponStatus = "active" | "inactive";

export type CouponType = "percentage" | "fixed";

export type UserTypeForCoupon = "all" | "firstTime";

export type Creator = {
  name: string;
};

export interface ICoupon {
  _id?: string;
  code: ICode;
  type: CouponType;
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  applicableUsers: UserTypeForCoupon;
  expiryDate: string;
  usageLimit?: number | null;
  usedCount: number;
  status: CouponStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCoupon extends Omit<ICoupon, "createdBy"> {
  createdBy: Creator;
}
