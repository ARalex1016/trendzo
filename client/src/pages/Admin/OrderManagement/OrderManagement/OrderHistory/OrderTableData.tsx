import { useNavigate } from "react-router-dom";

// Components
import { CopyButton } from "@/components/CopyButton";

// Config
import { BRAND } from "@/config/brand";

// Utils
import { capitalize } from "@/utils/StringManager";
import { formatDateTime } from "@/utils/DateManager";

// Icons
import { Eye, Ellipsis } from "lucide-react";

// Types
import type { AdminOrder } from "./OrderHistory";

export const OrderNumber = ({
  orderNumber,
}: {
  orderNumber: AdminOrder["orderNumber"];
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-40 flex flex-row items-center gap-x-2">
      <p
        title="View Order Detaisl"
        onClick={() => navigate(`${orderNumber}`)}
        className="text-xs text-primary/80 font-medium hover:text-primary hover:underline transition-all duration-200"
      >
        {orderNumber}
      </p>

      <CopyButton value={orderNumber} size={"sm"} />
    </div>
  );
};

export const CustomerData = ({ name, email }: AdminOrder["customer"]) => {
  return (
    <div className="flex-col">
      <p className="text-sm font-medium text-foreground line-clamp-1">{name}</p>

      <p className="text-xs text-foreground/60 line-clamp-1">{email}</p>
    </div>
  );
};

export const Items = ({ items }: { items: AdminOrder["items"] }) => {
  const totalItems = items.length;
  return (
    <p className="text-xs text-foreground/60">
      <span className="text-foreground/80 font-medium">{totalItems}</span> items
    </p>
  );
};

export const TotalAmount = ({
  totalAmount,
}: {
  totalAmount: AdminOrder["totalAmount"];
}) => {
  return (
    <p className="text-foreground font-medium">
      {BRAND.currency.symbol} {totalAmount}
    </p>
  );
};

export const DeliveryCharge = ({
  deliveryCharge,
}: {
  deliveryCharge: AdminOrder["deliveryCharge"];
}) => {
  return (
    <p className="text-sm text-foreground/60 font-medium">
      {BRAND.currency.symbol} {deliveryCharge}
    </p>
  );
};

export const PaymentMethod = ({
  method,
}: {
  method: AdminOrder["paymentMethod"];
}) => {
  return <p className="text-sm font-medium">{method.toLocaleUpperCase()}</p>;
};

export const OrderStatusData = ({
  status,
}: {
  status: AdminOrder["orderStatus"];
}) => {
  return <p className="text-sm font-medium">{capitalize(status)}</p>;
};

export const CreatedAt = ({ date }: { date: AdminOrder["createdAt"] }) => {
  return (
    <p className="text-xs text-foreground/60">
      {formatDateTime(date, { short: true })}
    </p>
  );
};

export const LastUpdate = ({ date }: { date: AdminOrder["updatedAt"] }) => {
  return (
    <p className="text-xs text-foreground/60">
      {formatDateTime(date, { short: true })}
    </p>
  );
};

export const ActionButtons = ({
  orderNumber,
}: {
  orderNumber: AdminOrder["orderNumber"];
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row gap-x-4">
      <div
        title="View Order Detaisl"
        onClick={() => navigate(`${orderNumber}`)}
        className="size-7 rounded-full flex justify-center items-center hover:bg-accent transition-all duration-200 group"
      >
        <Eye className="size-3.5 text-foreground/60 group-hover:text-foreground transition-all duration-200" />
      </div>

      <div className="size-7 rounded-full flex justify-center items-center hover:bg-accent transition-all duration-200 group">
        <Ellipsis className="size-3.5 text-foreground/60 group-hover:text-foreground transition-all duration-200" />
      </div>
    </div>
  );
};
