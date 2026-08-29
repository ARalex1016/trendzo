import { create } from "zustand";
import { axiosInstance } from "./axios";

// Types
import type { AxiosError } from "axios";
import type { ApiResponse, ApiErrorResponse } from "@/types/response.type";
import type { ICoupon } from "@/types/coupon.type";

interface CouponStore {
  validateCoupon: (code: string) => Promise<ICoupon>;

  getAllCoupons: () => Promise<ApiResponse<ICoupon[]>>;
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

  getAllCoupons: async () => {
    try {
      const res = await axiosInstance.get("/v1/coupons/");

      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError<ApiErrorResponse>;

      throw new Error(
        err.response?.data?.message || "Coupon validation failed",
      );
    }
  },
}));

export default useCouponStore;
