import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Components
import { Title, BaseText } from "@/components/Text";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/CopyButton";
import { OrderTimeline } from "@/components/OrderTimeline";

// Icons
import {
  CircleCheckBig,
  Package,
  CreditCard,
  Calendar,
  Banknote,
} from "lucide-react";

// Config
import { BRAND } from "@/config/brand";

// Store
import useOrderStore from "@/store/useOrderStore";

// Utils
import { formatDateToReadable } from "@/utils/DateManager";

// Types
import type { IOrderRes } from "@/types/order/order_response.type";
import type { LucideIcon } from "lucide-react";

const Card = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={`border border-border rounded-lg px-6 py-6 ${className}`}>
      {children}
    </div>
  );
};

const DetailItem = ({
  title,
  Icon,
  children,
}: {
  title: string;
  Icon?: LucideIcon;
  children?: React.ReactNode;
}) => {
  return (
    <div className="w-full flex flex-row gap-x-2">
      {Icon && <Icon className="text-primary" />}

      <div className="flex flex-col gap-y-1">
        <p className="text-sm text-foreground/70">{title}</p>

        {children}
      </div>
    </div>
  );
};

const Checkout_Success = () => {
  const { getOrderByOrderNumber } = useOrderStore();
  const navigate = useNavigate();

  const { orderNumber } = useParams();

  const [order, setOrder] = useState<IOrderRes | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchOrder = async (orderNumber: string) => {
    setIsFetching(true);

    try {
      let res = await getOrderByOrderNumber(orderNumber);

      if (res) {
        setOrder(res?.data);
      }
    } catch (error) {
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!orderNumber) return;

    fetchOrder(orderNumber);
  }, [orderNumber]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>No order found</div>;
  }

  return (
    <div className="flex flex-col items-center gap-y-3 px-side-spacing py-side-spacing">
      <div className="size-20 bg-success/15 rounded-full flex justify-center items-center p-3">
        <CircleCheckBig className="size-10 text-success" />
      </div>

      <Title
        text="Order Placed Successfully!"
        className="text-xl! xs:text-2xl! sm:text-3xl! md:text-4xl!"
      />

      <BaseText className="text-sm xs:text-base sm:text-lg">
        Thank you for shopping with{" "}
        <span className="text-foreground/80 font-medium">{BRAND.name}</span>
      </BaseText>

      <div className="w-full md:w-11/12 lg:w-2/3 flex flex-col gap-y-5 mt-3">
        {/* Order Details */}
        <Card className="w-full bg-background1 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
          <DetailItem title={"Order Number"} Icon={Package}>
            <div className="flex flex-row items-center gap-x-3">
              <p className="text-base font-medium">
                {order?.orderNumber ?? "N/A"}
              </p>

              <CopyButton value={order?.orderNumber} />
            </div>
          </DetailItem>

          <DetailItem title={"Order Total"} Icon={Banknote}>
            <p className="text-base font-medium">{`Rs. ${order?.totalAmount?.toFixed(2)}`}</p>
          </DetailItem>

          <DetailItem title={"Payment Method"} Icon={CreditCard}>
            <p className="text-base font-medium">
              {order?.paymentMethod?.toLocaleUpperCase() ?? "N/A"}
            </p>
          </DetailItem>

          <DetailItem title={"Order Date"} Icon={Calendar}>
            <p className="text-base font-medium">
              {order.createdAt
                ? formatDateToReadable(order.createdAt, { includeTime: true })
                : "N/A"}
            </p>
          </DetailItem>
        </Card>

        {/* What happens next? */}
        <Card className="w-full bg-background1">
          <Title text="What happens next?" className="text-base!" />

          <div className="mt-2">
            {order?.status && (
              <OrderTimeline
                currentStatus={order?.status}
                orientation="vertical"
              />
            )}
          </div>
        </Card>

        {/* Action Button */}
        <div className="w-full flex flex-row justify-around gap-x-4">
          <Button
            onClick={() => navigate("/products")}
            className="flex-1 bg-primary py-0 sm:py-6"
          >
            Continue Shopping
          </Button>

          <Button
            variant={"outline"}
            onClick={() => navigate("/orders")}
            className="flex-1 py-0 sm:py-6"
          >
            Track Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout_Success;
