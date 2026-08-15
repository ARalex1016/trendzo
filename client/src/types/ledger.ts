export type LedgerSource = "referral" | "ads" | "spin" | "competition";

export type LedgerStatus = "pending" | "requested" | "withdrawn" | "cancelled";

export interface LedgerUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Ledger {
  _id: string;
  user: string | LedgerUser;
  amount: number;
  source: LedgerSource;
  status: LedgerStatus;
  createdAt: string;
  updatedAt: string;
}
