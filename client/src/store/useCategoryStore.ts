import { create } from "zustand";
import { axiosInstance } from "./axios";

// Utils
import { buildCategoryData } from "@/utils/buildCategoryData";

// Types
import type { ICategoryResponse } from "@/types/response.type";
import type { ICategory, ICategoryTree } from "@/types/category.type";

interface CategoryStore {
  categoriesResponse: ICategoryResponse | null;

  categoryTree: ICategoryTree[];

  categoryMap: Record<string, ICategory>;

  getAllCategories: (query?: string) => Promise<ICategoryResponse | null>;
}

const useCategoryStore = create<CategoryStore>((set) => ({
  categoriesResponse: null,

  categoryTree: [],

  categoryMap: {},

  getAllCategories: async (query?: string) => {
    set({ categoriesResponse: null, categoryTree: [] });

    try {
      let response = await axiosInstance.get(
        `/v1/categories${query ? `?${query}` : ""}`,
      );

      const categories = response.data.data;

      const { categoryTree, categoryMap } = buildCategoryData(categories);

      set({
        categoriesResponse: response.data,
        categoryTree,
        categoryMap,
      });

      return response.data;
    } catch (error: any) {
      set({ categoriesResponse: null, categoryTree: [] });

      throw new Error(error.message);
    }
  },
}));

export default useCategoryStore;
