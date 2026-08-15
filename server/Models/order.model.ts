import mongoose, { Schema, Document, Types, Model } from "mongoose";

// Models
import OrderCounter from "./order-counter.model.ts";

/* =========================================================
   Types
========================================================= */

export type OrderType = "online" | "in_store";

export type OrderStatus =
  | "pending" // Customer placed order, awaiting payment/confirmation
  | "confirmed" // Required payment verified and order confirmed
  | "shipped" // Package handed to courier
  | "delivered" // Customer received package
  | "cancelled" // Order cancelled before completion
  | "returned" // Customer returned delivered order
  | "refunded"; // Refund completed

export type PaymentMethod = "bank" | "esewa" | "khalti" | "cod" | "cash";

export type PaymentStatus = "pending" | "partial" | "completed" | "failed";

export type PaymentCollectionType =
  | "delivery_only" // COD: delivery charge paid before confirmation
  | "full" // Online payment: entire order paid before confirmation
  | "none"; // Mainly in-store cash

/* =========================================================
   Interfaces
========================================================= */

export interface IOrder extends Document {
  /* -------------------------------------------------------
     Order Identity
  ------------------------------------------------------- */

  orderNumber: string;

  user?: Types.ObjectId;

  items: Types.ObjectId[];

  orderType: OrderType;

  /**
   * Admin/Operator who handled the order.
   * Mainly useful for in-store orders or admin-assigned orders.
   */
  cashier?: Types.ObjectId;

  /* -------------------------------------------------------
     Financial Snapshot
  ------------------------------------------------------- */

  /**
   * Sum of product prices before discount.
   */
  subtotal: number;

  /**
   * Total discount applied to the order.
   */
  discount: number;

  /**
   * Amount customer owes for products after discount.
   *
   * Example:
   * subtotal = 2500
   * discount = 200
   * orderAmount = 2300
   */
  orderAmount: number;

  /**
   * Delivery fee charged to customer.
   */
  deliveryCharge: number;

  /**
   * Final amount customer needs to pay.
   *
   * orderAmount + deliveryCharge
   */
  totalAmount: number;

  /* -------------------------------------------------------
     Cost & Profit
  ------------------------------------------------------- */

  /**
   * Total product cost.
   *
   * SUM(orderItem.unitCost * quantity)
   */
  totalCost: number;

  /**
   * Product profit.
   *
   * orderAmount - totalCost
   *
   * Delivery charge should only be included here if
   * your business considers it revenue/profit.
   */
  totalProfit: number;

  /* -------------------------------------------------------
     Payment Configuration
  ------------------------------------------------------- */

  /**
   * Payment method selected by customer.
   */
  paymentMethod: PaymentMethod;

  /**
   * Determines how much must be collected before
   * the order can be confirmed.
   *
   * COD      -> delivery_only
   * eSewa    -> full
   * Khalti   -> full
   * Bank     -> full
   * Cash     -> none
   */
  paymentCollectionType: PaymentCollectionType;

  /**
   * Overall payment state.
   */
  paymentStatus: PaymentStatus;

  /**
   * Amount that must be paid before order confirmation.
   *
   * COD:
   *   deliveryCharge
   *
   * eSewa/Khalti/Bank:
   *   totalAmount
   *
   * Cash:
   *   0
   */
  confirmationPaymentDue: number;

  /**
   * Total amount already paid by customer.
   *
   * Example COD:
   *   delivery charge paid = 150
   *   prepaidAmount = 150
   *
   * Example eSewa:
   *   total paid = 2450
   *   prepaidAmount = 2450
   */
  prepaidAmount: number;

  /**
   * Amount that customer still needs to pay
   * during delivery.
   *
   * COD:
   *   orderAmount
   *
   * eSewa/Khalti/Bank:
   *   0
   */
  amountDueOnDelivery: number;

  /* -------------------------------------------------------
     Coupon
  ------------------------------------------------------- */

  coupon?: Types.ObjectId;

