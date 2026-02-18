import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Components
import ProductCards from "@/components/Cards/ProductCards";
import ProductCardSkeleton from "@/components/Skeleton/ProductCardSkeleton";
import ProductPagePagination from "./ProductPagePagination";

// Hooks
import { useResponsive } from "@/hooks/use-mobile";

// Store
import useProductStore from "@/store/useProduct";

const ProductDisplay = () => {
  const { productsResponse, getAllProducts } = useProductStore();
  const { breakpoint } = useResponsive();

  const [searchParams, setSearchParams] = useSearchParams();

  const fetchAllProducts = async () => {
    try {
      var responsivelimit: string;

      if (breakpoint === "xs" || breakpoint === "sm") {
        responsivelimit = "6";
      } else if (breakpoint === "md") {
        responsivelimit = "10";
      } else {
        responsivelimit = "20";
      }

      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("limit", responsivelimit);
        return params;
      });

      // Always send query string to your store / API
      await getAllProducts(searchParams.toString());
    } catch (error) {}
  };

  // 2️⃣ Fetch when params change
  useEffect(() => {
    fetchAllProducts();
  }, [searchParams.toString()]);

  return (
    <div className="w-full py-4">
      {/* Product Header */}
      <div>
        <h2 className="text-xl font-semibold">All Products</h2>

        {productsResponse && productsResponse?.meta?.total && (
          <p className="text-foreground/60">
            Showing {productsResponse.data.length} of{" "}
            {productsResponse.meta.total} products
          </p>
        )}

        {!productsResponse && (
          <p className="text-foreground/60">Loading products...</p>
        )}
      </div>

      {/* Main Product Display Section */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6 py-4">
        {productsResponse &&
          productsResponse.data.map((product) => {
            return <ProductCards key={product._id} data={product} />;
          })}

        {!productsResponse &&
          Array.from({ length: 4 }).map((_, i) => {
            return <ProductCardSkeleton key={i} />;
          })}
      </div>

      <ProductPagePagination />
    </div>
  );
};

export default ProductDisplay;
