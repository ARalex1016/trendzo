import { useState, useEffect } from "react";

// Components
import CouponFilter from "../CouponFilter";
import { DataTable } from "@/components/DataTable/DataTable";
import { Usage } from "./CouponTableData";

// Store
import useAuthStore from "@/store/useAuthStore";
import useCouponStore from "@/store/useCouponStore";

// Types
import type {
  ICoupon,
  CouponStatus,
  ICode,
  CouponType,
  UserTypeForCoupon,
} from "@/types/coupon.type";
import type { Meta } from "@/types/response.type";
import type { Column } from "@/components/DataTable/types";

export type CouponStatusProps = CouponStatus | "all";

export type CouponSort = "newest" | "oldest";

export type CouponFilters = {
  search: string;
  status: CouponStatusProps;
  sort: CouponSort;
};

export interface CouponDataTable {
  _id: string;

  code: ICode;

  type: CouponType;

  value: number;

  minPurchase: number;

  maxDiscount?: number;

  applicableUsers: UserTypeForCoupon;

  expiryDate: string;

  usage: {
    usageLimit?: number | null;

    usedCount: number;
  };

  status: CouponStatus;

  createdBy?: string;

  createdAt: string | Date;

  updatedAt: string | Date;
}

const columns: Column<CouponDataTable>[] = [
  {
    key: "code",
    title: "Coupon Code",
    align: "left",
    // render: (row) => <OrderNumber orderNumber={row.orderNumber} />,
  },
  {
    key: "type",
    title: "Type",
    align: "left",
  },
  {
    key: "value",
    title: "Discount",
    align: "left",
  },
  {
    key: "minPurchase",
    title: "Min Purchase",
    align: "left",
  },
  {
    key: "maxDiscount",
    title: "Max Discount",
    align: "left",
  },
  {
    key: "applicableUsers",
    title: "Users",
    align: "left",
  },
  {
    key: "usage",
    title: "Usage",
    align: "left",
    render: (row) => (
      <Usage
        usageLimit={row.usage.usageLimit}
        usedCount={row.usage.usedCount}
      />
    ),
  },
  {
    key: "expiryDate",
    title: "Expiry",
    align: "left",
  },
  {
    key: "status",
    title: "Status",
    align: "left",
  },
  {
    key: "createdBy",
    title: "Created By",
    align: "left",
  },
  {
    key: "createdAt",
    title: "Created At",
    align: "left",
  },
];

const DEFAULT_FILTERS: CouponFilters = {
  search: "",
  status: "all",
  sort: "newest",
};

const mapCouponToCouponTable = (coupon: ICoupon): CouponDataTable => ({
  _id: coupon._id ?? "",

  code: coupon.code,

  type: coupon.type,

  value: coupon.value,

  minPurchase: coupon.minPurchase,

  maxDiscount: coupon.maxDiscount,

  applicableUsers: coupon.applicableUsers,

  usage: {
    usageLimit: coupon.usageLimit,

    usedCount: coupon.usedCount,
  },

  expiryDate: coupon.expiryDate,

  status: coupon.status,

  createdBy: coupon.createdBy,

  createdAt: coupon?.createdAt ?? "",

  updatedAt: coupon?.updatedAt ?? "",
});

const CouponsHistory = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { getAllCoupons } = useCouponStore();

  const [filters, setFilters] = useState<CouponFilters>(DEFAULT_FILTERS);

  const [coupons, setCoupons] = useState<CouponDataTable[]>([]);

  const [pagination, setPagination] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleFiltersChange = (newFilters: CouponFilters) => {
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

  const fetchAllCoupons = async () => {
    setLoading(true);
    try {
      let res = await getAllCoupons();

      if (!res) return;

      console.log(res);

      if (!res.meta) return;

      setCoupons(res.data.map(mapCouponToCouponTable));

      setPagination(res?.meta);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && user?.role !== "admin" && user?.role !== "operator")
      return;

    fetchAllCoupons();
  }, [pagination.page, user?.role, filters, isAuthenticated]);

  return (
    <div className="space-y-5">
      <CouponFilter filters={filters} onFiltersChange={handleFiltersChange} />

      <DataTable
        columns={columns}
        data={coupons}
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

export default CouponsHistory;
