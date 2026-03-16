import { create } from "zustand";
import { axiosInstance } from "./axios";

// Types
import type { IProduct, ISuggestion } from "@/types/product.type";
import type { IProductResponse } from "@/types/response.type";

interface ProductStore {
  productsResponse: IProductResponse | null;

  getAllProducts: (query?: string) => Promise<IProductResponse | null>;
  getFeaturedProducts: () => Promise<IProduct[] | null>;
  getProductBySlug: (slug: string) => Promise<IProduct | null>;
  getAutoSuggestions: (query: string) => Promise<ISuggestion[] | null>;
}

const useProductStore = create<ProductStore>((set) => ({
  productsResponse: null,

  getAllProducts: async (query?: string) => {
    set({ productsResponse: null });
    try {
      let res = await axiosInstance.get(
        `/v1/products${query ? `?${query}&` : ""}`,
      );

      // const data = await res.data;
      // const sizeInBytes = new TextEncoder().encode(JSON.stringify(data)).length;
      // const sizeInKB = (sizeInBytes / 1024).toFixed(2);

      // console.log("Response size:", sizeInBytes, "bytes");
      // console.log("Response size:", sizeInKB, "KB");

      set({ productsResponse: res.data });

      return res.data;
    } catch (error: any) {
      set({ productsResponse: null });

      throw new Error(error.message);
    }
  },

  getFeaturedProducts: async () => {
    try {
      let res = await axiosInstance.get("/v1/products/featured");

      return res.data.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getProductBySlug: async (slug) => {
    try {
      let res = await axiosInstance.get(`/v1/products/slug/${slug}`);

      return res.data.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getAutoSuggestions: async (query) => {
    let queryStr = `q=${query}`;

    try {
      let res = await axiosInstance.get(
        `/v1/products/auto-suggestions?${queryStr}`,
      );

      return res.data.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
}));

export default useProductStore;
