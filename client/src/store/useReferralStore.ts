import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

// Types

interface ReferralStore {
  getReferralStats: () => Promise<void>;

  getMyReferrals: () => Promise<void>;
}

const useReferralStore = create<ReferralStore>((set) => ({
  getReferralStats: async () => {
    try {
      let response = await axiosInstance.get("/v1/referrals/stats");
    } catch (error) {}
  },

  getMyReferrals: async () => {
    try {
      let response = await axiosInstance.get("/v1/referrals/my-referrals");
    } catch (error) {}
  },
}));

export default useReferralStore;
