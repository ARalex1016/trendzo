import { useSearchParams } from "react-router-dom";

// Components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSidebar } from "@/components/ui/sidebar";

// Hooks
import { useResponsive } from "@/hooks/use-mobile";

// Store
import useProductStore from "@/store/useProduct";

// Utils
import { getPaginationRange } from "@/utils/NumberManager";

const ProductPagePagination = () => {
  const { productsResponse } = useProductStore();
  const { breakpoint } = useResponsive();
  const { state: sidebarState } = useSidebar();

  const [searchParams, setSearchParams] = useSearchParams();

  if (!productsResponse) return null;

  const { page: currentPage, pages: totalPages } = productsResponse.meta;

  var siblingCount: number;

  if (breakpoint === "xs" || breakpoint === "sm") {
    siblingCount = 1;
  } else {
    if (sidebarState === "expanded") {
      siblingCount = 1;
    } else {
      siblingCount = 2;
    }
  }

  const paginationRange = getPaginationRange(
    currentPage,
    totalPages,
    siblingCount,
  );

  const next = () => {
    currentPage < totalPages &&
      setSearchParams({ page: String(currentPage + 1) });
  };

  const prev = () => {
    currentPage > 1 && setSearchParams({ page: String(currentPage - 1) });
  };

  const goTo = (page: number) => {
    page <= totalPages && setSearchParams({ page: String(page) });
  };

  return (
    <Pagination>
      <PaginationContent className="flex flex-row flex-wrap justify-center">
        <PaginationItem>
          <PaginationPrevious onClick={prev} />
        </PaginationItem>

        {paginationRange.map((item, index) => {
          if (item === "ellipsis-left" || item === "ellipsis-right") {
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={item === currentPage}
                onClick={() => goTo(item as number)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext onClick={next} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ProductPagePagination;
