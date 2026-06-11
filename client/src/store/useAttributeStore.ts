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

  colorMap: Record<string, IColor>;
  sizeMap: Record<string, ISize>;

  getAttributes: () => Promise<void>;
}

const useAttributeStore = create<AttributeStore>((set) => ({
  attributes: null,

  colorMap: {},
  sizeMap: {},

  getAttributes: async () => {
    try {
      let res = await axiosInstance.get("/v1/attributes");

      const colors = res.data.data.colors;
      const sizes = res.data.data.sizes;

      set({
        attributes: res.data.data,
        colorMap: Object.fromEntries(colors.map((c: IColor) => [c._id, c])),

        sizeMap: Object.fromEntries(sizes.map((s: ISize) => [s._id, s])),
      });
    } catch (error: unknown) {
      const err = error as AxiosError<ApiErrorResponse>;

      throw new Error(
        err.response?.data?.message || "Failed to load attributes",
      );
    }
  },
}));

export default useAttributeStore;
