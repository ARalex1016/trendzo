import { create } from "zustand";
import { axiosInstance } from "./axios";

// Types
import type { ICategoryResponse } from "@/types/response.type";

interface CategoryStore {
  categoriesResponse: ICategoryResponse | null;

  getAllCategories: (query?: string) => Promise<ICategoryResponse | null>;
}

const useCategoryStore = create<CategoryStore>((set) => ({
  categoriesResponse: null,

  getAllCategories: async (query?: string) => {
    set({ categoriesResponse: null });

    try {
      let response = await axiosInstance.get(
        `/categories${query ? `?${query}` : ""}`,
      );

      set({ categoriesResponse: response.data });

      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
}));

export default useCategoryStore;
