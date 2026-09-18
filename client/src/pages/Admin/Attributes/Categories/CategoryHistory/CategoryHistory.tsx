import { useState, useEffect } from "react";

// Components
import { DataTable } from "@/components/DataTable/DataTable";
import {
  CategoryName,
  Slug,
  Childrens,
  Status,
  CreatedAt,
  Actions,
  CategoryExpandedData,
} from "./CategoryTableData";

// Store
import useAuthStore from "@/store/useAuthStore";
import useCategoryStore from "@/store/useCategoryStore";

// Types
import type { ICategoryTree, IChildCategory } from "@/types/category.type";
import type { Column } from "@/components/DataTable/types";

export interface CategoryDataTable {
  _id: string;

  name: string;
  description?: string;
  image?: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;

  children: IChildCategory[];

  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  actions: string;
}

const columns: Column<CategoryDataTable>[] = [
  {
    key: "name",
    title: "Category",
    align: "left",
    render: (row) => <CategoryName name={row.name} />,
  },
  {
    key: "slug",
    title: "Slug",
    align: "left",
    render: (row) => <Slug slug={row.slug} />,
  },
  {
    key: "children",
    title: "Children",
    align: "center",
    render: (row) => <Childrens number={row.children.length} />,
  },
  {
    key: "isActive",
    title: "Status",
    align: "left",
    render: (row) => <Status isActive={row.isActive} />,
  },
  {
    key: "createdAt",
    title: "CreatedAt",
    align: "left",
    render: (row) => <CreatedAt date={row.createdAt} />,
  },
  {
    key: "actions",
    title: "Actions",
    align: "center",
    render: (row) => <Actions />,
  },
];

const mapCategoryToCategoryTable = (
  category: ICategoryTree,
): CategoryDataTable => ({
  _id: category._id ?? "",

  name: category.name,

  description: category.description,

  image: category.image ?? "",

  slug: category.slug,

  children: category.children,

  isActive: category.isActive,

  createdBy: category.createdBy,

  createdAt: category?.createdAt ?? "",

  updatedAt: category?.updatedAt ?? "",

  actions: "",
});

const CategoryHistory = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { categoryTree, getAllCategories } = useCategoryStore();

  const [categories, setCategories] = useState<CategoryDataTable[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAllCategories = async () => {
    setLoading(true);
    try {
      getAllCategories();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryTree.length > 0) return;

    if (!isAuthenticated && user?.role !== "admin" && user?.role !== "operator")
      return;

    fetchAllCategories();
  }, []);

  useEffect(() => {
    if (categoryTree.length === 0) return;

    setCategories(categoryTree.map(mapCategoryToCategoryTable));
  }, [categoryTree]);

  return (
    <div>
      <DataTable
        columns={columns}
        data={categories}
        rowKey="_id"
        loading={loading}
        // pagination={pagination}
        expandable={true}
        // onPageChange={handlePageChange}
        renderExpandedRow={(category) => (
          <CategoryExpandedData category={category} />
        )}
      />
    </div>
  );
};

export default CategoryHistory;
