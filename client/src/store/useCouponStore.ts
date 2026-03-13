import { create } from "zustand";
import { axiosInstance } from "./axios";

// Types
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/response.type";
import type { ICoupon } from "@/types/coupon.type";

interface CouponStore {
  validateCoupon: (code: string) => Promise<ICoupon | AxiosError>;
}

const useCouponStore = create<CouponStore>(() => ({
  validateCoupon: async (code) => {
    try {
      const res = await axiosInstance.post("/v1/coupons/validate", { code });

      return res.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<ApiErrorResponse>;

      throw new Error(
        err.response?.data?.message || "Coupon validation failed",
      );
    }
  },
}));

export default useCouponStore;
