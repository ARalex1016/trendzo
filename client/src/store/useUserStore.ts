import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

// Store
import useAuthStore from "./useAuthStore";

// Types
import type { AddressStepSchemaType } from "@/validations/checkout.validator";

interface UserStore {
  addAddress: (addressData: AddressStepSchemaType) => Promise<void>;

  removeAddress: (addressId: string) => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
  addAddress: async (addressData) => {
    try {
      let promise = axiosInstance.patch(
        "/v1/users/add-address",
        addressData.address,
      );

      toast.promise(promise, {
        loading: "Saving address...",
        success: (res) => {
          return res.data.message;
        },
        error: (err) => {
          return (
            err?.response?.data?.message ||
            err.message ||
            "Failed to add address"
          );
        },
      });

      const response = await promise;

      useAuthStore.getState().setAddresses(response.data.data);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  removeAddress: async (addressId) => {
    try {
      let promise = axiosInstance.delete(`/v1/users/addresses/${addressId}`);

      toast.promise(promise, {
        loading: "Removing address...",
        success: (res) => {
          return res.data.message;
        },
        error: (err) => {
          return (
            err?.response?.data?.message ||
            err.message ||
            "Failed to remove address"
          );
        },
      });

      const response = await promise;

      useAuthStore.getState().setAddresses(response.data.data);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
}));

export default useUserStore;
