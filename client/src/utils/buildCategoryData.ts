import type { ICategory, ICategoryTree } from "@/types/category.type";

interface BuildCategoryDataResult {
  categoryTree: ICategoryTree[];
  categoryMap: Record<string, ICategory>;
}

export const buildCategoryData = (
  categories: ICategory[],
): BuildCategoryDataResult => {
  const categoryMap: Record<string, ICategory> = {};
  const childrenMap = new Map<string, ICategory[]>();

  const roots: ICategory[] = [];

  for (const category of categories) {
    categoryMap[category._id] = category;

    // Root category
    if (category.parentCategory === null) {
      roots.push(category);
      continue;
    }

    const parentId = category.parentCategory;
    if (!parentId) continue;

    const existingChildren = childrenMap.get(parentId) ?? [];
    existingChildren.push(category);
    childrenMap.set(parentId, existingChildren);
  }

  const categoryTree: ICategoryTree[] = roots.map((parent) => ({
    ...parent,
    parentCategory: null,
    children: childrenMap.get(parent._id) ?? [],
  }));

  return {
    categoryTree,
    categoryMap,
  };
};
