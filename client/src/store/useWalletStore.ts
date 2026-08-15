import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

interface UserStore {
  getMyLedger: () => Promise<void>;
}

const useWalletStore = create<UserStore>(() => ({
  getMyLedger: async () => {
    try {
      const response = await axiosInstance.get("/v1/ledgers/me");

      console.log(response);
    } catch (error: any) {
      console.log(error);
    }
  },
}));

export default useWalletStore;
