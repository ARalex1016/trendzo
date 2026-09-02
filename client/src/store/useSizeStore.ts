import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

// Types
import type { AxiosError } from "axios";
import type { ApiResponse, ApiErrorResponse } from "@/types/response.type";
import type { AdminSize } from "@/types/size.types";

interface CouponStore {
  adminSizes: ApiResponse<AdminSize[]> | null;

  getAllSizes: () => Promise<void>;

  createSize: () => Promise<void>;
}

const useSizeStore = create<CouponStore>((set) => ({
  adminSizes: null,

  getAllSizes: async () => {
    try {
      let res = await axiosInstance.get("/v1/sizes");

      set({ adminSizes: res.data });
    } catch (error) {}
  },

  createSize: async () => {
    try {
    } catch (error) {}
  },
}));

export default useSizeStore;
