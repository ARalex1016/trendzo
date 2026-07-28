import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

// Types
import type { IReferralStats } from "@/types/referral.type";

interface ReferralStore {
  getReferralStats: () => Promise<IReferralStats>;

  getMyReferrals: () => Promise<void>;
}

const useReferralStore = create<ReferralStore>(() => ({
  getReferralStats: async () => {
    try {
      let response = await axiosInstance.get("/v1/referrals/stats");

      return response.data.data;
    } catch (error) {}
  },

  getMyReferrals: async () => {
    try {
      let response = await axiosInstance.get("/v1/referrals/my-referrals");
    } catch (error) {}
  },
}));

export default useReferralStore;
