// Types
import type { CouponDataTable } from "./CouponsHistory";

export const Usage = ({ usageLimit, usedCount }: CouponDataTable["usage"]) => {
  return (
    <div className="flex flex-col">
      <p className="text-nowrap text-foreground font-medium">
        <span className="text-xs text-foreground/80 font-normal">Limit :</span>{" "}
        {usageLimit}
      </p>
      <p className="text-nowrap text-foreground font-medium">
        <span className="text-xs text-foreground/80 font-normal">
          Total Used:
        </span>{" "}
        {usedCount}
      </p>
    </div>
  );
};
