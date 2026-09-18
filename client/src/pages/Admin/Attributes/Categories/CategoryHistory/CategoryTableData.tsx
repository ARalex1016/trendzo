// Components
import { Separator } from "@/components/ui/separator";

// Lib
import { cn } from "@/lib/utils";

// Utils
import { formatDate } from "@/utils/DateManager";

// Icons
import { Eye, Pencil, Trash } from "lucide-react";

// Types
import type { CategoryDataTable } from "./CategoryHistory";
import type { IChildCategory } from "@/types/category.type";

export const CategoryName = ({ name }: { name: CategoryDataTable["name"] }) => {
  return <p className="text-foreground font-medium">{name}</p>;
};

export const Slug = ({ slug }: { slug: CategoryDataTable["slug"] }) => {
  return <p className="text-foreground/60">{slug}</p>;
};

export const Childrens = ({ number }: { number: number }) => {
  return <p className="text-foreground font-medium">{number}</p>;
};

export const Status = ({
  isActive,
}: {
  isActive: CategoryDataTable["isActive"];
}) => {
  const status = isActive ? "Active" : "Inactive";

  return (
    <div>
      <p
        className={cn(
          "font-medium rounded-md border inline-block px-2",
          isActive
            ? "text-success bg-success/10 border-success/40"
            : "text-foreground/60 bg-foreground/5 border-foreground/40",
        )}
      >
        {status}
      </p>
    </div>
  );
};

export const CreatedAt = ({
  date,
}: {
  date: CategoryDataTable["createdAt"];
}) => {
  return <p className="text-foreground/60">{formatDate(date)}</p>;
};

export const Actions = () => {
  return (
    <div className="flex flex-row justify-center gap-x-3">
      <div className="rounded-full p-1.5 hover:bg-accent transition-all duration-200 group">
        <Eye className="size-3.5 text-foreground/60 group-hover:text-foreground" />
      </div>

      <div className="rounded-full p-1.5 hover:bg-accent transition-all duration-200 group">
        <Pencil className="size-3.5 text-foreground/60 group-hover:text-foreground" />
      </div>

      <div className="rounded-full p-1.5 hover:bg-accent transition-all duration-200 group">
        <Trash className="size-3.5 text-destructive/60 group-hover:text-destructive" />
      </div>
    </div>
  );
};

const ChildCategory = ({
  childCategory,
}: {
  childCategory: IChildCategory;
}) => {
  return (
    <div className="grid grid-cols-5 gap-x-3">
      <CategoryName name={childCategory.name} />

      <Slug slug={childCategory.slug} />

      <Status isActive={childCategory.isActive} />

      <CreatedAt date={childCategory.createdAt} />

      <Actions />
    </div>
  );
};

export const CategoryExpandedData = ({
  category,
}: {
  category: CategoryDataTable;
}) => {
  return (
    <div className="space-y-2">
      {category.children.map((child) => {
        return (
          <div key={`${child.name}-${child._id}`} className="space-y-1">
            <ChildCategory
              key={`${child.name}-${child._id}`}
              childCategory={child}
            ></ChildCategory>

            <Separator />
          </div>
        );
      })}
    </div>
  );
};
