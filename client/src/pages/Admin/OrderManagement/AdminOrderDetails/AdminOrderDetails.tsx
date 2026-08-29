import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Components
import { PageShell } from "@/components/Container";
import { LoadingOrderDetails } from "./LoadingOrderDetail/LoadingOrderDetails";
import { OrderNotFound } from "./OrderNotFound";
import OrderHeader from "./SectionOrderDetails/OrderHeader";
import { OrderProgress } from "./SectionOrderDetails/OrderProgress";
import OrderItems from "./SectionOrderDetails/OrderItemsSection";
import FinancialSummary from "./SectionOrderDetails/FinancialSummary";
import { PaymentDetails } from "./SectionOrderDetails/PaymentDetails";
import { OrderCustomerCard } from "./SectionOrderDetails/OrderCustomerCard";
import { OrderDeliveryCard } from "./SectionOrderDetails/OrderDeliveryCard";

// Store
import useOrderStore from "@/store/useOrderStore";

const AdminOrderDetails = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const { orderDetails, getOrderByOrderNumber } = useOrderStore();

  const [searching, setSearching] = useState(false);

  const fetchOrder = async (orderNum: string) => {
    setSearching(true);

    try {
      await getOrderByOrderNumber(orderNum);
    } catch (error) {
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (!orderNumber) return;

    fetchOrder(orderNumber);
  }, [orderNumber]);

  if (searching) {
    return <LoadingOrderDetails />;
  }

  if (!searching && !orderDetails) {
    return (
      <OrderNotFound
        orderNumber={orderNumber ?? ""}
        onBack={() => navigate("/orders-management")}
        onRetry={() => {
          if (!orderNumber) return;

          fetchOrder(orderNumber);
        }}
      />
    );
  }

  if (!orderDetails || !orderDetails?.orderNumber) return;

  return (
    <PageShell back="Back to Order Management" to="/orders-management">
      <OrderHeader order={orderDetails} />

      <OrderProgress status={orderDetails.status} />

      <OrderItems items={orderDetails.items} />

      <PaymentDetails order={orderDetails} />

      <FinancialSummary order={orderDetails} />

      <OrderCustomerCard user={orderDetails.user} />

      <OrderDeliveryCard
        orderType={orderDetails.orderType}
        status={orderDetails.status}
        shippedAt={orderDetails.shippedAt}
        deliveredAt={orderDetails.deliveredAt}
        deliveryAddress={orderDetails.deliveryAddress}
        deliveryCharge={orderDetails.deliveryCharge}
        orderNote={orderDetails.orderNote}
      />
    </PageShell>
  );
};

export default AdminOrderDetails;
