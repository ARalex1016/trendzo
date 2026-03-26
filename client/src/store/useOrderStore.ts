import { create } from "zustand";
import { axiosInstance } from "./axios";

// Type
import { type CheckoutSchemaType } from "@/validations/checkout.validator";

interface OrderStore {
  placeOrder: (checkOutData: CheckoutSchemaType) => Promise<void>;
}

const useOrderStore = create<OrderStore>((set) => ({
  placeOrder: async (checkOutData) => {
    try {
    } catch (error) {}
  },
}));

export default useOrderStore;
