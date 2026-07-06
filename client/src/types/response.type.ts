// Types
import type { ICategory } from "./category.type";
import type { ICoupon } from "./coupon.type";
import type { IOrderRes } from "./order/order_response.type";

export interface Meta {
  page: number;
  limit?: number;
  total?: number;
  pages: number;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  meta?: Meta;
  data: T;
}

export interface ApiErrorResponse {
  status: "fail" | "error";
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export type ICategoryResponse = ApiResponse<ICategory[]>;
export type IOrderResponse = ApiResponse<IOrderRes[]>;
export type ICouponResponse = ApiResponse<ICoupon>;
