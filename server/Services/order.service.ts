import mongoose, { Types } from "mongoose";

// Services
import { PricingService } from "./pricing.service.ts";
import ProductService from "./product.service.ts";
import { CouponService } from "./../Services/coupon.service.ts";
import { DeliveryService } from "./../Services/delivery.service.ts";
import { ReferralService } from "../Services/referral.service.ts";

// Repositories
import { OrderRepository } from "./../Repositories/order.repository.ts";
import { OrderItemRepository } from "../Repositories/orderItem.repository.ts";
import ProductRepository from "./../Repositories/product.repository.ts";
import { UserStatsService } from "./user-stats.service.ts";
import ColorRepository from "../Repositories/color.repository.ts";
import SizeRepository from "../Repositories/size.repository.ts";

// Types
import type { IUser } from "../Models/user.model.ts";
import type {
  IOrder,
  PaymentMethod,
  OrderStatus,
  PaymentCollectionType,
  PaymentStatus,
} from "../Models/order.model.ts";
import type { CreateOrderData } from "./../Repositories/order.repository.ts";

// Utils
import AppError from "./../Utils/AppError.ts";

/* =========================================================
   ORDER STATUS TRANSITIONS
========================================================= */

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],

  confirmed: ["shipped", "cancelled"],

  shipped: ["delivered", "returned"],

  delivered: ["returned", "refunded"],

  cancelled: [],

  returned: ["refunded"],

  refunded: [],
};

/* =========================================================
   HELPERS
========================================================= */

function getPaymentConfiguration(
  paymentMethod: PaymentMethod,
  orderType: "online" | "in_store",
  totalAmount: number,
  orderAmount: number,
  deliveryCharge: number,
): {
  paymentCollectionType: PaymentCollectionType;
  paymentStatus: PaymentStatus;
  confirmationPaymentDue: number;
  prepaidAmount: number;
  amountDueOnDelivery: number;
} {
  /* -------------------------------------------------------
     IN-STORE
  ------------------------------------------------------- */

  if (orderType === "in_store") {
    if (paymentMethod !== "cash") {
      throw new AppError("In-store orders must use cash payment.", 400);
    }

    return {
      paymentCollectionType: "none",
      paymentStatus: "completed",

      confirmationPaymentDue: 0,

      /*
       * Since the customer pays at the store immediately.
       */
      prepaidAmount: totalAmount,

      amountDueOnDelivery: 0,
    };
  }

  /* -------------------------------------------------------
     COD
  ------------------------------------------------------- */

  if (paymentMethod === "cod") {
    return {
      paymentCollectionType: "delivery_only",

      /*
       * COD delivery charge must be paid before
       * the order can be confirmed.
       */
      paymentStatus: deliveryCharge === 0 ? "pending" : "pending",

      confirmationPaymentDue: deliveryCharge,

      prepaidAmount: 0,

      /*
       * Customer pays product amount when package
       * is delivered.
       */
      amountDueOnDelivery: orderAmount,
    };
  }

  /* -------------------------------------------------------
     ONLINE PAYMENT
     eSewa / Khalti / Bank
  ------------------------------------------------------- */

  if (
    paymentMethod === "esewa" ||
    paymentMethod === "khalti" ||
    paymentMethod === "bank"
  ) {
    return {
      paymentCollectionType: "full",

      paymentStatus: "pending",

      confirmationPaymentDue: totalAmount,

      prepaidAmount: 0,

      amountDueOnDelivery: 0,
    };
  }

  throw new AppError(`Unsupported payment method: ${paymentMethod}`, 400);
}

/* =========================================================
   SERVICE
========================================================= */

