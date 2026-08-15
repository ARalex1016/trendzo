import z from "zod";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Fuse from "fuse.js";

// Components
import { Form, FormField, FormItem } from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InputFieldWithLabelNIcon } from "@/components/InputFields";

// Lib
import { cn } from "@/lib/utils";

// Store
import useCategoryStore from "@/store/useCategoryStore";

// Validations
import { addProductSchema } from "@/validations/product.validator";

// Types
import type { ICategory } from "@/types/category.type";

// Icons
import { Search, X } from "lucide-react";

// ✅ Infer only the fields we need
export const categoriesSchema = addProductSchema.pick({
  categories: true,
});

export type CategorySchemaType = z.infer<typeof categoriesSchema>;

const CounterContainer = ({
  text = "selected",
  counter,
}: {
  text?: string;
  counter: number;
}) => {
  return (
    <div className="size-fit text-[10px] text-foreground/70 bg-accent rounded-xl px-3 py-1">
      <span>{counter}</span> {text}
    </div>
  );
};

const CategoriesContainer = () => {
  const { categoriesResponse, categoryTree, categoryMap, getAllCategories } =
    useCategoryStore();

  const [searchedCategories, setSearchedCategories] = useState<
    ICategory[] | null
  >(null);

  const form = useFormContext<CategorySchemaType>();

  const categories = form.watch("categories");

  const removeCategory = (categoryIdToRemove: string) => {
    form.setValue(
      "categories",
      categories.filter((categoryId) => categoryId !== categoryIdToRemove),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const fetchAllCategories = async () => {
    try {
      await getAllCategories();
    } catch (error) {}
  };

  const searchCategory = (search: string) => {
    if (!search) {
      setSearchedCategories(null);
      return;
    }

    const fuse =
      categoriesResponse?.data &&
      new Fuse(
        categoriesResponse?.data.filter(
          (category) => category.parentCategory !== null,
        ),
        {
          keys: ["name"],
          threshold: 0.3, // lower = stricter, higher = fuzzier
          ignoreLocation: true,
        },
      );

    const results = fuse?.search(search);
    const matchedCategories = results?.map((r) => r.item);

    if (matchedCategories) {
      setSearchedCategories(matchedCategories);
    } else {
      setSearchedCategories(null);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <Form {...form}>
      <div className="flex flex-col gap-y-3">
        {/* Title & Counter */}
        <div className="flex flex-row justify-between">
          <p className="font-medium">Categories</p>

          <CounterContainer counter={categories?.length} />
        </div>

        {/* Search */}
        <InputFieldWithLabelNIcon
          Icon={Search}
          type="search"
          placeholder="Search Categories..."
          onChange={(e) => searchCategory(e.target.value)}
        />

        {/* Selected Categories */}
        {categories?.length >= 1 && (
          <div className="flex flex-row gap-x-1 gap-y-2 flex-wrap">
            {categories.map((categoryId) => {
              return (
                <div
                  key={categoryId}
                  className="w-fit bg-primary/10 border border-primary/80 rounded-xl flex flex-row flex-nowrap items-center gap-x-2 px-3 py-1 md:py-1.5"
                >
                  <p
                    key={categoryId}
                    className="text-[10px] md:text-xs text-foreground/80 font-medium line-clamp-1"
                  >
                    {categoryMap[categoryId]?.name}
                  </p>

                  <button
                    onClick={() => removeCategory(categoryId)}
                    className="rounded-full flex justify-center items-center p-0.5 hover:bg-primary/50 transition-all duration-200"
                  >
                    <X className="size-2.5 md:size-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {searchedCategories &&
          searchedCategories.map((category) => {
            return (
              <FormField
                key={category._id}
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <label
                      key={category._id}
                      htmlFor={category._id}
                      className={cn(
                        "rounded-xl border-2 border-transparent flex flex-row items-center gap-x-2 px-4 py-3 transition-all duration-200 group",
                        field.value?.includes(category._id)
                          ? "bg-primary/10 border-primary/60"
                          : "bg-accent/60 hover:bg-accent hover:border-border",
                      )}
                    >
                      <input
                        {...field}
                        type="checkbox"
                        name=""
                        id={category._id}
                        checked={field.value?.includes(category._id) ?? false}
                        onChange={() => {
                          const current = field.value || [];

                          const exists = current.includes(category._id);

                          if (exists) {
                            field.onChange(
                              current.filter((id) => id !== category._id),
                            );
                          } else {
                            field.onChange([...current, category._id]);
                          }
                        }}
                      />

                      <p
                        className={cn(
                          "text-base text-foreground/60  font-medium transition-all duration-200",
                          field.value?.includes(category._id)
                            ? ""
                            : "group-hover:text-foreground",
                        )}
                      >
                        {category.name}
                      </p>
                    </label>
                  </FormItem>
                )}
              />
            );
          })}

        {!searchedCategories && (
          <Accordion
            type="multiple"
            className="max-h-64 overflow-y-auto no-scrollbar"
          >
            {categoryTree?.length >= 1 &&
              categoryTree.map((parent) => {
                return (
                  <AccordionItem
                    key={parent._id}
                    value="item-1"
                    disabled={parent?.children?.length === 0}
                  >
                    <AccordionTrigger>{parent?.name}</AccordionTrigger>

                    <AccordionContent className="space-y-2">
                      {parent?.children?.length >= 1 &&
                        parent?.children?.map((child) => {
                          return (
                            <FormField
                              key={child._id}
                              control={form.control}
                              name="categories"
                              render={({ field }) => (
                                <FormItem>
                                  <label
                                    htmlFor={child._id}
                                    className={cn(
                                      "rounded-xl border-2 border-transparent flex flex-row items-center gap-x-2 px-4 py-3 transition-all duration-200 group",
                                      field.value?.includes(child._id)
                                        ? "bg-primary/10 border-primary/60"
                                        : "bg-accent/60 hover:bg-accent hover:border-border",
                                    )}
                                  >
                                    <input
                                      {...field}
                                      type="checkbox"
                                      name=""
                                      id={child._id}
                                      checked={
                                        field.value?.includes(child._id) ??
                                        false
                                      }
                                      onChange={() => {
                                        const current = field.value || [];

                                        const exists = current.includes(
                                          child._id,
                                        );

                                        if (exists) {
                                          field.onChange(
                                            current.filter(
                                              (id) => id !== child._id,
                                            ),
                                          );
                                        } else {
                                          field.onChange([
                                            ...current,
                                            child._id,
                                          ]);
                                        }
                                      }}
                                    />

                                    <p
                                      className={cn(
                                        "text-base text-foreground/60  font-medium transition-all duration-200",
                                        field.value?.includes(child._id)
                                          ? ""
                                          : "group-hover:text-foreground",
                                      )}
                                    >
                                      {child.name}
                                    </p>
                                  </label>
                                </FormItem>
                              )}
                            />
                          );
                        })}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        )}
      </div>
    </Form>
  );
};

const Categories = () => {
  return (
    <div>
      <CategoriesContainer />
    </div>
  );
};

export default Categories;
