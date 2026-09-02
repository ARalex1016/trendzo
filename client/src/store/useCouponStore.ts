import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

// Types
import type { AxiosError } from "axios";
import type { ApiResponse, ApiErrorResponse } from "@/types/response.type";
import type { ICoupon, AdminCoupon } from "@/types/coupon.type";
import type { CreateCouponFormValues } from "@/pages/Admin/Attributes/Coupons/CreateCoupon";

interface CouponStore {
  adminCoupons: ApiResponse<AdminCoupon[]> | null;

  validateCoupon: (code: string) => Promise<ICoupon>;

  createCoupon: (coupon: CreateCouponFormValues) => Promise<void>;

  getAllCoupons: () => Promise<ApiResponse<AdminCoupon[]>>;

  toggleCouponStatus: (couponId: string) => Promise<void>;

  deleteCoupon: (couponId: string) => Promise<void>;
}

const useCouponStore = create<CouponStore>((set) => ({
  adminCoupons: null,

  validateCoupon: async (code) => {
    try {
      const res = await axiosInstance.post("/v1/coupons/validate", {
        code,
      });

      return res.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<ApiErrorResponse>;

      throw new Error(
        err.response?.data?.message || "Coupon validation failed",
      );
    }
  },

  createCoupon: async (coupon) => {
    try {
      const promise = axiosInstance.post("/v1/coupons/", coupon);

      const response = await toast.promise(promise, {
        loading: "Creating New Coupon...",
        success: (res) => res.data.message,
        error: (err) =>
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create new coupon",
      });

      // Update store ONLY after successful request
      const newCoupon: AdminCoupon = response.data.data;

      set((state) => {
        if (!state.adminCoupons) return state;

        return {
          adminCoupons: {
            ...state.adminCoupons,
            data: [newCoupon, ...state.adminCoupons.data],
          },
        };
      });
    } catch (error: unknown) {
      const err = error as AxiosError<ApiErrorResponse>;

      throw new Error(
        err.response?.data?.message || "Failed to create new coupon",
      );
    }
  },

  getAllCoupons: async () => {
    try {
      const res = await axiosInstance.get("/v1/coupons/");

      set({ adminCoupons: res.data });

      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError<ApiErrorResponse>;

      throw new Error(err.response?.data?.message || "Failed to fetch coupons");
    }
  },

  toggleCouponStatus: async (couponId) => {
    try {
      const promise = axiosInstance.patch(`/v1/coupons/${couponId}/status`);

      const response = await toast.promise(promise, {
        loading: "Updating coupon status...",
        success: (res) => res.data.message,
        error: (err) =>
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update coupon status",
      });

      // Update store ONLY after successful request
      const updatedCoupon: AdminCoupon = response.data.data;

      set((state) => {
        if (!state.adminCoupons) return state;

        return {
          adminCoupons: {
            ...state.adminCoupons,
            data: state.adminCoupons.data.map((coupon) =>
              coupon._id === couponId ? updatedCoupon : coupon,
            ),
          },
        };
      });
    } catch (error: unknown) {
      const err = error as AxiosError<ApiErrorResponse>;

      throw new Error(
        err.response?.data?.message || "Failed to update coupon status",
      );
    }
  },

  deleteCoupon: async (couponId) => {
    try {
      const promise = axiosInstance.delete(`/v1/coupons/${couponId}`);

      await toast.promise(promise, {
        loading: "Deleting Coupon...",
        success: (res) => res.data.message,
        error: (err) =>
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete coupon",
      });

      // Update store ONLY after successful request
      set((state) => {
        if (!state.adminCoupons) return state;

        return {
          adminCoupons: {
            ...state.adminCoupons,
            data: state.adminCoupons.data.filter(
              (coupon) => coupon._id !== couponId,
            ),
          },
        };
      });
    } catch (error: any) {
      const err = error as AxiosError<ApiErrorResponse>;

      throw new Error(err.response?.data?.message || "Failed to delete coupon");
    }
  },
}));

export default useCouponStore;
