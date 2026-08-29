import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Config
import { BRAND } from "@/config/brand";

// Components
import { PageShell } from "@/components/Container";
import { StatusBadge } from "@/components/Badges/StatusBadge";
import { TextWithIcon } from "@/components/Text";
import { OrderTimeline } from "@/components/OrderTimeline";

// Store
import useOrderStore from "@/store/useOrderStore";

// Utils
import { formatDateTime } from "@/utils/DateManager";
import { capitalize } from "@/utils/StringManager";

// Types
import type { IOrderRes } from "@/types/order/order_response.type";

// Icons
import {
  Calendar,
  Dot,
  ShoppingBag,
  MapPin,
  Mail,
  Phone,
  User,
} from "lucide-react";

const Wrapper = ({ children, className }: React.ComponentProps<"div">) => {
  return (
    <div
      className={`bg-background1 rounded-xl border border-border p-6 ${className}`}
    >
      {children}
    </div>
  );
};

const MyOrderDetails = () => {
  const { getOrderByOrderNumber } = useOrderStore();

  const { orderNumber } = useParams();

  const [order, setOrder] = useState<IOrderRes | null>(null);

  const fetchOrderByOrderNumber = async (orderNumber: string) => {
    try {
      let res = await getOrderByOrderNumber(orderNumber);

      if (!res) return;

      setOrder(res);
    } catch (error) {}
  };

  useEffect(() => {
    if (!orderNumber) return;

    fetchOrderByOrderNumber(orderNumber);
  }, [orderNumber]);

  if (!order) {
    return;
  }

  return (
    <PageShell back="Back to My Orders" to="/myorders">
      {/* Order Details */}
      <Wrapper className="flex flex-col gap-y-2">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-y-3">
            <p className="text-xl text-foreground/90 font-medium">
              {order?.orderNumber}
            </p>

            <div className="flex flex-row gap-x-3">
              <TextWithIcon
                icon={Calendar}
                text={formatDateTime(order?.createdAt)}
                iconClassName="text-muted-foreground font-medium"
                textClassName="text-muted-foreground font-medium"
              />

              <TextWithIcon
                icon={Dot}
                text={capitalize(order.orderType)}
                iconClassName="text-muted-foreground font-medium"
                textClassName="text-muted-foreground font-medium"
              />
            </div>
          </div>

          {/* Status Badges */}
          <div className="h-fit flex flex-col sm:flex-row gap-2 sm:gap-3">
            <StatusBadge size="lg" className="rounded-xl">
              {capitalize(order.status)}
            </StatusBadge>

            <StatusBadge variant="success" size="lg" className="rounded-xl">
              {capitalize(order.paymentStatus)}
            </StatusBadge>
          </div>
        </div>

        <div className="flex flex-row justify-between gap-x-5 pt-4 ">
          <div className="w-full bg-background border-2 border-border rounded-xl flex flex-col gap-y-1 px-4 py-3">
            <p className="text-muted-foreground">Payment Method</p>

            <p className="text-primary font-medium">
              {capitalize(order.paymentMethod)}
            </p>
          </div>

          <div className="w-full bg-background border-2 border-border rounded-xl flex flex-col gap-y-1 px-4 py-3">
            <p className="text-muted-foreground">Total Items</p>

            <p className="text-primary font-medium">
              {order.items.length} items
            </p>
          </div>

          <div className="w-full bg-background border-2 border-border rounded-xl flex flex-col gap-y-1 px-4 py-3">
            <p className="text-muted-foreground">Final Total</p>

            <p className="text-primary font-medium">
              {BRAND.currency.symbol} {order.totalAmount}
            </p>
          </div>
        </div>
      </Wrapper>

      {/* Order Time Line */}
      <Wrapper className="flex flex-col gap-y-3">
        <p className="text-lg text-foreground font-medium">Order Timeline</p>

        <OrderTimeline currentStatus={order.status} orientation="horizontal" />
      </Wrapper>

      {/* Order Items */}
      <Wrapper className="flex flex-col gap-y-3">
        <TextWithIcon
          text="Order Items"
          icon={ShoppingBag}
          className="text-lg text-foreground font-medium"
          iconClassName="text-primary size-5"
        />

        <div className="space-y-4">
          {order.items &&
            order.items.length >= 1 &&
            order.items.map((orderItem, index) => {
              return (
                <div
                  key={`${orderItem.productName}-${index}`}
                  className="flex gap-4 p-4 bg-background rounded-xl border-2 border-border"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <img
                      // src={orderItem.productImage.url}
                      alt={orderItem.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-foreground font-medium mb-2">
                      {orderItem.productName}
                    </p>

                    <div className="flex flex-wrap gap-3 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-border"
                          // style={{ backgroundColor: orderItem.color.hexCode }}
                        />

                        {/* <span>{orderItem.color.name}</span> */}
                      </div>

                      <span>•</span>

                      {/* <span>Size: {orderItem.size.name}</span> */}

                      <span>•</span>

                      <span>Qty: {orderItem.quantity}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-primary">
                      {BRAND.currency.symbol} {orderItem.sellingPrice}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </Wrapper>

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        {/* Delivery Address */}
        <Wrapper className="flex-1">
          <TextWithIcon
            text="Delivery Address"
            icon={MapPin}
            className="text-lg text-foreground font-medium mb-6"
            iconClassName="text-primary size-5"
          />

          <div className="flex flex-col gap-y-2">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-400">Name</p>
                <p>{order.deliveryAddress?.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-400">Phone</p>
                <p>{order.deliveryAddress?.phone}</p>
              </div>
            </div>

            {order.deliveryAddress?.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400">Email</p>
                  <p>{order.deliveryAddress?.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-400">Address</p>

                <p>Newroad, Building 15</p>
                <p className="text-gray-400">
                  {order.deliveryAddress?.city},{" "}
                  {order.deliveryAddress?.postalCode}
                </p>
                <p className="text-gray-400">
                  {order.deliveryAddress?.country}
                </p>
              </div>
            </div>
          </div>
        </Wrapper>

        {/* Billing Summary */}
        <Wrapper className="flex-1">
          <p className="text-lg text-foreground font-medium mb-6">
            Billing Summary
          </p>

          <div className="space-y-3">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>
                {BRAND.currency.symbol} {order.orderAmount}
              </span>
            </div>

            {order.discount && order.discount > 0 ? (
              <div className="flex justify-between text-green-400">
                <span>Discount</span>

                <span>
                  {BRAND.currency.symbol} {order.discount}
                </span>
              </div>
            ) : (
              ""
            )}

            <div
              className="flex justify-between text-gray-400
            "
            >
              <span>Delivery Charge</span>
              <span>
                {order.deliveryCharge === 0
                  ? "FREE"
                  : `${BRAND.currency.symbol} ${order.deliveryCharge}`}
              </span>
            </div>

            <div className="border-t border-[#2A2A2E] pt-3 flex justify-between">
              <span>Final Total</span>
              <span className="text-primary font-medium">
                {BRAND.currency.symbol} {order.totalAmount}
              </span>
            </div>
          </div>
        </Wrapper>
      </div>
    </PageShell>
  );
};

export default MyOrderDetails;
