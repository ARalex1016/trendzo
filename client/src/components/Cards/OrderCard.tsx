import { Link } from "react-router-dom";

// Components
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

// Icons
import { Calendar, Banknote } from "lucide-react";

// Utils
import { formatDateToReadable } from "@/utils/DateManager";

interface OrderCardProps {
  orderNumber?: string;
  orderDate?: string;
  totalAmount?: string | number;
}

const OrderCard = ({ orderNumber, orderDate, totalAmount }: OrderCardProps) => {
  if (!orderNumber) return;

  return (
    <Link
      to={orderNumber}
      className="border border-border rounded-2xl flex flex-col px-4 py-5 transition-all duration-300 hover:shadow-xs hover:shadow-primary hover:translate-x-0.5 hover:-translate-y-0.5"
    >
      <div className="flex flex-row justify-between">
        {/* ORD Number & Date */}
        <div className="flex flex-col gap-y-1">
          {orderNumber && (
            <p className="text-primary font-medium">{orderNumber}</p>
          )}

          {orderDate && (
            <div className="flex flex-row items-center gap-x-2">
              <Calendar size={16} className="text-muted-foreground" />

              <p className="text-muted-foreground text-sm font-medium">
                {formatDateToReadable(orderDate, { includeTime: true })}
              </p>
            </div>
          )}
        </div>

        {/* Statuses */}
        <div className="flex flex-col items-end gap-y-1">
          <p className="inline-block text-blue-500 bg-blue-500/20 border border-blue-500/80 rounded-lg shadow shadow-blue-500/40 px-3 py-0">
            Confirmed
          </p>

          <p className="inline-block text-green-500 bg-green-500/20 border border-green-500/80 rounded-lg shadow shadow-green-500/40 px-3 py-0">
            Paid
          </p>
        </div>
      </div>

      {/* Order Items */}
      {/* <div></div> */}

      <Separator className="my-3" />

      {/* Total Amount & Payment Method */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-y-1">
          <p className="text-sm text-muted-foreground">Total Amount</p>

          <p className="text-primary font-medium">NPR {totalAmount}</p>
        </div>

        <div className="h-fit bg-black rounded-lg border-2 border-border flex flex-row items-center gap-x-2 px-3 py-1">
          <Banknote size={16} className="text-foreground/80" />

          <span className="text-sm text-foreground/80">Bank</span>
        </div>
      </div>

      {/* Action Buttons */}
      <Button>View Details</Button>
    </Link>
  );
};

export default OrderCard;