  /* -------------------------------------------------------
     Order Status
  ------------------------------------------------------- */

  status: OrderStatus;

  /* -------------------------------------------------------
     Delivery Address Snapshot
  ------------------------------------------------------- */

  /**
   * Snapshot the address at the time of order.
   *
   * Do NOT depend on the user's current address later,
   * because the user may change their address.
   */
  deliveryAddress: {
    name: string;
    phone: string;
    email?: string;

    address: string;
    city: string;

    postalCode?: string;
    country?: string;
  };

  /* -------------------------------------------------------
     Order Notes
  ------------------------------------------------------- */

  orderNote?: string;

  /* -------------------------------------------------------
     Fulfillment Dates
  ------------------------------------------------------- */

  deliveredAt?: Date;

  shippedAt?: Date;

  cancellationDate?: Date;

  cancelledBy?: Types.ObjectId;

  cancellationReason?: string;

  /* -------------------------------------------------------
     Timestamps
  ------------------------------------------------------- */

  createdAt: Date;

  updatedAt: Date;
}

/* =========================================================
   Schema
========================================================= */

const orderSchema = new Schema<IOrder>(
  {
    /* -------------------------------------------------------
       Order Identity
    ------------------------------------------------------- */

    orderNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],

    orderType: {
      type: String,
      enum: ["online", "in_store"],
      required: true,
      index: true,
    },

    cashier: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    /* -------------------------------------------------------
       Financial Snapshot
    ------------------------------------------------------- */

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    orderAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /* -------------------------------------------------------
       Cost & Profit
    ------------------------------------------------------- */

    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },

    totalProfit: {
      type: Number,
      required: true,
    },

    /* -------------------------------------------------------
       Payment
    ------------------------------------------------------- */

    paymentMethod: {
      type: String,
      enum: ["bank", "esewa", "khalti", "cod", "cash"],
      required: true,
    },

    paymentCollectionType: {
      type: String,
      enum: ["delivery_only", "full", "none"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "completed", "failed"],
      default: "pending",
      index: true,
    },

    confirmationPaymentDue: {
      type: Number,
      required: true,
      min: 0,
    },

    prepaidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    amountDueOnDelivery: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* -------------------------------------------------------
       Coupon
    ------------------------------------------------------- */

    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },

    /* -------------------------------------------------------
       Order Status
    ------------------------------------------------------- */

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    /* -------------------------------------------------------
       Delivery Address
    ------------------------------------------------------- */

    deliveryAddress: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      postalCode: {
        type: String,
        trim: true,
      },

      country: {
        type: String,
        default: "Nepal",
        trim: true,
      },
    },

    /* -------------------------------------------------------
       Notes
    ------------------------------------------------------- */

    orderNote: {
      type: String,
      trim: true,
    },

    /* -------------------------------------------------------
       Dates
    ------------------------------------------------------- */

    deliveredAt: {
      type: Date,
    },

    shippedAt: {
      type: Date,
    },

    cancellationDate: {
      type: Date,
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    cancellationReason: {
      type: String,
      trim: true,
    },
  },

  {
    timestamps: true,
  },
);

/* =========================================================
   Indexes
========================================================= */

orderSchema.index({
  user: 1,
  createdAt: -1,
});

orderSchema.index({
  status: 1,
  createdAt: -1,
});

orderSchema.index({
  paymentStatus: 1,
  createdAt: -1,
});

orderSchema.index({
  orderType: 1,
  status: 1,
});

orderSchema.index({
  "deliveryAddress.phone": 1,
});

/* =========================================================
   Order Number Generation
========================================================= */

orderSchema.pre("validate", async function () {
  if (!this.isNew || this.orderNumber) {
    return;
  }

  const counter = await OrderCounter.findOneAndUpdate(
    { name: "order" },
    { $inc: { sequence: 1 } },
    {
      new: true,
      upsert: true,
    },
  );

  this.orderNumber = `ORD-${String(counter.seq).padStart(6, "0")}`;
});

/* =========================================================
   Model
========================================================= */

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
