import { create } from "zustand";
import { axiosInstance } from "./axios";

// Types
import type { IProduct } from "@/types/product.type";
import type { IProductResponse } from "@/types/response.type";

interface ProductStore {
  productsResponse: IProductResponse | null;

  getAllProducts: (query?: string) => Promise<IProductResponse | null>;
  getFeaturedProducts: () => Promise<IProduct[] | null>;
}

const useProductStore = create<ProductStore>((set) => ({
  productsResponse: null,

  getAllProducts: async (query?: string) => {
    set({ productsResponse: null });

    try {
      let res = await axiosInstance.get(
        `/products${query ? `?${query}&` : ""}`,
      );

      set({ productsResponse: res.data });

      return res.data;
    } catch (error: any) {
      set({ productsResponse: null });
      throw new Error(error.message);
    }
  },

  getFeaturedProducts: async () => {
    try {
      let res = await axiosInstance.get("/products/featured");

      return res.data.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
}));

export default useProductStore;
