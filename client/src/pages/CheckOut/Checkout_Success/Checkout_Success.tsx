import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// Components
import { Title, BaseText } from "@/components/Text";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/CopyButton";

// Icons
import { CircleCheckBig } from "lucide-react";

// Config
import { BRAND } from "@/config/brand";

// Store
import useOrderStore from "@/store/useOrderStore";

// Utils
import { formatDateToReadable } from "@/utils/DateManager";

// Types
import type { IOrder } from "@/types/order.type";

const Card = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`border border-border rounded-lg px-side-spacing py-5 ${className}`}
    >
      {children}
    </div>
  );
};

const DetailItem = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="w-full">
      <p className="text-sm text-foreground/70">{title}</p>

      {children}
    </div>
  );
};

const Checkout_Success = () => {
  const { getOrderByOrderNumber } = useOrderStore();

  const { orderNumber } = useParams();

  const [order, setOrder] = useState<IOrder | null>(null);
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

      <Title text="Order Placed Successfully!" className="text-3xl!" />

      <BaseText className="text-lg">
        Thank you for shopping with{" "}
        <span className="text-foreground/80 font-medium">{BRAND.name}</span>
      </BaseText>

      <div className="w-1/2 flex flex-col gap-y-5 mt-3">
        {/* Order Details */}
        <Card className="w-full bg-background1 grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-4">
          <DetailItem title={"Order Number"}>
            <div className="flex flex-row items-center gap-x-3">
              <p className="text-base font-medium">
                {order?.orderNumber ?? "N/A"}
              </p>

              <CopyButton value={order?.orderNumber} />
            </div>
          </DetailItem>

          <DetailItem title={"Order Total"}>
            <p className="text-base font-medium">{`Rs. ${order?.totalAmount?.toFixed(2)}`}</p>
          </DetailItem>

          <DetailItem title={"Payment Method"}>
            <p className="text-base font-medium">
              {order?.paymentMethod?.toLocaleUpperCase() ?? "N/A"}
            </p>
          </DetailItem>

          <DetailItem title={"Order Date"}>
            <p className="text-base font-medium">
              {order.createdAt ? formatDateToReadable(order.createdAt) : "N/A"}
            </p>
          </DetailItem>
        </Card>

        {/* What happens next? */}
        <Card className="w-full bg-background1 grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-4">
          <Title text="What happens next?" className="text-base!" />

          <div></div>
        </Card>

        {/* Action Button */}
        <div className="w-full flex flex-row justify-around gap-x-4">
          <Button className="flex-1 bg-primary">Continue Shopping</Button>

          <Button variant={"outline"} className="flex-1">
            Track Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout_Success;
