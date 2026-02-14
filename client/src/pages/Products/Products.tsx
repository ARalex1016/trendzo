import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Components
import FilterSidebar from "./FilterSidebar";
import ProductDisplay from "./ProductDisplay";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  // DrawerDescription,
  // DrawerFooter,
  // DrawerHeader,
  // DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Store
import useProductStore from "@/store/useProduct";
import { useIsMobile } from "@/hooks/use-mobile";

// Types
import type { SortValue } from "./FilterSidebar";

// Icons
import { FilterIcon, X } from "lucide-react";

export interface CategoryPros {
  name: string;
  id: string;
}

export interface FilterProps {
  maxPrice: number;
  categories: CategoryPros[];
  sortBy: SortValue;
}

const defaultFilterValue: FilterProps = {
  maxPrice: 10000,
  categories: [],
  sortBy: "newest",
};

const Products = () => {
  const { getAllProducts } = useProductStore();

  const { state } = useLocation();

  const [filter, setFilter] = useState<FilterProps>(() => {
    if (state?.category) {
      return {
        ...defaultFilterValue,
        categories: [...defaultFilterValue.categories, state.category],
      };
    }

    return defaultFilterValue;
  });

  const isMobile = useIsMobile();

  const handlePriceChange = (value: number[]) => {
    setFilter((pre) => ({
      ...pre,
      maxPrice: value[0],
    }));
  };

  const handleCategoryToggle = (category: CategoryPros) => {
    setFilter((pre) => {
      const exists = pre.categories.some((c) => c.id === category.id);

      return {
        ...pre,
        categories: exists
          ? pre.categories?.filter((c) => c.id !== category.id)
          : [...pre.categories, category],
      };
    });
  };

  const handleSortChange = (value: SortValue) => {
    setFilter((pre) => ({
      ...pre,
      sortBy: value,
    }));
  };

  const resetFilter = () => {
    setFilter(defaultFilterValue);
  };

  const fetchAllProducts = async () => {
    const params = new URLSearchParams();

    if (filter.maxPrice) {
      params.append("maxPrice", filter.maxPrice.toString());
    }

    if (filter.categories?.length) {
      const categoryIds = filter.categories.map((c) => c.id).join(",");
      params.append("categories", categoryIds);
    }

    if (filter.sortBy) {
      params.append("sortBy", filter.sortBy);
    }

    try {
      await getAllProducts(params.toString());
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <section className="w-full min-h-svh flex flex-row gap-x-8 px-side-spacing">
      {/* Filter for Desktop */}
      {!isMobile && (
        <FilterSidebar
          filter={filter}
          onPriceChange={handlePriceChange}
          onCategoryToggle={handleCategoryToggle}
          onSortChange={handleSortChange}
          resetFilter={resetFilter}
          search={fetchAllProducts}
        />
      )}

      {/* FIlter for Small Devices (Mobile) */}
      {isMobile && (
        <Drawer direction="left">
          <DrawerTrigger className="">
            <FilterIcon />
          </DrawerTrigger>

          <DrawerContent className="w-fit! px-0">
            <DrawerClose
              aria-label="Close filter"
              className="rounded-md p-1 hover:bg-muted absolute top-2 right-2"
            >
              <X className="h-5 w-5" />
            </DrawerClose>

            <FilterSidebar
              filter={filter}
              onPriceChange={handlePriceChange}
              onCategoryToggle={handleCategoryToggle}
              onSortChange={handleSortChange}
              resetFilter={resetFilter}
              search={fetchAllProducts}
            />
          </DrawerContent>
        </Drawer>
      )}

      <ProductDisplay />
    </section>
  );
};

export default Products;
