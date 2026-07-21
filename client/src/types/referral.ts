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

  qualifiedAt?: string;

  deliveredAt?: string;

  holdUntil?: string;

  createdAt: string;

  updatedAt: string;

  status: ReferralStatus;

  cancelReason?: string;
}

export interface IReferralStats {
  successfulReferrals: number;
  pendingReferrals: number;
  totalReferrals: number;
  referralCode: string;
  referralLink: string;
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
