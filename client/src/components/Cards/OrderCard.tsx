import { Link } from "react-router-dom";

// Components
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { StatusBadge } from "../Badges/StatusBadge";
import { PaymentMethodBadge } from "../Badges/PaymentMethodBadge";

// Icons
import { Calendar, Banknote } from "lucide-react";

// Utils
import { formatDateToReadable } from "@/utils/DateManager";
import { capitalize } from "@/utils/StringManager";

// Types
import type {
  IOrderRes,
  IOrderItemRes,
} from "@/types/order/order_response.type";

interface OrderCardProps {
  order: IOrderRes;
}

const ItemContainer = ({ orderItem }: { orderItem: IOrderItemRes }) => {
  return (
    <div className="min-w-20 max-w-24 flex flex-col gap-y-0.5">
      <img
        src={orderItem.productImage}
        alt={`${orderItem.productName}-${orderItem.size}-Img`}
        className="w-full aspect-square object-cover rounded-lg"
      />

      <p className="text-xs text-muted-foreground font-medium line-clamp-1">
        {orderItem.productName}
      </p>

      <div className="flex flex-row items-center gap-x-1">
        <span
          className="inline-block size-3 rounded-full border-2 border-border"
          style={{ backgroundColor: orderItem.color.hexCode }}
        ></span>

        <p className="text-xs text-muted-foreground">{orderItem.size.name}</p>
      </div>
    </div>
  );
};

const OrderCard = ({ order }: OrderCardProps) => {
  if (!order) return;

  return (
    <Link
      to={order.orderNumber}
      className="w-full bg-background1 border border-border rounded-2xl flex flex-col gap-y-4 p-5 transition-all duration-300 hover:shadow-xs hover:shadow-primary hover:translate-x-0.5 hover:-translate-y-0.5"
    >
      <div className="flex flex-row justify-between">
        {/* ORD Number & Date */}
        <div className="flex flex-col gap-y-1">
          <p className="text-primary text-base xs:text-base font-medium">
            {order.orderNumber}
          </p>

          <div className="flex flex-row items-center gap-x-1.5">
            <Calendar className="size-3.5 xs:size-4 text-muted-foreground" />

            <p className="text-muted-foreground text-xs xs:text-sm font-medium line-clamp-1">
              {formatDateToReadable(order.createdAt, { includeTime: true })}
            </p>
          </div>
        </div>

        {/* Statuses */}
        <div className="flex flex-col items-end gap-y-1">
          <StatusBadge>{capitalize(order.status)}</StatusBadge>

          <StatusBadge variant="success">
            {capitalize(order.paymentStatus)}
          </StatusBadge>
        </div>
      </div>

      {/* Order Items */}
      <div className="w-full overflow-x-auto no-scrollbar flex flex-row flex-nowrap gap-x-3 py-2">
        {order.items.map((orderItem, index) => {
          return (
            <ItemContainer
              key={`${orderItem.createdAt}-${index}`}
              orderItem={orderItem}
            />
          );
        })}
      </div>

      <Separator />

      {/* Total Amount & Payment Method */}
      <div className="flex flex-row justify-between">
        {/* Total Amount */}
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Total Amount</p>

          <p className="text-primary text-lg font-medium">
            NPR {order.totalAmount}
          </p>
        </div>

        {/* Payment Method */}
        <PaymentMethodBadge method={order.paymentMethod} />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <Button>View Details</Button>
      </div>
    </Link>
  );
};

export default OrderCard;
