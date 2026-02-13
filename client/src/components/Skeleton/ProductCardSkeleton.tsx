import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <Card className="w-full rounded-xl overflow-hidden shadow-md hover:shadow-xl py-0!">
      {/* Image Skeleton */}
      <div className="w-full aspect-3/4 overflow-hidden relative">
        <Skeleton className="size-full overflow-hidden" />
      </div>

      <div className="flex flex-col gap-y-2 px-3 xs:px-4 py-4">
        <div className="flex flex-col gap-y-1">
          {/* Category Skeleton */}
          <Skeleton className="h-3 w-1/3 opacity-60" />

          {/* Title Skeleton */}
          <Skeleton className="h-4 xs:h-4.5" />
        </div>

        {/* Price Skeleton */}
        <Skeleton className="h-3.5 xs:h-4 w-2/3" />

        {/* Button Skeleton */}
        <Skeleton className="h-9" />
      </div>
    </Card>
  );
};

export default ProductCardSkeleton;
