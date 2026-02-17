// Components
import { Button } from "../ui/button";

// Icons
import { ShoppingCart } from "lucide-react";
import { Eye } from "lucide-react";

// Utils
import { capitalize } from "@/utils/StringManager";
import { formatNepaliAmount } from "@/utils/NumberManager";

// Store
import { useIsMobile } from "@/hooks/use-mobile";

// Types
import type { IProduct } from "@/types/product.type";

interface ProductCardsPros {
  className?: string;
  data: IProduct;
}

const ProductCards = ({ data, className }: ProductCardsPros) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={`w-full bg-card1 rounded-xl overflow-hidden border border-[#2A2A2E] group transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-[#6366F1]/10 hover:-translate-y-2 ${className}`}
    >
      {/* Image Section */}
      <div className="w-full aspect-3/4 overflow-hidden relative">
        {/* Image */}
        <img
          src={data.variants[0].images[0]}
          alt={`${data.name} Image`}
          className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Layer */}
        {/* <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div> */}

        {/* Quick View Button */}
        {!isMobile && (
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm 
             flex items-center justify-center
             opacity-0 group-hover:opacity-100
             pointer-events-none group-hover:pointer-events-auto
             transition-all duration-300`}
          >
            <button className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <Eye className="w-5 h-5" />
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Detail Section */}
      <div className="flex flex-col gap-y-2 px-3 xs:px-4 py-4">
        <div className="flex flex-col gap-y-1">
          {/* Category */}
          <p className="text-xs text-primary line-clamp-1">Shoes</p>

          {/* Title */}
          <h3 className="text-white text-base xs:text-lg font-bold line-clamp-1">
            {capitalize(data.name)}
          </h3>
        </div>

        {/* Price */}
        <p className="text-sm xs:text-base text-primary font-semibold">
          NPR <span>{formatNepaliAmount(data.baseSellingPrice)}</span>
        </p>

        {/* Button */}
        <Button className="text-sm xs:text-base font-normal flex flex-row justify-center items-center">
          <ShoppingCart className="size-4" />
          <span>Add to Cart</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductCards;
