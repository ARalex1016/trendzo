import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

// Types
import type { AxiosError } from "axios";
import type { ApiResponse, ApiErrorResponse } from "@/types/response.type";
import type { AdminSize } from "@/types/size.types";
import type { CreateSizeFormValues } from "@/pages/Admin/Attributes/Sizes/CreateSize";

interface CouponStore {
  adminSizes: ApiResponse<AdminSize[]> | null;

  getAllSizes: () => Promise<void>;

  createSize: (size: CreateSizeFormValues) => Promise<void>;

  deleteSize: (sizeId: string) => Promise<void>;
}

const useSizeStore = create<CouponStore>((set) => ({
  adminSizes: null,

  getAllSizes: async () => {
    try {
      let res = await axiosInstance.get("/v1/sizes");

      set({ adminSizes: res.data });
    } catch (error) {}
  },

  createSize: async (size) => {
    try {
      const promise = axiosInstance.post("/v1/sizes/", size);

      const response = await toast.promise(promise, {
        loading: "Creating New Size...",
        success: (res) => res.data.message,
        error: (err) =>
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create new size",
      });

      // Update store ONLY after successful request
      const newCoupon: AdminSize = response.data.data;

      set((state) => {
        if (!state.adminSizes) return state;

        return {
          adminSizes: {
            ...state.adminSizes,
            data: [newCoupon, ...state.adminSizes.data],
          },
        };
      });
    } catch (error: any) {
      const err = error as AxiosError<ApiErrorResponse>;

      throw new Error(
        err.response?.data?.message || "Failed to create new coupon",
      );
    }
  },

  deleteSize: async (sizeId) => {
    try {
      const promise = axiosInstance.delete(`/v1/sizes/${sizeId}`);

      await toast.promise(promise, {
        loading: "Deleting size...",
        success: (res) => res.data.message,
        error: (err) =>
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete size",
      });

      console.log(await promise);

      set((state) => {
        if (!state.adminSizes) return state;

        return {
          adminSizes: {
            ...state.adminSizes,
            data: state.adminSizes.data.filter((size) => size._id !== sizeId),
          },
        };
      });
    } catch (error: any) {
      const err = error as AxiosError<ApiErrorResponse>;

      throw new Error(err.response?.data?.message || "Failed to delete coupon");
    }
  },
}));

export default useSizeStore;
