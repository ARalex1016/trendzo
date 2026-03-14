import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Components
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

// Store
import useCategoryStore from "@/store/useCategoryStore";

// Hooks
import { useResponsive } from "@/hooks/use-mobile";

// Utils
import { capitalize } from "@/utils/StringManager";

// Types
import type { ICategoryResponse } from "@/types/response.type";

const SORT_OPTIONS = [
  // { label: "Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Featuerd", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface CategoryPros {
  name: string;
  slug: string;
  id: string;
}

interface FilterProps {
  maxPrice: number;
  categories: CategoryPros[];
  sortBy: SortValue;
}

const defaultFilterValue: FilterProps = {
  maxPrice: 10000,
  categories: [],
  sortBy: "newest",
};

const maxPriceValue = 3000;

const FilterSidebar = () => {
  const { getAllCategories } = useCategoryStore();
  const { breakpoint } = useResponsive();

  const navigate = useNavigate();

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

  const [categoriesRes, setCategoriesRes] = useState<ICategoryResponse | null>(
    null,
  );

  var Filter_Width: string;

  if (breakpoint === "xs" || breakpoint === "sm") {
    Filter_Width = "288px";
  } else if (breakpoint === "md" || breakpoint === "lg") {
    Filter_Width = "250px";
  } else {
    Filter_Width = "288px";
  }

  let padding_top = 16;

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

  const applyFilter = async () => {
    const params = new URLSearchParams();

    if (filter.categories?.length) {
      const categoryIds = filter.categories.map((c) => c.slug).join(",");
      params.append("categories", categoryIds);
    }

    if (filter.maxPrice) {
      params.append("maxPrice", filter.maxPrice.toString());
    }

    if (filter.sortBy) {
      params.append("sortBy", filter.sortBy);
    }

    // ✅ Always reset page to 1
    params.set("page", "1");

    navigate(`/products?${params.toString()}`);
  };

  const fetchAllCategories = async (limit = 5) => {
    try {
      let res = await getAllCategories(`limit=${limit}`);

      setCategoriesRes(res);
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <div
      className="self-start bg-sidebar rounded-xl border border-border sticky top-menu-height flex flex-col gap-y-2 px-6 py-5"
      style={{
        width: Filter_Width,
        height: `calc(100svh - var(--menu-height) - ${padding_top * 2}px)`,
        top: `calc(var(--menu-height) + ${padding_top}px)`,
      }}
    >
      <h3 className="text-sm text-sidebar-foreground/80">Filters</h3>

      <Accordion
        type="multiple"
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar"
      >
        {/* Price Range */}
        <AccordionItem
          value="priceRange"
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <AccordionTrigger className="text-base hover:no-underline! hover:text-primary">
            Price Range
          </AccordionTrigger>

          <AccordionContent className="flex flex-col items-start gap-y-4 px-2 py-4">
            <Slider
              defaultValue={[0]}
              min={0}
              max={maxPriceValue}
              value={[filter.maxPrice]}
              onValueChange={handlePriceChange}
            />

            <div className="w-full flex flex-row justify-between">
              <p className="text-xs text-muted-foreground">
                NPR <span className="text-base font-medium">0</span>
              </p>

              <p className="text-xs">
                NPR{" "}
                <span className="text-base font-medium">
                  {filter.maxPrice >= maxPriceValue
                    ? `${filter.maxPrice}+`
                    : filter.maxPrice}
                </span>
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Category */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-base hover:no-underline! hover:text-primary">
            Category
          </AccordionTrigger>

          <AccordionContent className="max-h-44 overflow-y-auto no-scrollbar flex flex-col items-start gap-y-2 px-2 py-2">
            {categoriesRes &&
              categoriesRes.data.map((category) => {
                return (
                  <div key={category._id} className="flex flex-row gap-x-1">
                    <input
                      type="checkbox"
                      name=""
                      id={category.name}
                      checked={filter.categories.some(
                        (c) => c.id === category._id,
                      )}
                      onChange={() =>
                        handleCategoryToggle({
                          name: category.name,
                          slug: category.slug,
                          id: category._id,
                        })
                      }
                    />

                    <label htmlFor={category.name} className="font-medium">
                      {capitalize(category.name)}
                    </label>
                  </div>
                );
              })}

            {categoriesRes?.meta && categoriesRes?.meta.pages > 1 && (
              <p
                onClick={() => {
                  if (categoriesRes?.meta?.limit) {
                    fetchAllCategories(categoriesRes?.meta?.limit + 5);
                  }
                }}
                className="text-xs font-medium underline text-sidebar-foreground/80 hover:text-sidebar-foreground/60"
              >
                See more
              </p>
            )}

            {categoriesRes?.meta && categoriesRes?.meta.pages === 1 && (
              <p
                onClick={() => fetchAllCategories(5)}
                className="text-xs font-medium underline text-sidebar-foreground/80 hover:text-sidebar-foreground/60"
              >
                See less
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Sort By */}
        <AccordionItem value="sortBy">
          <AccordionTrigger className="text-base hover:no-underline! hover:text-primary">
            Sort By
          </AccordionTrigger>

          <AccordionContent className="flex flex-col items-start gap-y-2 px-2 py-2">
            {SORT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="sortBy" // IMPORTANT: same name groups them
                  value={option.value}
                  checked={filter.sortBy === option.value}
                  onChange={() => handleSortChange(option.value)}
                />
                <span className="font-medium">{option.label}</span>
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Action Buttons */}
      <div className="w-full mt-auto flex flex-row gap-x-2">
        <Button
          onClick={resetFilter}
          variant="outline"
          className="flex-1 text-xs"
        >
          Reset Filters
        </Button>

        <Button onClick={applyFilter} className="flex-1 text-xs">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
