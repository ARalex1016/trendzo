// Components
import ProductCards from "@/components/Cards/ProductCards";
import ProductCardSkeleton from "@/components/Skeleton/ProductCardSkeleton";

// Store
import useProductStore from "@/store/useProduct";

const ProductDisplay = () => {
  const { productsResponse } = useProductStore();

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
    </div>
  );
};

export default ProductDisplay;
