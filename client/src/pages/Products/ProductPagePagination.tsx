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

// Store
import useProductStore from "@/store/useProduct";

// Utils
import { getPaginationRange } from "@/utils/NumberManager";

const ProductPagePagination = () => {
  const { productsResponse } = useProductStore();

  if (!productsResponse) return null;

  const { page: currentPage, pages: totalPages } = productsResponse.meta;

  const isMobile = window.innerWidth < 640;
  const siblingCount = isMobile ? 1 : 2;

  const paginationRange = getPaginationRange(
    currentPage,
    totalPages,
    siblingCount,
  );

  return (
    <Pagination>
      <PaginationContent className="flex flex-wrap justify-center">
        <PaginationItem>
          <PaginationPrevious
          // onClick={() => currentPage > 1 && setPage(currentPage - 1)}
          />
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
                // onClick={() => setPage(item as number)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
          // onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ProductPagePagination;
