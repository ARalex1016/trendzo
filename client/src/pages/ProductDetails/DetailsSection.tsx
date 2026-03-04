import { useState } from "react";

// Components
import TrustBadges from "./TrustBadges";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Icons
import { ShoppingCart } from "lucide-react";

// Types
import type { IProduct } from "@/types/product.type";

interface DetailsSectionProps {
  product: IProduct;
}

const DetailsSection = ({ product }: DetailsSectionProps) => {
  const colors = product.variants.flatMap((variant) => variant.color);

  return (
    <div className="flex flex-col gap-y-4">
      {/* Name */}
      <h2 className="text-2xl text-foreground font-medium">{product.name}</h2>

      {/* Price */}
      <p className="text-2xl text-foreground font-bold">
        <span>NPR</span> {product.variants[0].sizes[0].sellingPrice}
      </p>

      {/* Description */}
      <p className="text-foreground/60 line-clamp-3">{product.description}</p>

      {/* Colors */}
      <div className="flex flex-col gap-y-2">
        <p className="text-sm">Colors:</p>

        <div className="flex flex-row gap-x-5">
          {colors.map((color) => {
            return (
              <div
                className={`size-10 rounded-full bg-foreground bg-${color}`}
              ></div>
            );
          })}
        </div>
      </div>

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
        className="w-full md:w-fit font-medium flex flex-row gap-x-4 px-10 py-5 mb-2"
      >
        <ShoppingCart />
        Add to Cart
      </Button>

      <Separator />

      <TrustBadges />
    </div>
  );
};

export default DetailsSection;
