import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ImageWithLens from "@/components/ImageWithLens";
import TrustBadges from "./TrustBadges";

// Icons
import { ShoppingCart } from "lucide-react";

// Store
import useProductStore from "@/store/useProduct";

// Types
import type { IProduct, IVariant } from "@/types/product.type";

const ProductDetails = () => {
  const { getProductBySlug } = useProductStore();
  const { productSlug } = useParams();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>();

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
    if (product) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

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
    <section className="w-full px-side-spacing py-side-spacing">
      <div className="w-full grid lg:grid-cols-2 gap-x-10 mb-16">
        {/* Image Section */}
        <div className="w-full flex flex-col md:flex-row gap-x-5 gap-y-4">
          {/* Image Group */}
          <div className="w-fit h-fit flex flex-row md:flex-col gap-x-2 gap-y-4">
            {Array.from({ length: 5 }).map((_, i) => {
              return (
                <div className="size-16 md:size-20 bg-foreground rounded-lg">
                  {i}
                </div>
              );
            })}
          </div>

          {/* Main Image */}
          {selectedVariant && (
            <ImageWithLens
              src={selectedVariant.images[0]}
              alt="Image"
              className="rounded-2xl aspect-11/12"
            />
          )}
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col gap-y-4">
          {/* Name */}
          <h2 className="text-2xl font-medium">{product.name}</h2>

          {/* Price */}
          <p className="text-2xl text-primary font-bold">
            <span>NPR</span> {product.variants[0].sizes[0].sellingPrice}
          </p>

          {/* Description */}
          <p className="text-foreground/60 line-clamp-3">
            {product.description} {product.description} {product.description}{" "}
            {product.description}
          </p>

          {/* Quantity */}
          <div className="flex flex-row items-center gap-x-4">
            <div className="grid grid-cols-3 border border-primary/60 rounded-lg overflow-hidden">
              <div className="size-10 bg-transparent flex justify-center items-center text-lg font-medium hover:bg-muted">
                -
              </div>

              <div className="size-10 bg-transparent flex justify-center items-center text-lg font-medium">
                1
              </div>

              <div className="size-10 bg-transparent flex justify-center items-center text-lg font-medium hover:bg-muted">
                +
              </div>
            </div>

            <p className="text-foreground/60">Only 30 items left</p>
          </div>

          {/* Action Button */}
          <Button
            size="icon"
            className="w-fit font-medium flex flex-row gap-x-4 px-10 py-5"
          >
            <ShoppingCart />
            Add to Cart
          </Button>

          <Separator />

          <TrustBadges />
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
