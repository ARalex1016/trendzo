import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

// Type
import type { OnlineOrder } from "@/types/order/order_create.type";
import type {
  IOrderRes,
  OrderWithAction,
} from "@/types/order/order_response.type";
import type { OrderStatus } from "@/types/order/shared.type";
import type { IOrderResponse, ApiResponse } from "@/types/response.type";

interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  status?: OrderStatus;
  fields?: string;
}

interface OrderStore {
  orderDetails: OrderWithAction | null;

  getSingleOrder: (orderId: string) => Promise<void>;

  getOrderByOrderNumber: (orderNumber: string) => Promise<void>;

  getMyOrders: (params?: GetOrdersParams) => Promise<IOrderResponse | null>;

  placeOrder: (
    orderData: OnlineOrder,
  ) => Promise<ApiResponse<IOrderRes> | null>;

  getAllOrders: (
    params?: GetOrdersParams,
  ) => Promise<ApiResponse<IOrderRes[]> | null>;

  verifyManualPayment: ({
    orderNumber,
    amount,
  }: {
    orderNumber: string;
    amount: number;
  }) => Promise<void>;

  confirmOrder: ({ orderNumber }: { orderNumber: string }) => Promise<void>;

  shipOrder: ({ orderNumber }: { orderNumber: string }) => Promise<void>;

  deliverOrder: ({ orderNumber }: { orderNumber: string }) => Promise<void>;

  cancelOrder: ({
    orderNumber,
    reason,
  }: {
    orderNumber: string;
    reason: string;
  }) => Promise<void>;

  returnOrder: ({ orderNumber }: { orderNumber: string }) => Promise<void>;

  refundOrder: ({ orderNumber }: { orderNumber: string }) => Promise<void>;
}

const useOrderStore = create<OrderStore>((set) => ({
  orderDetails: null,

  getSingleOrder: async (orderId) => {
    try {
      let res = await axiosInstance.get(`/v1/orders/${orderId}`);

      set({ orderDetails: res.data });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getOrderByOrderNumber: async (orderNumber) => {
    try {
      let res = await axiosInstance.get(`/v1/orders/by-number/${orderNumber}`);
      console.log(res.data.data);

      set({ orderDetails: res.data.data });
    } catch (error: any) {
      console.log(error);

      throw new Error(error.message);
    }
  },

  getMyOrders: async (params = {}) => {
    try {
      const res = await axiosInstance.get("/v1/orders/my-orders", {
        params,
      });

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

  // Admin
  getAllOrders: async (params = {}) => {
    try {
      const res = await axiosInstance.get("/v1/orders/", {
        params,
      });

      return res.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  verifyManualPayment: async ({ orderNumber, amount }) => {
    try {
      let res = await axiosInstance.patch(
        `/v1/orders/${orderNumber}/payment/verify`,
        { amount },
      );

      console.log(res.data.data);

      set({ orderDetails: res.data.data });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  confirmOrder: async ({ orderNumber }) => {
    try {
      let res = await axiosInstance.patch(`/v1/orders/${orderNumber}/confirm`);

      set({ orderDetails: res.data });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  shipOrder: async ({ orderNumber }) => {
    try {
      let res = await axiosInstance.patch(`/v1/orders/${orderNumber}/ship`);

      set({ orderDetails: res.data });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  deliverOrder: async ({ orderNumber }) => {
    try {
      let res = await axiosInstance.patch(`/v1/orders/${orderNumber}/deliver`);

      set({ orderDetails: res.data });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  cancelOrder: async ({ orderNumber, reason }) => {
    try {
      let res = await axiosInstance.patch(`/v1/orders/${orderNumber}/cancel`, {
        reason,
      });

      set({ orderDetails: res.data });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  returnOrder: async ({ orderNumber }) => {
    try {
      let res = await axiosInstance.patch(`/v1/orders/${orderNumber}/return`);

      set({ orderDetails: res.data });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  refundOrder: async ({ orderNumber }) => {
    try {
      let res = await axiosInstance.patch(`/v1/orders/${orderNumber}/refund`);

      set({ orderDetails: res.data });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
}));

export default useOrderStore;
