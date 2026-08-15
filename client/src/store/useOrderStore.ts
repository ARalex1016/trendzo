import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

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

  placeOrder: (
    orderData: OnlineOrder,
  ) => Promise<ApiResponse<IOrderRes> | null>;
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
      let res = await axiosInstance.get(`/v1/orders/by-number/${orderNumber}`);

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
      let response = axiosInstance.post("/v1/orders", orderData);

      toast.promise(response, {
        loading: "Placing Order...",
        success: (res) => {
          return res.data.message;
        },
        error: (err) => {
          return (
            err?.response?.data?.message ||
            err.message ||
            "Failed to place order"
          );
        },
      });

      await response;

      return (await response).data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
}));

export default useOrderStore;
