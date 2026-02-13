import { create } from "zustand";
import { axiosInstance } from "./axios";

// Types
import type { ICategory } from "@/types/category.type";
import type { ICategoryResponse } from "@/types/response.type";

interface CategoryStore {
  categories: ICategory[] | null;

  getAllCategories: (query?: string) => Promise<ICategoryResponse | null>;
}

const useCategoryStore = create<CategoryStore>((set) => ({
  categories: null,

  getAllCategories: async (query?: string) => {
    set({ categories: null });

    try {
      let response = await axiosInstance.get(
        `/categories${query ? `?${query}` : ""}`,
      );

      set({ categories: response.data.data });

      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
}));

export default useCategoryStore;
