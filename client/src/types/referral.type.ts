export type ReferralStatus =
  | "pending"
  | "qualified"
  | "holding"
  | "completed"
  | "cancelled";

export interface IReferralUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface IReferralHistory {
  _id: string;

  invitee: IReferralUser;

  referralCodeUsed: string;

  rewardAmount: number;

  qualifyingOrder?: string;

  qualifyingOrderAmount?: number;

  minPurchaseRequired?: number;

  qualifiedAt?: string | Date;

  deliveredAt?: string | Date;

  holdUntil?: string | Date;

  createdAt: string | Date;

  updatedAt: string | Date;

  status: ReferralStatus;

  cancelReason?: string;
}

export interface IReferralStats {
  total: 0; // Total Referrals
  pending: 0; // Referree Registered but not yet purchased
  qualified: 0; // Referree Purchased (still need to wait for holding period)
  holding: 0; // Purchased and hold until waiting period (e.g. 7 days)
  completed: 0; // Referral reward credited (success)
  cancelled: 0; // Order cancelled by referree
}

export interface ReferralPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReferralHistoryResponse {
  referrals: IReferralHistory[];
  pagination: ReferralPagination;
}

export interface ReferralQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReferralStatus | "all";
}
