import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

// Types
import type { IProduct, ISuggestion } from "@/types/product.type";
import type { IProductResponse } from "@/types/response.type";
import type { AddProductType } from "@/validations/product.validator";

interface ProductStore {
  productsResponse: IProductResponse | null;

  getAllProducts: (query?: string) => Promise<IProductResponse | null>;
  getFeaturedProducts: () => Promise<IProduct[] | null>;
  getProductBySlug: (slug: string) => Promise<IProduct | null>;
  getAutoSuggestions: (query: string) => Promise<ISuggestion[] | null>;

  addProduct: (productData: AddProductType) => Promise<void>;
}

const createProductFormData = (product: AddProductType) => {
  const formData = new FormData();

  // Destructuring
  const { images, ...productWithoutImages } = product;

  // Files
  images.forEach((image) => {
    formData.append("images", image.file);
    formData.append("imageIds", image.id);
  });

  // Send the rest of the product data
  formData.append("product", JSON.stringify(productWithoutImages));

  return formData;
};

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
      console.log(error);

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

  addProduct: async (productData) => {
    try {
      const formData = createProductFormData(productData);

      let response = axiosInstance.post(`/v1/products/`, formData);

      toast.promise(response, {
        loading: "Creating product...",
        success: "Product created successfully",
        error: "Failed to create product",
      });

      await response;
    } catch (error: any) {}
  },
}));

export default useProductStore;
