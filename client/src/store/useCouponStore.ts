import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

// Types
import type { AxiosError } from "axios";
import type { ApiResponse, ApiErrorResponse } from "@/types/response.type";
import type { ICoupon, AdminCoupon } from "@/types/coupon.type";

interface CouponStore {
  validateCoupon: (code: string) => Promise<ICoupon>;

  getAllCoupons: () => Promise<ApiResponse<AdminCoupon[]>>;

  toggleCouponStatus: (couponId: string) => Promise<void>;
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

      throw new Error(err.response?.data?.message || "Faild to fetched Coupon");
    }
  },

  toggleCouponStatus: async (couponId) => {
    try {
      let promise = axiosInstance.patch(`v1/coupons/${couponId}/status`);

      const response = toast.promise(promise, {
        loading: "Updating coupon status...",
        success: (res) => res.data.message,
        error: (err) =>
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update coupon status",
      });

      await response;
    } catch (error: any) {
      const err = error as AxiosError<ApiErrorResponse>;

      throw new Error(
        err.response?.data?.message || "Failed to update coupon status",
      );
    }
  },
}));

export default useCouponStore;
