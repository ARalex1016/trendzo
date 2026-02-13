import { useState, useEffect } from "react";

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
import useCategoryStore from "@/store/useCategory";

// Utils
import { capitalize } from "@/utils/StringManager";

// Types
import type { FilterProps } from "./Products";
import type { CategoryPros } from "./Products";
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

interface FilterSidebarProps {
  filter: FilterProps;
  onPriceChange: (value: number[]) => void;
  onCategoryToggle: (category: CategoryPros) => void;
  onSortChange: (value: SortValue) => void;
  resetFilter: () => void;
  search: () => void;
}

const maxPriceValue = 3000;

const FilterSidebar = ({
  filter,
  onPriceChange,
  onCategoryToggle,
  onSortChange,
  resetFilter,
  search,
}: FilterSidebarProps) => {
  const { getAllCategories } = useCategoryStore();

  const [categoriesRes, setCategoriesRes] = useState<ICategoryResponse | null>(
    null,
  );

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
      className="w-72 self-start bg-sidebar rounded-xl border border-border sticky top-menu-height flex flex-col gap-y-2 px-6 py-5"
      style={{
        height: "calc(100svh - var(--menu-height))",
      }}
    >
      <h3 className="text-sm text-sidebar-foreground/80">Filters</h3>

      <Accordion
        type="multiple"
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar"
      >
        {/* Price Range */}
        <AccordionItem value="priceRange">
          <AccordionTrigger className="text-base hover:no-underline! hover:text-primary">
            Price Range
          </AccordionTrigger>

          <AccordionContent className="flex flex-col items-start gap-y-4 px-2 py-4">
            <Slider
              defaultValue={[0]}
              min={0}
              max={maxPriceValue}
              value={[filter.maxPrice]}
              onValueChange={onPriceChange}
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
                        onCategoryToggle({
                          name: category.name,
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

            {categoriesRes && categoriesRes?.meta.pages > 1 && (
              <p
                onClick={() => fetchAllCategories(categoriesRes.meta.limit + 5)}
                className="text-xs font-medium underline text-sidebar-foreground/80 hover:text-sidebar-foreground/60"
              >
                See more
              </p>
            )}

            {categoriesRes && categoriesRes?.meta.pages === 1 && (
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
                  onChange={() => onSortChange(option.value)}
                />
                <span className="font-medium">{option.label}</span>
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Action Buttons */}
      <div className="mt-auto flex flex-row gap-x-2">
        <Button onClick={resetFilter} variant="outline">
          Reset Filters
        </Button>

        <Button onClick={search}>Search</Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
