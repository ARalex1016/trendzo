import { useState, useEffect, useCallback } from "react";

// Components
import FilterAdminOrders from "./FilterAdminOrders";
import { DataTable } from "@/components/DataTable/DataTable";
import {
  OrderNumber,
  CustomerData,
  Items,
  TotalAmount,
  DeliveryCharge,
  PaymentMethod,
  OrderStatusData,
  PaymentStatusData,
  CreatedAt,
  LastUpdate,
  ActionButtons,
} from "./OrderTableData";

// Store
import useAuthStore from "@/store/useAuthStore";
import useOrderStore from "@/store/useOrderStore";

// Types
import type { AdminOrderStatusProps } from "./FilterAdminOrders";
import type {
  PaymentMethodOnline,
  PaymentMethodInStore,
  PaymentStatus,
} from "@/types/order/shared.type";
import type { OrderStatus } from "@/types/order/shared.type";
import type {
  IOrderRes,
  IOrderItemRes,
} from "@/types/order/order_response.type";
import type { Meta } from "@/types/response.type";
import type { Column } from "@/components/DataTable/types";

export type AdminOrdersSort = "newest" | "oldest";

export type AdminOrdersFilters = {
  search: string;
  status: AdminOrderStatusProps;
  sort: AdminOrdersSort;
};

export interface AdminOrder {
  _id: string;

  orderNumber: string;

  customer: {
    name?: string;
    email?: string;
    phone?: string;
  };

  items: IOrderItemRes[];

  totalAmount: number;

  deliveryCharge: number;

  paymentMethod: PaymentMethodOnline | PaymentMethodInStore;

  paymentStatus: PaymentStatus;

  orderStatus: OrderStatus;

  createdAt: string | Date;

  updatedAt: string | Date;

  action: string;
}

const columns: Column<AdminOrder>[] = [
  {
    key: "orderNumber",
    title: "Order Number",
    align: "left",
    render: (row) => <OrderNumber orderNumber={row.orderNumber} />,
  },
  {
    key: "customer",
    title: "Customer",
    align: "left",
    render: (row) => (
      <CustomerData name={row.customer.name} email={row.customer.email} />
    ),
  },
  {
    key: "items",
    title: "Items",
    align: "left",
    render: (row) => <Items items={row.items} />,
  },
  {
    key: "totalAmount",
    title: "Total Amount",
    align: "left",
    render: (row) => <TotalAmount totalAmount={row.totalAmount} />,
  },
  {
    key: "deliveryCharge",
    title: "Delivery Charge",
    align: "left",
    render: (row) => <DeliveryCharge deliveryCharge={row.deliveryCharge} />,
  },
  {
    key: "paymentMethod",
    title: "Payment Method",
    align: "left",
    render: (row) => <PaymentMethod method={row.paymentMethod} />,
  },
  {
    key: "orderStatus",
    title: "Order Status",
    align: "left",
    render: (row) => <OrderStatusData status={row.orderStatus} />,
  },
  {
    key: "paymentStatus",
    title: "Payment Status",
    align: "left",
    render: (row) => <PaymentStatusData status={row.paymentStatus} />,
  },
  {
    key: "createdAt",
    title: "Created",
    align: "left",
    render: (row) => <CreatedAt date={row.createdAt} />,
  },
  {
    key: "updatedAt",
    title: "Last Update",
    align: "left",
    render: (row) => <LastUpdate date={row.updatedAt} />,
  },
  {
    key: "action",
    title: "Actions",
    align: "left",
    render: (row) => <ActionButtons orderNumber={row.orderNumber} />,
  },
];

const DEFAULT_FILTERS: AdminOrdersFilters = {
  search: "",
  status: "all",
  sort: "newest",
};

const mapOrderToAdminOrder = (order: IOrderRes): AdminOrder => ({
  _id: order._id,
  orderNumber: order.orderNumber,

  customer: {
    name: order.user?.name,
    email: order.user?.email,
    phone: order.user?.phone,
  },

  items: order.items,

  totalAmount: order.totalAmount,

  deliveryCharge: order.deliveryCharge ?? 0,

  paymentMethod: order.paymentMethod,
  paymentStatus: order.paymentStatus,

  orderStatus: order.status,

  createdAt: order.createdAt,
  updatedAt: order.updatedAt,

  action: "view",
});

const OrderHistory = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { getAllOrders } = useOrderStore();

  const [filters, setFilters] = useState<AdminOrdersFilters>(DEFAULT_FILTERS);

  const [adminOrders, setAdminOrders] = useState<AdminOrder[]>([]);

  const [pagination, setPagination] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleFiltersChange = (newFilters: AdminOrdersFilters) => {
    setFilters(newFilters);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const fetchAdminOrders = useCallback(async () => {
    setLoading(true);
    try {
      let res = await getAllOrders({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && {
          search: filters.search,
        }),

        ...(filters.status !== "all" && {
          status: filters.status,
        }),

        ...(filters.sort && {
          sortBy: filters.sort,
        }),
      });

      if (!res) return;

      if (!res.meta) return;

      setAdminOrders(res.data.map(mapOrderToAdminOrder));

      setPagination(res?.meta);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    filters.search,
    filters.status,
    filters.sort,
    getAllOrders,
  ]);

  useEffect(() => {
    if (!isAuthenticated && user?.role !== "admin" && user?.role !== "operator")
      return;

    fetchAdminOrders();
  }, [pagination.page, user?.role, filters, isAuthenticated]);

  return (
    <div className="space-y-5">
      <FilterAdminOrders
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <DataTable
        columns={columns}
        data={adminOrders}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        //   expandable={true}
        onPageChange={handlePageChange}
        //   renderExpandedRow={(referral) => (
        //     <ReferralExpandedData referral={referral} />
        //   )}
      />
    </div>
  );
};

export default OrderHistory;
