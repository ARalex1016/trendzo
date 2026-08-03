import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

// Types
import type { ApiResponse } from "@/types/response.type";
import type { IReferralStats, IReferralHistory } from "@/types/referral.type";

interface ReferralStore {
  getReferralStats: () => Promise<IReferralStats>;

  getMyReferrals: (
    page?: number,
  ) => Promise<ApiResponse<IReferralHistory[]> | null>;
}

const useReferralStore = create<ReferralStore>(() => ({
  getReferralStats: async () => {
    try {
      let response = await axiosInstance.get("/v1/referrals/stats");

      return response.data.data;
    } catch (error) {}
  },

  getMyReferrals: async (page) => {
    let pageQry = `page=${page}`;
    try {
      let response = await axiosInstance.get(
        `/v1/referrals/my-referrals${page ? `?${pageQry}` : ""}`,
      );

      return response.data;
    } catch (error) {}
  },
}));

export default useReferralStore;
