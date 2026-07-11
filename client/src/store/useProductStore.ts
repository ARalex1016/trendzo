import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

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

  // Admin
  adminProducts: ApiResponse<IProductCardAdmin[]> | null;

  getAllProducts: (
    query?: string,
  ) => Promise<ApiResponse<IProductCard[]> | null>;
  getAllAdminProducts: (
    query?: string,
  ) => Promise<ApiResponse<IProductCardAdmin[]> | null>;
  getFeaturedProducts: () => Promise<IProductCard[] | null>;
  getProductBySlug: (slug: string) => Promise<IProductDetail | null>;
  getAutoSuggestions: (query: string) => Promise<ISuggestion[] | null>;

  addProduct: (productData: AddProductType) => Promise<void>;

  toggleFeaturedBySlug: (slug: string) => Promise<void>;
  toggleActiveBySlug: (slug: string) => Promise<void>;

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

  adminProducts: null,

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
      set({ productsResponse: null });

      throw new Error(error.message);
    }
  },

  getAllAdminProducts: async (query?: string) => {
    try {
      let res = await axiosInstance.get(
        `/v1/products/admin${query ? `?${query}&` : ""}`,
      );

      // getResponseSize(res.data);

      set({ adminProducts: res.data });

      return res.data;
    } catch (error: any) {
      set({ adminProducts: null });

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

  // Create
  addProduct: async (productData) => {
    try {
      const formData = createProductFormData(productData);

      let response = axiosInstance.post(`/v1/products/`, formData);

      toast.promise(response, {
        loading: "Creating product...",
        success: (res) => {
          return res.data.message;
        },
        error: (err) => {
          return (
            err?.response?.data?.message ||
            err.message ||
            "Failed to create product"
          );
        },
      });

      await response;

      console.log(response);
    } catch (error: any) {}
  },

  // Updates
  toggleFeaturedBySlug: async (slug) => {
    try {
      let response = axiosInstance.patch(
        `/v1/products/toggle-featured/slug/${slug}`,
      );

      toast.promise(response, {
        loading: "Updating product featured status...",
        success: (res) => {
          return res.data.message;
        },
        error: (err) => {
          return (
            err?.response?.data?.message || err.message || "Failed to toggle"
          );
        },
      });

      await response;

      // Update from "adminProducts"
      set((state) => {
        if (!state.adminProducts) return state;
        return {
          adminProducts: {
            ...state.adminProducts,
            data: state.adminProducts.data.map((product) =>
              product.slug === slug
                ? {
                    ...product,
                    featured: !product.featured,
                  }
                : product,
            ),
          },
        };
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  toggleActiveBySlug: async (slug) => {
    try {
      let response = axiosInstance.patch(
        `/v1/products/toggle-active/slug/${slug}`,
      );

      toast.promise(response, {
        loading: "Updating product status...",
        success: (res) => {
          return res.data.message;
        },
        error: (err) => {
          return (
            err?.response?.data?.message || err.message || "Failed to toggle"
          );
        },
      });

      await response;

      // Update from "adminProducts"
      set((state) => {
        if (!state.adminProducts) return state;
        return {
          adminProducts: {
            ...state.adminProducts,
            data: state.adminProducts.data.map((product) =>
              product.slug === slug
                ? {
                    ...product,
                    isActive: !product.isActive,
                  }
                : product,
            ),
          },
        };
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Delete
  deleteBySlug: async (slug) => {
    try {
      let response = axiosInstance.delete(`/v1/products/slug/${slug}`);

      toast.promise(response, {
        loading: "Deleting Product...",
        success: (res) => {
          return res.data.message;
        },
        error: (err) => {
          return (
            err?.response?.data?.message || err.message || "Failed to toggle"
          );
        },
      });

      await response;

      // Delete from "adminProducts"
      set((state) => {
        if (!state.adminProducts) return state;

        return {
          adminProducts: {
            ...state.adminProducts,
            data: state.adminProducts.data.filter(
              (product) => product.slug !== slug,
            ),
          },
        };
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
}));

export default useProductStore;
