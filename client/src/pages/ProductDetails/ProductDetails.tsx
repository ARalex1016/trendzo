import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import ImageWithLens from "@/components/ImageWithLens";

// Store
import useProductStore from "@/store/useProduct";

// Types
import type { IProduct } from "@/types/product.type";

const ProductDetails = () => {
  const { getProductBySlug } = useProductStore();
  const { productSlug } = useParams();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<Boolean>(false);

  const fetchProductBySlug = async (slug: string) => {
    setLoading(true);

    try {
      let res = await getProductBySlug(slug);

      setProduct(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productSlug) {
      fetchProductBySlug(productSlug);
    }
  }, [productSlug]);

  if (loading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section>
        <p>No Product Found!</p>
      </section>
    );
  }

  return (
    <section>
      {/* Image Section */}
      <div>
        {/* Main Image */}
        <ImageWithLens src={product.variants[0].images[0]} />

        {/* Image Group */}
        <div></div>
      </div>

      {/* Product Details Section */}
    </section>
  );
};

export default ProductDetails;
