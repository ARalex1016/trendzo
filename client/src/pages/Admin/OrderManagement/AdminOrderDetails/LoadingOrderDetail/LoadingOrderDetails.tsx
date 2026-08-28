// Components
import { PageShell } from "@/components/Container";
import { SkeletonBackButton } from "@/components/Container";
import { OrderHeaderSkeleton } from "./OrderHeaderSkeleton";
import { OrderProgressSkeleton } from "./OrderProgressSkeleton";
import OrderItemsSkeleton from "./OrderItemsSkeleton";
import FinancialSummarySkeleton from "./FinancialSummarySkeleton";
import { PaymentDetailsSkeleton } from "./PaymentDetailsSkeleton";
import { OrderCustomerCardSkeleton } from "./OrderCustomerCardSkeleton";
import { OrderDeliveryCardSkeleton } from "./OrderDeliveryCardSkeleton";

interface LoadingOrderDetailsProps {
  orderNumber?: string;
}

export const LoadingOrderDetails: React.FC<LoadingOrderDetailsProps> = ({
  orderNumber,
}) => {
  return (
    <PageShell>
      <SkeletonBackButton />

      <OrderHeaderSkeleton />

      <OrderProgressSkeleton />

      <OrderItemsSkeleton />

      <PaymentDetailsSkeleton />

      <FinancialSummarySkeleton />

      <OrderCustomerCardSkeleton />

      <OrderDeliveryCardSkeleton />
    </PageShell>
  );
};
