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
import { UserRepository } from "../Repositories/user.repository.ts";
import { UserStatsService } from "./user-stats.service.ts";
import ColorRepository from "../Repositories/color.repository.ts";
import SizeRepository from "../Repositories/size.repository.ts";

// Transitions
import { assertValidOrderTransition } from "../modules/Order/order.transition.ts";

// Errors
import {
  InvalidOrderOperationError,
  InvalidOrderTransitionError,
  OrderNotFoundError,
  OrderPaymentRequiredError,
} from "../modules/Order/order.errors.ts";

// Types
import type { IUser } from "../Models/user.model.ts";
import type {
  IOrder,
  PaymentMethod,
  OrderStatus,
  PaymentCollectionType,
  PaymentStatus,
} from "../Models/order.model.ts";
import type { IOrderItem } from "../Models/order-item.model.ts";
import type { CreateOrderData } from "./../Repositories/order.repository.ts";

// Utils
import ApiFeatures from "../Utils/apiFeatures/ApiFeatures.ts";
import AppError from "./../Utils/AppError.ts";

interface TransitionOptions {
  performedBy?: Types.ObjectId;
  reason?: string;
}

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
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      /* ---------------------------------------------------
         BASIC VALIDATION
      --------------------------------------------------- */

      if (!input.items || input.items.length === 0) {
        throw new AppError("Order must contain at least one item", 400);
      }

      if (input.orderType === "online" && !input.userId) {
        throw new AppError("User is required for online orders", 400);
      }

      if (input.orderType === "in_store" && !input.cashierId) {
        throw new AppError("Cashier is required for in-store orders", 400);
      }

      if (input.orderType === "online" && !input.deliveryAddress) {
        throw new AppError("Delivery address is required", 400);
      }

      /* ---------------------------------------------------
         IDS
      --------------------------------------------------- */

      const userId = input.userId
        ? new Types.ObjectId(input.userId)
        : undefined;

      const cashierId = input.cashierId
        ? new Types.ObjectId(input.cashierId)
        : undefined;

      /* ---------------------------------------------------
         COUPON
      --------------------------------------------------- */

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

      /* ---------------------------------------------------
         ORDER ITEM PROCESSING
      --------------------------------------------------- */

      let subtotal = 0;
      let totalCost = 0;

      const orderItemIds: Types.ObjectId[] = [];

      for (const item of input.items) {
        if (item.quantity <= 0) {
          throw new AppError("Item quantity must be greater than zero", 400);
        }

        const product = await ProductRepository.findById(
          new Types.ObjectId(item.product),
        ).lean();

        if (!product) {
          throw new AppError("Product not found", 404);
        }

        if (!product.isActive) {
          throw new AppError("Product is not available", 400);
        }

        /* -----------------------------------------------
           FIND INVENTORY
        ------------------------------------------------ */

        const inventory = product.inventory.find(
          (inventoryItem: any) =>
            inventoryItem.color.toString() === item.color &&
            inventoryItem.size.toString() === item.size,
        );

        if (!inventory) {
          throw new AppError("Product variant not found", 400);
        }

        if (inventory.stock < item.quantity) {
          throw new AppError(`Insufficient stock for ${product.name}`, 400);
        }

        /* -----------------------------------------------
           COLOR
        ------------------------------------------------ */

        const color = await ColorRepository.findById(item.color);

        if (!color) {
          throw new AppError("Color not found", 404);
        }

        /* -----------------------------------------------
           SIZE
        ------------------------------------------------ */

        const size = await SizeRepository.findById(item.size);

        if (!size) {
          throw new AppError("Size not found", 404);
        }

        /* -----------------------------------------------
           PRICE
        ------------------------------------------------ */

        const sellingPrice = PricingService.calculateItemPrice(
          product.baseSellingPrice,
          product.discount,
        );

        const costPrice = product.baseCostPrice;

        const itemTotalPrice = sellingPrice * item.quantity;

        const itemTotalCost = costPrice * item.quantity;

        const profit = itemTotalPrice - itemTotalCost;

        /* -----------------------------------------------
           DECREMENT STOCK
        ------------------------------------------------ */

        const stockUpdate = await ProductRepository.decrementStock(
          product._id,
          new Types.ObjectId(item.color),
          new Types.ObjectId(item.size),
          item.quantity,
          session,
        );

        if (stockUpdate.modifiedCount === 0) {
          throw new AppError("Stock update failed", 400);
        }

        /* -----------------------------------------------
           CREATE ORDER ITEM
        ------------------------------------------------ */

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

      const orderAmount = Math.max(0, subtotal - discount);

      /* ---------------------------------------------------
         DELIVERY CHARGE
      --------------------------------------------------- */

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

      const orderNumber = await OrderRepository.getNextOrderNumber();

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

      if (input.orderType === "online" && userId) {
        try {
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
        }
      }

      /* ---------------------------------------------------
         USER STATS
      --------------------------------------------------- */

      if (userId) {
        await UserStatsService.onOrderPlaced(userId);
      }

      await session.commitTransaction();

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
    ...reqQuery
  }: {
    userId: Types.ObjectId;
    [key: string]: unknown;
  }) {
    const fields = `
    _id
    orderNumber
    user
    items
    subtotal
    discount
    deliveryCharge
    totalAmount
    paymentMethod
    paymentStatus
    status
    shippingAddress
    createdAt
    updatedAt
  `;

    // --------------------------------
    // BASE QUERY
    // --------------------------------

    const query = OrderRepository.findByUser(userId, fields);

    const features = new ApiFeatures(query, reqQuery);

    // --------------------------------
    // FILTER
    // --------------------------------

    features.filter();

    // --------------------------------
    // SEARCH
    // --------------------------------

    features.search([
      "orderNumber",
      "status",
      "paymentMethod",
      "paymentStatus",
    ]);

    // --------------------------------
    // SORT
    // --------------------------------

    features.sort("-createdAt");

    // --------------------------------
    // FIELDS
    // --------------------------------

    features.limitFields();

    // --------------------------------
    // PAGINATION
    // --------------------------------

    await features.paginate(10);

    // --------------------------------
    // EXECUTE
    // --------------------------------

    const data = await features.query;

    return {
      data,
      meta: features.meta,
    };
  },

  async getSingleOrder({ order, user }: { order: IOrder; user: IUser }) {
    let orderData = await OrderRepository.adminOrderDetails(user, order);

    return orderData;
  },

  /* =======================================================
     GET SINGLE ORDER
  ======================================================= */

  // For Admin Only
  async getAdminSingleOrder(orderId: string | Types.ObjectId, user: IUser) {
    const order = await OrderRepository.findById(new Types.ObjectId(orderId));

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

  // Mark as confirmed
  async confirmOrder(order: IOrder, user: IUser) {
    if (order.status !== "pending") {
      throw new InvalidOrderTransitionError(order.status, "confirmed");
    }

    const confirmationRemaining = Math.max(
      order.confirmationPaymentDue - order.prepaidAmount,
      0,
    );

    if (confirmationRemaining > 0) {
      throw new OrderPaymentRequiredError(
        `Order cannot be confirmed. ${confirmationRemaining} must be paid first.`,
      );
    }

    const updatedOrder = await OrderRepository.transitionOrderStatus(
      user,
      order.orderNumber,
      "pending",
      "confirmed",
    );

    if (!updatedOrder) {
      throw new InvalidOrderTransitionError("pending", "confirmed");
    }

    return updatedOrder;
  },

  async transitionOrder(
    user: IUser,
    order: IOrder,
    nextStatus: OrderStatus,
    options: TransitionOptions = {},
  ) {
    assertValidOrderTransition(order.status, nextStatus);

    const update: Record<string, unknown> = {};

    if (nextStatus === "shipped") {
      update.shippedAt = new Date();
    }

    if (nextStatus === "delivered") {
      update.deliveredAt = new Date();
    }

    if (nextStatus === "cancelled") {
      update.cancellationDate = new Date();

      if (options.performedBy) {
        update.cancelledBy = options.performedBy;
      }

      if (options.reason) {
        update.cancellationReason = options.reason;
      }
    }

    const updatedOrder = await OrderRepository.transitionOrderStatus(
      user,
      order.orderNumber,
      order.status,
      nextStatus,
      update,
    );

    if (!updatedOrder) {
      throw new InvalidOrderTransitionError(order.status, nextStatus);
    }

    return updatedOrder;
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
