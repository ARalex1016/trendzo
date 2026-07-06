import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

// Utils
import { getResponseSize } from "@/utils/getResponseSize";

// Types
import type {
  IProductCard,
  IProductDetail,
  IProductCardAdmin,
  ISuggestion,
} from "@/types/product/index.type";
import type { AddProductType } from "@/validations/product.validator";
import type { ApiResponse } from "@/types/response.type";

interface ProductStore {
  productsResponse: ApiResponse<IProductCard[]> | null;

  getAllProducts: (
    query?: string,
  ) => Promise<ApiResponse<IProductCard[]> | null>;
  getAllForAdmin: (
    query?: string,
  ) => Promise<ApiResponse<IProductCardAdmin[]> | null>;
  getFeaturedProducts: () => Promise<IProductCard[] | null>;
  getProductBySlug: (slug: string) => Promise<IProductDetail | null>;
  getAutoSuggestions: (query: string) => Promise<ISuggestion[] | null>;

  addProduct: (productData: AddProductType) => Promise<void>;

  deleteBySlug: (slug: string) => Promise<void>;
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

      // getResponseSize(res.data);

      set({ productsResponse: res.data });

      return res.data;
    } catch (error: any) {
      console.log(error);

      set({ productsResponse: null });

      throw new Error(error.message);
    }
  },

  getAllForAdmin: async (query?: string) => {
    try {
      let res = await axiosInstance.get(
        `/v1/products/admin${query ? `?${query}&` : ""}`,
      );

      getResponseSize(res.data);

      return res.data;
    } catch (error: any) {
      console.log(error);

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

  // Delete
  deleteBySlug: async (slug) => {
    try {
      let response = await axiosInstance.delete(`/v1/products/${slug}`);

      console.log(response.data);
    } catch (error: any) {}
  },
}));

export default useProductStore;
