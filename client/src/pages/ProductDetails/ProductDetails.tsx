import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import ImageSection from "./ImageSection";
import DetailsSection from "./DetailsSection";
import DSR_TabSection from "./DSR_TabSection";
import Loader from "@/components/Loader";

// Store
import useProductStore from "@/store/useProductStore";

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
    return <Loader text="Fetching product details..." />;
  }

  if (!product) {
    return (
      <section>
        <p>No Product Found!</p>
      </section>
    );
  }

  return (
    <section className="w-full px-side-spacing py-side-spacing">
      <div className="w-full grid lg:grid-cols-2 gap-x-10 gap-y-8 mb-10">
        <ImageSection images={product.images} />

        <DetailsSection product={product} />
      </div>

      <DSR_TabSection
        description={product.description}
        specifications={product.specifications}
      />
    </section>
  );
};

export default ProductDetails;
