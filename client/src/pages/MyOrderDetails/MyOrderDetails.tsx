import { useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import { PageShell } from "@/components/Container";
import { StatusBadge } from "@/components/Badges/StatusBadge";
import { TextWithIcon } from "@/components/Text";
import { OrderTimeline } from "@/components/OrderTimeline";

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
  const { orderNumber } = useParams();

  const orderItems = [
    {
      image:
        "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/dfa628f5-3f72-457b-b7ec-17e685f6b979/W+NIKE+AIR+ZOOM+PEGASUS+42.png",
      name: "Designer Sunglasses",
      price: 3500,
      color: "467294",
      size: "sm",
      quantity: 3,
    },
    {
      image:
        "https://img.magnific.com/free-photo/sport-running-shoes_1203-3414.jpg?semt=ais_hybrid&w=740&q=80",
      name: "Canvas Sneakers",
      price: 2000,
      color: "ffffff",
      size: "sm",
      quantity: 6,
    },
  ];

  useEffect(() => {}, [orderNumber]);

  return (
    <PageShell
      back="Back to My Orders"
      to="/myorders"
      className="flex flex-col gap-y-5"
    >
      {/* Order Details */}
      <Wrapper className="flex flex-col gap-y-2">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-y-3">
            <p className="text-xl text-foreground/90 font-medium">
              ORD-2026-5003 - Need Change
            </p>

            <div className="flex flex-row gap-x-3">
              <TextWithIcon
                icon={Calendar}
                text="May 2, 2026 at 04:45 PM"
                iconClassName="text-muted-foreground font-medium"
                textClassName="text-muted-foreground font-medium"
              />

              <TextWithIcon
                icon={Dot}
                text="Online Order"
                iconClassName="text-muted-foreground font-medium"
                textClassName="text-muted-foreground font-medium"
              />
            </div>
          </div>

          {/* Status Badges */}
          <div className="h-fit flex flex-row gap-x-3">
            <StatusBadge size="lg" className="rounded-xl">
              Confirmed
            </StatusBadge>

            <StatusBadge variant="success" size="lg" className="rounded-xl">
              Paid
            </StatusBadge>
          </div>
        </div>

        <div className="flex flex-row justify-between gap-x-5 pt-4 ">
          <div className="w-full bg-background border-2 border-border rounded-xl flex flex-col gap-y-1 px-4 py-3">
            <p className="text-muted-foreground">Payment Method</p>

            <p className="text-primary font-medium">Bank Transfer</p>
          </div>

          <div className="w-full bg-background border-2 border-border rounded-xl flex flex-col gap-y-1 px-4 py-3">
            <p className="text-muted-foreground">Total Items</p>

            <p className="text-primary font-medium">2 items</p>
          </div>

          <div className="w-full bg-background border-2 border-border rounded-xl flex flex-col gap-y-1 px-4 py-3">
            <p className="text-muted-foreground">Final Total</p>

            <p className="text-primary font-medium">NPR 5,100</p>
          </div>
        </div>
      </Wrapper>

      {/* Order Time Line */}
      <Wrapper className="flex flex-col gap-y-3">
        <p className="text-lg text-foreground font-medium">Order Timeline</p>

        <OrderTimeline currentStatus="confirmed" orientation="horizontal" />
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
          {orderItems &&
            orderItems.length >= 1 &&
            orderItems.map((orderItem) => {
              return (
                <div className="flex gap-4 p-4 bg-background rounded-xl border-2 border-border">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={orderItem.image}
                      alt={orderItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-foreground font-medium mb-2">
                      {orderItem.name}
                    </p>

                    <div className="flex flex-wrap gap-3 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-border"
                          style={{ backgroundColor: orderItem.color }}
                        />

                        <span>{orderItem.color}</span>
                      </div>

                      <span>•</span>

                      <span>Size: {orderItem.size}</span>

                      <span>•</span>

                      <span>Qty: {orderItem.quantity}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-primary">
                      NPR {orderItem.price.toLocaleString()}
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
                <p>Aslam Sheikh</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-400">Phone</p>
                <p>+977-9861234567</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-400">Email</p>
                <p>aslamsheikh1016@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-400">Address</p>

                <p>Newroad, Building 15</p>
                <p className="text-gray-400">Kathmandu, 44600</p>
                <p className="text-gray-400">Nepal</p>
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
              <span>NPR {Number(5500).toLocaleString()}</span>
            </div>
            {/* {order.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>- NPR {order.discount.toLocaleString()}</span>
                </div>
              )} */}
            <div
              className="flex justify-between text-gray-400
            "
            >
              <span>Delivery Charge</span>
              {/* <span>{order.deliveryCharge === 0 ? 'FREE' : `NPR ${order.deliveryCharge}`}</span> */}
            </div>
            <div className="border-t border-[#2A2A2E] pt-3 flex justify-between">
              <span>Final Total</span>
              <span className="text-primary font-medium">
                NPR {Number(5000).toLocaleString()}
              </span>
            </div>
          </div>
        </Wrapper>
      </div>
    </PageShell>
  );
};

export default MyOrderDetails;
