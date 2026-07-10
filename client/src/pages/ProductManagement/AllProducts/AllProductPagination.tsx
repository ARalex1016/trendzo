// Store
import useProductStore from "@/store/useProductStore";
import { useResponsive } from "@/hooks/use-mobile";

// Lib
import { cn } from "@/lib/utils";

// Utils
import { getPaginationRange } from "@/utils/NumberManager";

const ButtonPaginate = ({
  onClick,
  className,
  children,
  ...props
}: React.ComponentProps<"button">) => {
  return (
    <button
      onClick={onClick}
      {...props}
      className={cn(
        "text-xs sm:text-sm border shadow-lg rounded-xl px-2 sm:px-3 py-1 enabled:hover:scale-105 enabled:cursor-pointer disabled:cursor-not-allowed disabled:text-foreground/80",
        className,
      )}
    >
      {children}
    </button>
  );
};

const AllProductPagination = () => {
  const { adminProducts, getAllAdminProducts } = useProductStore();
  const { breakpoint } = useResponsive();

  if (!adminProducts?.meta) return null;

  const {
    page: currentPage,
    limit,
    pages: totalPages,
    total: totalProducts,
  } = adminProducts.meta;

  const start = totalProducts === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalProducts);

  let siblingCount: number;

  if (breakpoint === "xs" || breakpoint === "sm") {
    siblingCount = 0;
  } else {
    siblingCount = 1;
  }

  const paginationRange = getPaginationRange(
    currentPage,
    totalPages,
    siblingCount,
  );

  const fetchPage = async (page: number) => {
    if (page < 1 || page > totalPages) return;

    try {
      await getAllAdminProducts(`page=${page}`);
    } catch (error) {
      console.error(error);
    }
  };

  const next = () => fetchPage(currentPage + 1);

  const prev = () => fetchPage(currentPage - 1);

  const goTo = fetchPage;

  if (totalPages <= 0) return null;

  return (
    <div className="bg-accent/50 flex flex-row justify-between items-center px-4 py-3">
      <p className="text-foreground/80 text-xs sm:text-sm">
        Showing{" "}
        <span className="font-medium text-foreground">
          {start}-{end}
        </span>{" "}
        of <span className="font-medium text-foreground">{totalProducts}</span>{" "}
        products
      </p>

      <div className="flex flex-row gap-x-1 sm:gap-x-3">
        <ButtonPaginate disabled={currentPage <= 1} onClick={prev} className="">
          Pre
        </ButtonPaginate>

        {paginationRange?.map((item, index) => {
          if (item === "ellipsis-left" || item === "ellipsis-right") {
            return <p key={`${item}-${index}`}>...</p>;
          }

          return (
            <ButtonPaginate
              key={item}
              disabled={item === currentPage}
              onClick={() => goTo(item)}
              className={cn(
                item === currentPage
                  ? "text-primary! font-medium border-primary shadow-xs shadow-primary scale-105"
                  : "border-border",
              )}
            >
              {item}
            </ButtonPaginate>
          );
        })}

        <ButtonPaginate
          disabled={currentPage >= totalPages}
          onClick={next}
          className="shadow-lg enabled:hover:scale-105 enabled:cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </ButtonPaginate>
      </div>
    </div>
  );
};

export default AllProductPagination;
