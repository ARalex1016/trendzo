import { create } from "zustand";
import { axiosInstance } from "./axios";

// Types
import type { ICategoryResponse } from "@/types/response.type";
import type {
  ICategory,
  IParentCategory,
  IChildCategory,
  ICategoryTree,
} from "@/types/category.type";

interface CategoryStore {
  categoriesResponse: ICategoryResponse | null;

  categoryTree: ICategoryTree[];

  getAllCategories: (query?: string) => Promise<ICategoryResponse | null>;
}

const useCategoryStore = create<CategoryStore>((set) => ({
  categoriesResponse: null,

  categoryTree: [],

  getAllCategories: async (query?: string) => {
    set({ categoriesResponse: null, categoryTree: [] });

    try {
      let response = await axiosInstance.get(
        `/v1/categories${query ? `?${query}` : ""}`,
      );

      const parentCategories = response.data.data.filter(
        (cat: ICategory) => !cat.parentCategory,
      );

      const categoryTree = parentCategories.map((parent: IParentCategory) => ({
        ...parent,
        children: response.data.data.filter(
          (cat: IChildCategory) =>
            cat.parentCategory?.toString() === parent._id.toString(),
        ),
      }));

      set({ categoriesResponse: response.data, categoryTree });

      return response.data;
    } catch (error: any) {
      set({ categoriesResponse: null, categoryTree: [] });

      throw new Error(error.message);
    }
  },
}));

export default useCategoryStore;
