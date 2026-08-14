// Lib
import { cn } from "@/lib/utils";

// Hooks
import { useResponsive } from "@/hooks/use-mobile";

// Icons
import { ChevronRight, ChevronLeft } from "lucide-react";

// Types
import type { Pagination } from "./types";

interface Props {
  pagination: Pagination;

  onPageChange(page: number): void;
}

const Button = ({
  disabled,
  onClick,
  className,
  children,
}: React.ComponentProps<"button">) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-lg border border-zinc-700 flex flex-row items-center gap-x-1 px-4 py-2 transition-all duration-200 enabled:cursor-pointer enabled:hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
};

export function DataTablePagination({ pagination, onPageChange }: Props) {
  const { page, pages, limit, total } = pagination;

  const { isMobile } = useResponsive();

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-3">
      <p className="text-sm text-zinc-400">
        Showing{" "}
        <span className="font-medium text-zinc-200">
          {start}-{end}
        </span>{" "}
        of <span className="font-medium text-zinc-200">{total}</span>
      </p>

      <div className="flex gap-2">
        <Button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="size-4" />

          {!isMobile && <span>Previous</span>}
        </Button>

        <Button
          disabled={page === pages}
          onClick={() => onPageChange(page + 1)}
        >
          {!isMobile && <span>Next</span>}

          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
