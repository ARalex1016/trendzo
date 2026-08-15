import { useState, useEffect } from "react";

// Components
import TrustBadges from "./TrustBadges";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Config
import { BRAND } from "@/config/brand";

// Icons
import { ShoppingCart, Share2 } from "lucide-react";

// Store
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";

// Lib
import { cn } from "@/lib/utils";

// Types
import type { IProductDetail } from "@/types/product/index.type";
import type { ICartItem } from "@/types/cart.type";

interface DetailsSectionProps {
  product: IProductDetail;
}

const DetailsSection = ({ product }: DetailsSectionProps) => {
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();

  const [selectedVariant, setSelectedVariant] = useState<ICartItem>({
    product: product._id,
    productName: product.name,
    slug: product.slug,
    productImage: product.thumbnail,
    price: product.baseSellingPrice,
    color: {
      _id: "",
      name: "",
      hexCode: "",
    },
    size: {
      _id: "",
      name: "",
    },
    quantity: 1,
    subtotal: product.baseSellingPrice,
  });

  const handleShare = async () => {
    try {
      const url = new URL(window.location.href);

      if (user?.referralId) {
        url.searchParams.set("ref", user.referralId);
      }

      await navigator.share({
        title: product.name,
        text: "Check this product",
        url: url.toString(),
      });
    } catch (error) {
      console.error("Sharing failed", error);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant.color._id) {
      alert("Please select a color");
      return;
    }

    if (!selectedVariant.size._id) {
      alert("Please select a size");
      return;
    }

    addToCart(selectedVariant);
  };

  // Updating Subtotal
  useEffect(() => {
    setSelectedVariant((pre) => ({
      ...pre,
      subtotal: pre.price * pre.quantity,
    }));
  }, [selectedVariant.quantity]);

  return (
    <div className="flex flex-col gap-y-3">
      {/* Name */}
      <h2 className="text-2xl text-foreground font-medium">{product.name}</h2>

      {/* Price */}
      <p className="text-2xl text-primary font-bold">
        <span>{BRAND.currency.code}</span> {product.baseSellingPrice}
      </p>

      {/* Description */}
      <p className="text-foreground/60 line-clamp-3">{product.description}</p>

      {/* Colors */}
      <div className="flex flex-col gap-y-1">
        <p className="text-sm text-foreground/60">
          Colors:{" "}
          <span className="text-foreground font-medium">
            {selectedVariant.color.name}
          </span>
        </p>

        <div className="flex flex-row gap-x-2">
          {product?.colors?.map((color) => {
            const selectedColor = selectedVariant?.color._id === color._id;

            return (
              <div
                key={color._id}
                onClick={() =>
                  setSelectedVariant((pre) => ({
                    ...pre,
                    color: {
                      _id: color._id,
                      name: color.name,
                      hexCode: color.hexCode,
                    },
                  }))
                }
                className={cn(
                  "size-8 rounded-full border-2 transition-all  duration-200",
                  selectedColor ? "border-primary scale-110" : "border-accent",
                )}
                style={{
                  backgroundColor: color.hexCode,
                }}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-y-1">
        <p className="text-sm text-foreground/60">
          Size:{" "}
          <span className="text-foreground font-medium">
            {selectedVariant.size.name}
          </span>
        </p>

        <div className="flex flex-row gap-x-2">
          {product?.sizes?.map((size) => {
            const selectedSize = selectedVariant.size._id === size._id;

            return (
              <div
                key={size._id}
                onClick={() =>
                  setSelectedVariant((pre) => ({
                    ...pre,
                    size: {
                      _id: size._id,
                      name: size.name,
                    },
                  }))
                }
                className={cn(
                  "w-16 rounded-lg border flex justify-center items-center py-2 transition-all  duration-200",
                  selectedSize ? "border-primary scale-110" : "border-accent",
                )}
              >
                {size.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex flex-col gap-y-1">
        <p className="text-sm text-foreground/60">Quantity </p>

        <div className="flex flex-row items-center gap-x-4">
          <div className="grid grid-cols-3 border border-border rounded-lg overflow-hidden p-1">
            <button
              disabled={selectedVariant.quantity <= 1}
              onClick={() =>
                setSelectedVariant((pre) => ({
                  ...pre,
                  quantity: pre.quantity > 1 ? pre.quantity - 1 : pre.quantity,
                }))
              }
              className="size-10 bg-transparent rounded-inherit flex justify-center items-center text-lg font-medium hover:bg-muted disabled:cursor-not-allowed"
            >
              −
            </button>

            <div className="size-10 bg-transparent flex justify-center items-center text-lg font-medium">
              {selectedVariant.quantity}
            </div>

            <button
              onClick={() =>
                setSelectedVariant((pre) => ({
                  ...pre,
                  quantity: pre.quantity + 1,
                }))
              }
              className="size-10 bg-transparent rounded-inherit flex justify-center items-center text-lg font-medium hover:bg-muted"
            >
              +
            </button>
          </div>

          <p className="text-sm text-foreground/60">Only 30 items left</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-row gap-x-5 mb-2">
        {/* Add to Cart Button */}
        <Button
          size="icon"
          onClick={handleAddToCart}
          className="flex-1 font-medium border flex flex-row gap-x-4 px-10 py-5"
        >
          <ShoppingCart />
          Add to Cart
        </Button>

        {/* Share Button */}
        <Button
          variant="outline"
          onClick={handleShare}
          className="hover:bg-primary/10! hover:border-primary! py-5 group transition-all duration-300"
        >
          <Share2 className="group-hover:text-primary transition-all duration-300" />
        </Button>
      </div>

      <Separator />

      <TrustBadges />
    </div>
  );
};

export default DetailsSection;
