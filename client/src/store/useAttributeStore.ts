import { create } from "zustand";
import { axiosInstance } from "./axios";

// Types
import type { AxiosError } from "axios";
import type { IColor } from "@/types/color.type";
import type { ISize } from "@/types/size.types";
import type {
  ApiErrorResponse,
  ICategoryResponse,
} from "@/types/response.type";

interface Attribute {
  sizes: ISize[];
  colors: IColor[];
  categories: ICategoryResponse;
}

interface AttributeStore {
  attributes: Attribute | null;

  getAttributes: () => Promise<void>;
}

const useAttributeStore = create<AttributeStore>((set) => ({
  attributes: null,

  getAttributes: async () => {
    console.log(1);

    try {
      let res = await axiosInstance.get("/v1/attributes");
      console.log(2);
      console.log(res.data.data);

      set({ attributes: res.data.data });
    } catch (error: unknown) {
      const err = error as AxiosError<ApiErrorResponse>;
      console.log(3);
      console.log(err.response?.data?.message);

      throw new Error(
        err.response?.data?.message || "Coupon validation failed",
      );
    }
  },
}));

export default useAttributeStore;
