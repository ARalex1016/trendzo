// Lib
import { cn } from "@/lib/utils";

// Components
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Icons
import {
  Ruler,
  Hash,
  Footprints,
  SlidersHorizontal,
  Dot,
  Calendar,
  Ellipsis,
} from "lucide-react";

// Utils
import { formatDate } from "@/utils/DateManager";

// Store
import useSizeStore from "@/store/useSizeStore";

// Types
import type { SizeDataTable } from "./SizeHistory";
import type { SizeType } from "@/types/size.types";
import type { LucideIcon } from "lucide-react";

const sizeConfig: Record<
  SizeType,
  {
    label: string;
    shortLabel: string;
    icon: LucideIcon;
    className: string;
  }
> = {
  alpha: {
    label: "Alpha",
    shortLabel: "Al",
    icon: Ruler,
    className: "text-primary bg-primary/10",
  },
  numeric: {
    label: "Numeric",
    shortLabel: "Nu",
    icon: Hash,
    className: "text-info bg-info/10",
  },
  shoe: {
    label: "Shoe",
    shortLabel: "Sh",
    icon: Footprints,
    className: "text-success bg-success/10",
  },
  custom: {
    label: "Custom",
    shortLabel: "Cu",
    icon: SlidersHorizontal,
    className: "text-warning bg-warning/10",
  },
};

export const SizeName = ({
  name,
  slug,
  type,
}: {
  name: SizeDataTable["name"];
  slug: SizeDataTable["slug"];
  type: SizeDataTable["type"];
}) => {
  return (
    <div className="flex flex-row items-center gap-x-2 sm:gap-x-3">
      <p
        className={cn(
          "size-fit font-medium rounded-md px-2 py-1.5",
          sizeConfig[type].className,
        )}
      >
        {type === "custom" ? "Cu" : sizeConfig[type].shortLabel}
      </p>

      <div className="flex flex-col">
        <p className="text-sm text-foreground font-medium">{name}</p>

        <p className="text-xs text-foreground/60">{slug}</p>
      </div>
    </div>
  );
};

export const Type = ({ type }: { type: SizeDataTable["type"] }) => {
  const Icon = sizeConfig[type].icon;

  return (
    <div
      className={cn(
        "rounded-md flex flex-row justify-center items-center gap-x-2 px-2 py-0.5",
        sizeConfig[type].className,
      )}
    >
      <Icon className="size-3.5" />

      <p className="text-sm font-medium">{sizeConfig[type].label}</p>
    </div>
  );
};

export const Measurement = ({
  measurements,
}: {
  measurements: SizeDataTable["measurements"];
}) => {
  return <div></div>;
};

export const Unit = ({ unit }: { unit: SizeDataTable["unit"] }) => {
  return (
    <p className="inline-block text-foreground/60 font-medium bg-accent rounded-md px-1.5 pb-0.5">
      {unit}
    </p>
  );
};

export const Status = ({
  isActive,
}: {
  isActive: SizeDataTable["isActive"];
}) => {
  return (
    <div
      className={cn(
        "flex flex-row justify-center items-center border rounded-md pl-0.5 pr-2",
        isActive
          ? "text-success bg-success/10 border-success/40"
          : "text-muted-foreground bg-accent border-border",
      )}
    >
      <Dot className={cn("scale-150")} />

      <p className="text-xs font-medium">{isActive ? "Active" : "Inactive"}</p>
    </div>
  );
};

export const CreatedAt = ({
  createdAt,
}: {
  createdAt: SizeDataTable["createdAt"];
}) => {
  return (
    <div className="flex flex-row items-center gap-x-1.5">
      <Calendar className="size-3.5 text-foreground/60" />

      <p className="text-sm text-foreground/60">{formatDate(createdAt)}</p>
    </div>
  );
};

const DropDownMenuAction = ({
  onDelete,
}: {
  onDelete: () => void | Promise<void>;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="size-7 flex flex-row justify-center items-center rounded-full p-1.5 hover:bg-accent transition-all duration-300">
          <Ellipsis />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-accent/5 backdrop-blur-lg p-3 mr-side-spacing">
        <DropdownMenuGroup>
          <DropdownMenuItem>Open</DropdownMenuItem>

          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={onDelete}
            className="py-1!"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Actions = ({ sizeId }: { sizeId: SizeDataTable["_id"] }) => {
  const { deleteSize } = useSizeStore();

  const handleDelete = async () => {
    try {
      await deleteSize(sizeId);
    } catch (error) {}
  };

  return (
    <div className="w-full flex justify-center items-center">
      <DropDownMenuAction onDelete={handleDelete} />
    </div>
  );
};
