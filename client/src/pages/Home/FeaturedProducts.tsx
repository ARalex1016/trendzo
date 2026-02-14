import { useState, useEffect } from "react";

// Components
import ProductCards from "@/components/Cards/ProductCards";
import Alert from "@/components/Alert";

// Store
import useProductStore from "@/store/useProduct";

// Types
import type { IProduct } from "@/types/product.type";

const FeaturedProducts = () => {
  const { getFeaturedProducts } = useProductStore();

  const [featuredProducts, setFeaturedProducts] = useState<IProduct[] | null>(
    null,
  );

  const fetchFeaturedProducts = async () => {
    try {
      let res = await getFeaturedProducts();

      setFeaturedProducts(res);
    } catch (error: any) {}
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <section className="w-full min-h-svh bg-card flex flex-col justify-center gap-y-10 px-side-spacing py-10">
      {/* Title */}
      <div className="flex flex-col items-center gap-y-4 sm:gap-y-5">
        <h2 className="text-2xl sm:text-4xl font-bold">Featured Products</h2>

        <p className="max-w-5/5 sm:max-w-3/5 text-card-foreground/60 text-center">
          Most loved products by our customers across Nepal
        </p>
      </div>

      {/* Featured Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {!!featuredProducts &&
          featuredProducts.map((product, index) => {
            return <ProductCards key={index} data={product} />;
          })}
      </div>
    </section>
  );
};

export default FeaturedProducts;
