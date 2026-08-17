import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

// Types
import type { ApiResponse } from "@/types/response.type";
import type {
  IReferralStats,
  IReferralHistory,
  ReferralStatus,
} from "@/types/referral.type";
import type { ReferralSort } from "@/pages/Customer/MyReferral/Components/ReferralHistory/ReferralHistory";

export type GetMyReferralsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReferralStatus | "all";
  sort?: ReferralSort;
};

interface ReferralStore {
  getReferralStats: () => Promise<IReferralStats>;

  getMyReferrals: (
    params?: GetMyReferralsParams,
  ) => Promise<ApiResponse<IReferralHistory[]> | null>;
}

const useReferralStore = create<ReferralStore>(() => ({
  getReferralStats: async () => {
    try {
      let response = await axiosInstance.get("/v1/referrals/stats");

      return response.data.data;
    } catch (error) {}
  },

  getMyReferrals: async (params = {}) => {
    try {
      const res = await axiosInstance.get("/v1/referrals/my-referrals", {
        params: {
          ...params,
          ...(params.status === "all" && {
            status: undefined,
          }),
          sortBy: params.sort,
        },
      });

      return res.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
}));

export default useReferralStore;
