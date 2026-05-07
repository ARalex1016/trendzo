import { create } from "zustand";
import { axiosInstance } from "./axios";

// Type
import type { OnlineOrder } from "@/types/order/order_create.type";
import type { IOrderRes } from "@/types/order/order_response.type";
import type { IOrderResponse, ApiResponse } from "@/types/response.type";

interface OrderStore {
  getSingleOrder: (orderId: string) => Promise<ApiResponse<IOrderRes> | null>;

  getOrderByOrderNumber: (
    orderNumber: string,
  ) => Promise<ApiResponse<IOrderRes> | null>;

  getMyOrders: () => Promise<IOrderResponse | null>;

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

  getMyOrders: async () => {
    try {
      let res = await axiosInstance.get(`/v1/orders/my-orders`);

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
