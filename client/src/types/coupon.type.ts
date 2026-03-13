export type ICode = string;

export interface ICoupon {
  _id: string;
  code: ICode;
  type: "percentage" | "fixed";
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  applicableUsers: "all" | "firstTime";
  expiryDate: string;
  usageLimit?: number | null;
  usedCount: number;
  status: "active" | "inactive";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
