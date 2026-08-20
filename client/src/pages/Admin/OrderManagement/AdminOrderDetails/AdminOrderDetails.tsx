import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Components
import { PageShell } from "@/components/Container";
import { LoadingOrderDetails } from "./LoadingOrderDetails";
import { OrderNotFound } from "./OrderNotFound";

// Store
import useOrderStore from "@/store/useOrderStore";

// Types
import type { IOrderRes } from "@/types/order/order_response.type";

const AdminOrderDetails = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const { getOrderByOrderNumber } = useOrderStore();

  const [order, setOrder] = useState<IOrderRes | null>(null);
  const [searching, setSearching] = useState(false);

  const fetchOrder = async (orderNum: string) => {
    setSearching(true);
    try {
      let res = await getOrderByOrderNumber(orderNum);

      if (!res?.data) return;

      setOrder(res?.data);
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

  if (!searching && !order) {
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

  if (!orderNumber) return;

  return (
    <PageShell back="Back to Order Management" to="/orders-management">
      <p>{order?.orderNumber}</p>
    </PageShell>
  );
};

export default AdminOrderDetails;
