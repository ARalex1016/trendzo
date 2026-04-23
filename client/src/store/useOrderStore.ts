import { create } from "zustand";
import { axiosInstance } from "./axios";

// Type
import type { OnlineOrder } from "@/types/order.type";
import type { IOrderResponse } from "@/types/response.type";

interface OrderStore {
  getSingleOrder: (orderId: string) => Promise<IOrderResponse | null>;

  getOrderByOrderNumber: (
    orderNumber: string,
  ) => Promise<IOrderResponse | null>;

  placeOrder: (orderData: OnlineOrder) => Promise<IOrderResponse | null>;
}

const useOrderStore = create<OrderStore>(() => ({
  getSingleOrder: async (orderId) => {
    try {
      let res = await axiosInstance.get(`/v1/orders/${orderId}`);

      return res.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getOrderByOrderNumber: async (orderNumber) => {
    try {
      let res = await axiosInstance.get(
        `/v1/orders/orderNumber/${orderNumber}`,
      );

      return res.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  placeOrder: async (orderData) => {
    try {
      let res = await axiosInstance.post("/v1/orders", orderData);

      return res.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
}));

export default useOrderStore;
