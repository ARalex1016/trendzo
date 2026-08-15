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
      const {
        page = 1,
        limit = 10,
        search = "",
        status = "all",
        sort = "latestFirst",
      } = params;

      const queryParams = new URLSearchParams();

      queryParams.set("page", String(page));
      queryParams.set("limit", String(limit));

      if (search.trim()) {
        queryParams.set("search", search.trim());
      }

      if (status !== "all") {
        queryParams.set("status", status);
      }

      queryParams.set("sortBy", sort);

      const response = await axiosInstance.get(
        `/v1/referrals/my-referrals?${queryParams.toString()}`,
      );

      return response.data;
    } catch (error) {}
  },
}));

export default useReferralStore;