export const OrderService = {
  /* =======================================================
     PLACE ORDER
  ======================================================= */

  async placeOrder(input: {
    userId?: Types.ObjectId;
    cashierId?: Types.ObjectId;

    items: {
      product: Types.ObjectId;
      color: Types.ObjectId;
      size: Types.ObjectId;
      quantity: number;
    }[];

    paymentMethod: PaymentMethod;

    deliveryAddress?: {
      name: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      postalCode?: string;
      country?: string;
    };

    orderType: "online" | "in_store";

    couponCode?: string;

    orderNote?: string;
  }) {
    console.log("Service");

    console.log(10);

    const session = await mongoose.startSession();

    console.log(11);

    try {
      session.startTransaction();
      console.log(12);
      /* ---------------------------------------------------
         BASIC VALIDATION
      --------------------------------------------------- */

      if (!input.items || input.items.length === 0) {
        console.log(13);
        throw new AppError("Order must contain at least one item", 400);
      }

      if (input.orderType === "online" && !input.userId) {
        console.log(14);
        throw new AppError("User is required for online orders", 400);
      }

      if (input.orderType === "in_store" && !input.cashierId) {
        console.log(15);
        throw new AppError("Cashier is required for in-store orders", 400);
      }

      if (input.orderType === "online" && !input.deliveryAddress) {
        console.log(16);
        throw new AppError("Delivery address is required", 400);
      }

      /* ---------------------------------------------------
         IDS
      --------------------------------------------------- */
      console.log(17);

      const userId = input.userId
        ? new Types.ObjectId(input.userId)
        : undefined;

      const cashierId = input.cashierId
        ? new Types.ObjectId(input.cashierId)
        : undefined;

      /* ---------------------------------------------------
         COUPON
      --------------------------------------------------- */
      console.log(18);

      const coupon = input.couponCode
        ? await CouponService.validateAndConsumeCoupon(
            input.couponCode,

            /*
             * For online orders the coupon belongs to
             * the customer.
             *
             * For in-store orders, this currently uses
             * the cashier because your existing coupon
             * service expects an ObjectId.
             */
            input.orderType === "online" ? userId! : cashierId!,

            input.orderType,

            session,
          )
        : null;

      console.log(19);

      /* ---------------------------------------------------
         ORDER ITEM PROCESSING
      --------------------------------------------------- */

      let subtotal = 0;
      let totalCost = 0;

      console.log(20);

      const orderItemIds: Types.ObjectId[] = [];

      for (const item of input.items) {
        if (item.quantity <= 0) {
          console.log(20);
          throw new AppError("Item quantity must be greater than zero", 400);
        }

        console.log(21);
        const product = await ProductRepository.findById(
          new Types.ObjectId(item.product),
        ).lean();

        if (!product) {
          console.log(22);
          throw new AppError("Product not found", 404);
        }

        if (!product.isActive) {
          console.log(23);
          throw new AppError("Product is not available", 400);
        }

        /* -----------------------------------------------
           FIND INVENTORY
        ------------------------------------------------ */
        console.log(24);
        const inventory = product.inventory.find(
          (inventoryItem: any) =>
            inventoryItem.color.toString() === item.color &&
            inventoryItem.size.toString() === item.size,
        );

        if (!inventory) {
          console.log(25);
          throw new AppError("Product variant not found", 400);
        }

        if (inventory.stock < item.quantity) {
          console.log(26);
          throw new AppError(`Insufficient stock for ${product.name}`, 400);
        }

        /* -----------------------------------------------
           COLOR
        ------------------------------------------------ */

        const color = await ColorRepository.findById(item.color);

        console.log(27);

        if (!color) {
          console.log(28);
          throw new AppError("Color not found", 404);
        }

        /* -----------------------------------------------
           SIZE
        ------------------------------------------------ */

        console.log(29);
        const size = await SizeRepository.findById(item.size);

        console.log(30);

        if (!size) {
          console.log(31);
          throw new AppError("Size not found", 404);
        }

        /* -----------------------------------------------
           PRICE
        ------------------------------------------------ */

        const sellingPrice = PricingService.calculateItemPrice(
          product.baseSellingPrice,
          product.discount,
        );

        console.log(32);

        const costPrice = product.baseCostPrice;

        const itemTotalPrice = sellingPrice * item.quantity;

        const itemTotalCost = costPrice * item.quantity;

        const profit = itemTotalPrice - itemTotalCost;

        /* -----------------------------------------------
           DECREMENT STOCK
        ------------------------------------------------ */

        console.log(32);
        const stockUpdate = await ProductRepository.decrementStock(
          product._id,
          new Types.ObjectId(item.color),
          new Types.ObjectId(item.size),
          item.quantity,
          session,
        );

        if (stockUpdate.modifiedCount === 0) {
          console.log(33);
          throw new AppError("Stock update failed", 400);
        }

        /* -----------------------------------------------
           CREATE ORDER ITEM
        ------------------------------------------------ */
        console.log(34);
        const orderItem = await OrderItemRepository.create(
          {
            product: product._id,

            productName: product.name,
            productImage: product.thumbnail,

            color: {
              id: color._id,
              name: color.name,
              hexCode: color.hexCode,
            },

            size: {
              id: size._id,
              name: size.name,
            },

            quantity: item.quantity,

            costPrice,
            sellingPrice,

            totalCost: itemTotalCost,
            totalPrice: itemTotalPrice,

            profit,
          },
          session,
        );

        subtotal += itemTotalPrice;
        totalCost += itemTotalCost;

        orderItemIds.push(orderItem._id);
      }

      /* ---------------------------------------------------
         DISCOUNT
      --------------------------------------------------- */
      console.log(35);
      const discount = coupon
        ? Math.min(
            coupon.type === "percentage"
              ? (subtotal * coupon.value) / 100
              : coupon.value,

            coupon.maxDiscount ?? Infinity,
          )
        : 0;

      /* ---------------------------------------------------
         ORDER AMOUNT
         Product amount AFTER discount
      --------------------------------------------------- */

      console.log(36);
      const orderAmount = Math.max(0, subtotal - discount);

      /* ---------------------------------------------------
         DELIVERY CHARGE
      --------------------------------------------------- */
      console.log(37);
      const deliveryCharge =
        input.orderType === "in_store"
          ? 0
          : await DeliveryService.calculateCharge(input.deliveryAddress!);

      /* ---------------------------------------------------
         FINAL TOTAL
      --------------------------------------------------- */

      const totalAmount = orderAmount + deliveryCharge;

      /* ---------------------------------------------------
         PROFIT
      --------------------------------------------------- */

      /*
       * According to your IOrder model:
       *
       * totalProfit = orderAmount - totalCost
       *
       * Delivery charge is NOT included as product profit.
       */
      const totalProfit = orderAmount - totalCost;

      /* ---------------------------------------------------
         PAYMENT CONFIGURATION
      --------------------------------------------------- */
      console.log(38);
      const paymentConfiguration = getPaymentConfiguration(
        input.paymentMethod,
        input.orderType,
        totalAmount,
        orderAmount,
        deliveryCharge,
      );

      /* ---------------------------------------------------
         DELIVERY ADDRESS
      --------------------------------------------------- */
      console.log(39);
      const deliveryAddress =
        input.orderType === "in_store"
          ? {
              name: "In-Store",
              phone: "N/A",
              email: "N/A",

              address: "N/A",
              city: "N/A",

              postalCode: "N/A",
              country: "Nepal",
            }
          : input.deliveryAddress!;

      /* ---------------------------------------------------
         ORDER DATA
      --------------------------------------------------- */
      console.log(40);
      const orderNumber = await OrderRepository.getNextOrderNumber();
      console.log(41);
      const orderData: CreateOrderData = {
        orderNumber,

        items: orderItemIds,

        orderType: input.orderType,

        /* -----------------------------------------------------
     Financial
  ----------------------------------------------------- */

        subtotal,
        discount,
        orderAmount,

        deliveryCharge,
        totalAmount,

        /* -----------------------------------------------------
     Cost / Profit
  ----------------------------------------------------- */

        totalCost,
        totalProfit,

        /* -----------------------------------------------------
     Payment
  ----------------------------------------------------- */

        paymentMethod: input.paymentMethod,

        paymentCollectionType: paymentConfiguration.paymentCollectionType,

        paymentStatus: paymentConfiguration.paymentStatus,

        confirmationPaymentDue: paymentConfiguration.confirmationPaymentDue,

        prepaidAmount: paymentConfiguration.prepaidAmount,

        amountDueOnDelivery: paymentConfiguration.amountDueOnDelivery,

        /* -----------------------------------------------------
     Status
  ----------------------------------------------------- */

        status: input.orderType === "in_store" ? "confirmed" : "pending",

        /* -----------------------------------------------------
     Address
  ----------------------------------------------------- */

        deliveryAddress,

        /* -----------------------------------------------------
     Optional fields
  ----------------------------------------------------- */
      };

      /* ---------------------------------------------------------
   Optional user
--------------------------------------------------------- */

      if (userId) {
        orderData.user = userId;
      }

      /* ---------------------------------------------------------
   Optional cashier
--------------------------------------------------------- */

      if (cashierId) {
        orderData.cashier = cashierId;
      }

      /* ---------------------------------------------------------
   Optional coupon
--------------------------------------------------------- */

      if (coupon) {
        orderData.coupon = coupon._id;
      }

      /* ---------------------------------------------------------
   Optional order note
--------------------------------------------------------- */

      if (input.orderNote !== undefined) {
        orderData.orderNote = input.orderNote;
      }

      const order = await OrderRepository.create(orderData, session);

      /* ---------------------------------------------------
         REFERRAL
      --------------------------------------------------- */
      console.log(42);
      if (input.orderType === "online" && userId) {
        try {
          console.log(43);
          await ReferralService.qualifyReferral(
            userId,
            order._id,
            totalAmount,
            session,
          );
        } catch (err: any) {
          /*
           * Referral failure should not cause the
           * customer's order to fail.
           */
          console.warn("Referral qualification failed:", err.message);
        }
      }

      /* ---------------------------------------------------
         USER STATS
      --------------------------------------------------- */

      if (userId) {
        console.log(44);
        await UserStatsService.onOrderPlaced(userId);
      }

      await session.commitTransaction();

      console.log(45);
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  },

  /* =======================================================
     CANCEL ORDER
  ======================================================= */

  async cancelOrder(
    orderId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ) {
    const session = await mongoose.startSession();

    try {
      let cancelledOrder: any;

      await session.withTransaction(async () => {
        const order = await OrderRepository.findById(
          new Types.ObjectId(orderId),
          session,
        );

        if (!order) {
          throw new AppError("Order not found", 404);
        }

        /* -----------------------------------------------
           OWNERSHIP
        ------------------------------------------------ */

        if (!order.user || order.user.toString() !== userId.toString()) {
          throw new AppError("Not authorized", 403);
        }

        /* -----------------------------------------------
           STATUS
        ------------------------------------------------ */

        if (order.status !== "pending") {
          throw new AppError(
            `Order cannot be cancelled at ${order.status}`,
            400,
          );
        }

        /* -----------------------------------------------
           RESTORE STOCK
        ------------------------------------------------ */

        const items = await OrderItemRepository.findManyByIds(
          order.items,
          session,
        );

        for (const item of items) {
          await ProductService.restoreStock(
            new Types.ObjectId(item.product.id),
            new Types.ObjectId(item.color.id),
            new Types.ObjectId(item.size.id),
            item.quantity,
            session,
          );
        }

        /* -----------------------------------------------
           CANCEL
        ------------------------------------------------ */

        cancelledOrder = await OrderRepository.updateById(
          order._id,
          {
            status: "cancelled",
            cancellationDate: new Date(),
            cancelledBy: new Types.ObjectId(userId),
          },
          session,
        );
      });

      return cancelledOrder;
    } finally {
      await session.endSession();
    }
  },

  /* =======================================================
     GET MY ORDERS
  ======================================================= */

  async getMyOrders({
    userId,
    page = 1,
    limit = 10,
    status,
  }: {
    userId: string | Types.ObjectId;
    page?: number | string;
    limit?: number | string;
    status?: OrderStatus;
  }) {
    const pageNumber = Math.max(1, Number(page));

    const limitNumber = Math.min(100, Math.max(1, Number(limit)));

    const skip = (pageNumber - 1) * limitNumber;

    const filter = status ? { status } : {};

    const objectUserId = new Types.ObjectId(userId);

    const [orders, total] = await Promise.all([
      OrderRepository.findUserOrders(objectUserId, filter, {
        skip,
        limit: limitNumber,
      }),

      OrderRepository.count({
        user: objectUserId,
        ...filter,
      }),
    ]);

    return {
      data: orders,

      meta: {
        total,

        page: pageNumber,

        limit: limitNumber,

        pages: Math.ceil(total / limitNumber),
      },
    };
  },

  /* =======================================================
     GET SINGLE ORDER
  ======================================================= */

  // For Admin Only
  async getSingleOrder(orderId: string | Types.ObjectId, user: IUser) {
    const order = await OrderRepository.findById(new Types.ObjectId(orderId));
    console.log(order);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const isAdmin = user.role === "admin" || user.role === "operator";

    const isOwner = order.user && order.user.toString() === user._id.toString();

    if (!isAdmin && !isOwner) {
      throw new AppError("Not authorized", 403);
    }

    return order;
  },

  /* =======================================================
     GET ALL ORDERS
  ======================================================= */

  async getAllOrders({
    page = 1,
    limit = 20,
    status,
    userId,
  }: {
    page?: number | string;
    limit?: number | string;
    status?: OrderStatus;
    userId?: string;
  }) {
    const pageNumber = Math.max(1, Number(page));

    const limitNumber = Math.min(100, Math.max(1, Number(limit)));

    const skip = (pageNumber - 1) * limitNumber;

    const filter: Record<string, any> = {};

    if (status) {
      filter.status = status;
    }

    if (userId) {
      filter.user = new Types.ObjectId(userId);
    }

    const [orders, total] = await Promise.all([
      OrderRepository.findAll(filter, {
        skip,
        limit: limitNumber,
      }),

      OrderRepository.count(filter),
    ]);

    return {
      orders,

      meta: {
        total,

        page: pageNumber,

        limit: limitNumber,

        pages: Math.ceil(total / limitNumber),
      },
    };
  },

  // Verify Delivery Charge or Whole Payment
  async verifyManualPayment({
    order,
    amount,
    verifiedBy,
  }: {
    order: IOrder;
    amount: number;
    verifiedBy: Types.ObjectId;
  }): Promise<IOrder> {
    if (amount <= 0) {
      throw new AppError("Payment amount must be greater than 0.", 400);
    }

    if (order.paymentStatus === "completed") {
      throw new AppError("This order has already been fully paid.", 400);
    }

    if (order.confirmationPaymentDue <= 0) {
      throw new AppError(
        "This order does not require a confirmation payment.",
        400,
      );
    }

    const remaining = order.confirmationPaymentDue - order.prepaidAmount;

    if (amount > remaining) {
      throw new AppError(
        `Payment amount cannot exceed the remaining payment of ${remaining}.`,
        400,
      );
    }

    const session = await mongoose.startSession();

    try {
      let updatedOrder: IOrder | null = null;

      await session.withTransaction(async () => {
        updatedOrder = await OrderRepository.updateManualPayment(
          order,
          amount,
          session,
        );
      });

      return updatedOrder!;
    } finally {
      await session.endSession();
    }
  },

  // Mark as confirmed
  async confirmOrder(orderId: Types.ObjectId): Promise<IOrder> {
    const session = await mongoose.startSession();

    try {
      let confirmedOrder: IOrder | null = null;

      await session.withTransaction(async () => {
        confirmedOrder = await OrderRepository.confirmOrder(orderId, session);
      });

      return confirmedOrder!;
    } finally {
      await session.endSession();
    }
  },

  /* =======================================================
     MARK DELIVERED
  ======================================================= */

  async markDelivered(orderId: Types.ObjectId) {
    const session = await mongoose.startSession();

    try {
      let deliveredOrder: any;

      await session.withTransaction(async () => {
        const deliveredAt = new Date();

        deliveredOrder = await OrderRepository.markDelivered(
          orderId,
          deliveredAt,
          session,
        );

        /*
         * Referral holding only makes sense
         * for an online customer order.
         */
        if (deliveredOrder.orderType === "online" && deliveredOrder.user) {
          await ReferralService.holdReferral(deliveredOrder.user, deliveredAt);
        }
      });

      return deliveredOrder;
    } finally {
      await session.endSession();
    }
  },

  /* =======================================================
     UPDATE ORDER STATUS
  ======================================================= */

  async updateOrderStatus(
    orderId: string | Types.ObjectId,
    nextStatus: OrderStatus,
  ) {
    const session = await mongoose.startSession();

    try {
      let updatedOrder: any;

      await session.withTransaction(async () => {
        const order = await OrderRepository.findById(
          new Types.ObjectId(orderId),
          session,
        );

        if (!order) {
          throw new AppError("Order not found", 404);
        }

        const allowed = ALLOWED_TRANSITIONS[order.status] ?? [];

        if (!allowed.includes(nextStatus)) {
          throw new AppError(
            `Cannot change status from ${order.status} to ${nextStatus}`,
            400,
          );
        }

        /* ---------------------------------------------
             STATUS-SPECIFIC DATA
          --------------------------------------------- */

        const extra: Partial<any> = {};

        if (nextStatus === "shipped") {
          extra.shippedAt = new Date();
        }

        if (nextStatus === "delivered") {
          extra.deliveredAt = new Date();
        }

        if (nextStatus === "cancelled") {
          extra.cancellationDate = new Date();
        }

        /* ---------------------------------------------
             UPDATE
          --------------------------------------------- */

        updatedOrder = await OrderRepository.updateById(
          order._id,
          {
            status: nextStatus,
            ...extra,
          },
          session,
        );

        if (!updatedOrder) {
          throw new AppError("Failed to update order", 500);
        }

        /* ---------------------------------------------
             REFERRAL HOLD
          --------------------------------------------- */

        if (
          nextStatus === "delivered" &&
          order.orderType === "online" &&
          order.user
        ) {
          await ReferralService.holdReferral(order.user, extra.deliveredAt);
        }
      });

      return updatedOrder;
    } finally {
      await session.endSession();
    }
  },
};
