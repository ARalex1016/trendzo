import z from "zod";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

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

// Icons
import { Search } from "lucide-react";

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
  const { categoryTree, getAllCategories } = useCategoryStore();

  const form = useFormContext<CategorySchemaType>();

  const fetchAllCategories = async () => {
    try {
      await getAllCategories();
    } catch (error) {}
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

          <CounterContainer counter={form.watch().categories.length} />
        </div>

        {/* Search */}
        <div>
          <InputFieldWithLabelNIcon
            Icon={Search}
            type="search"
            placeholder="Search Categories..."
          />
        </div>

        {/* Content */}
        <Accordion
          type="multiple"
          className="max-h-64 overflow-y-auto no-scrollbar"
        >
          {categoryTree.length >= 1 &&
            categoryTree.map((parent) => {
              return (
                <AccordionItem
                  key={parent._id}
                  value="item-1"
                  disabled={parent.children.length === 0}
                >
                  <AccordionTrigger>{parent.name}</AccordionTrigger>

                  <AccordionContent className="space-y-2">
                    {parent.children.length >= 1 &&
                      parent.children.map((child) => {
                        return (
                          <FormField
                            control={form.control}
                            name="categories"
                            render={({ field }) => (
                              <FormItem>
                                <label
                                  key={child._id}
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
                                      field.value?.includes(child._id) ?? false
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
                                        field.onChange([...current, child._id]);
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
