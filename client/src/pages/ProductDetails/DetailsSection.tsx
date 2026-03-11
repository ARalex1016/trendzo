import { useState } from "react";

// Components
import TrustBadges from "./TrustBadges";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Icons
import { ShoppingCart, Share2 } from "lucide-react";

// Store
import useAuthStore from "@/store/useAuthStore";

// Types
import type { IProduct } from "@/types/product.type";

interface DetailsSectionProps {
  product: IProduct;
}

const DetailsSection = ({ product }: DetailsSectionProps) => {
  const { user } = useAuthStore();

  const [selectedVariant, setSelectedVariant] = useState({
    productId: product._id,
    color: "",
    size: "",
    quantity: 1,
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

  return (
    <div className="flex flex-col gap-y-4">
      {/* Name */}
      <h2 className="text-2xl text-foreground font-medium">{product.name}</h2>

      {/* Price */}
      <p className="text-2xl text-foreground font-bold">
        <span>NPR</span> {product.baseSellingPrice}
      </p>

      {/* Description */}
      <p className="text-foreground/60 line-clamp-3">{product.description}</p>

      {/* Colors */}
      <div className="flex flex-col gap-y-1">
        <p className="text-sm text-foreground/60">
          Colors:{" "}
          <span className="text-foreground">{selectedVariant.color}</span>
        </p>

        <div className="flex flex-row gap-x-2">
          {product.colors.map((color) => {
            return (
              <div
                key={color}
                onClick={() =>
                  setSelectedVariant((pre) => ({
                    ...pre,
                    color,
                  }))
                }
                // className={`size-10 rounded-full bg-foreground border bg-${color} ${color === selectedVariant.color ? "border-2 border-primary" : "border-border"}`}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-y-1">
        <p className="text-sm text-foreground/60">
          Size: <span className="text-foreground">{selectedVariant.size}</span>
        </p>

        <div className="flex flex-row gap-x-2">
          {product.sizes.map((size) => {
            return (
              <div
                key={size}
                onClick={() =>
                  setSelectedVariant((pre) => ({
                    ...pre,
                    size,
                  }))
                }
                className={`w-16 rounded-lg border flex justify-center items-center py-2 ${size === selectedVariant.size ? "bg-primary border-foreground" : "bg-background1 border-border"}`}
              >
                {/* {size} */}
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
            <div
              onClick={() =>
                setSelectedVariant((pre) => ({
                  ...pre,
                  quantity: pre.quantity > 1 ? pre.quantity - 1 : pre.quantity,
                }))
              }
              className="size-10 bg-transparent rounded-inherit flex justify-center items-center text-lg font-medium hover:bg-muted"
            >
              -
            </div>

            <div className="size-10 bg-transparent flex justify-center items-center text-lg font-medium">
              {selectedVariant.quantity}
            </div>

            <div
              onClick={() =>
                setSelectedVariant((pre) => ({
                  ...pre,
                  quantity: pre.quantity + 1,
                }))
              }
              className="size-10 bg-transparent rounded-inherit flex justify-center items-center text-lg font-medium hover:bg-muted"
            >
              +
            </div>
          </div>

          <p className="text-sm text-foreground/60">Only 30 items left</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-row gap-x-5 mb-2">
        {/* Add to Cart Button */}
        <Button
          size="icon"
          className="flex-1 font-medium border flex flex-row gap-x-4 px-10 py-5"
        >
          <ShoppingCart />
          Add to Cart
        </Button>

        {/* Share Button */}
        <Button
          variant="outline"
          onClick={handleShare}
          className="hover:bg-primary! py-5"
        >
          <Share2 />
        </Button>
      </div>

      <Separator />

      <TrustBadges />
    </div>
  );
};

export default DetailsSection;
