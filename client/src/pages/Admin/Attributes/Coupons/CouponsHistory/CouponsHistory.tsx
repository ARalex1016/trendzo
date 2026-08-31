import { useState, useEffect } from "react";

// Components
import CouponFilter from "../CouponFilter";
import { DataTable } from "@/components/DataTable/DataTable";
import {
  CouponCode,
  CouponTypeCompo,
  Discount,
  MinPurchase,
  MaxDiscount,
  Users,
  Usage,
  Expiry,
  Status,
  CreatedBy,
  CreatedAt,
} from "./CouponTableData";

// Store
import useAuthStore from "@/store/useAuthStore";
import useCouponStore from "@/store/useCouponStore";

// Types
import type {
  AdminCoupon,
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

  createdBy?: {
    name: string;
  };

  createdAt: string;

  updatedAt: string;
}

const DEFAULT_FILTERS: CouponFilters = {
  search: "",
  status: "all",
  sort: "newest",
};

const mapCouponToCouponTable = (coupon: AdminCoupon): CouponDataTable => ({
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
  const { getAllCoupons, toggleCouponStatus } = useCouponStore();

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

  const handleToggleCouponStatus = async (couponId: CouponDataTable["_id"]) => {
    try {
      await toggleCouponStatus(couponId);

      // Update only the affected coupon
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon._id !== couponId
            ? coupon
            : {
                ...coupon,
                status: coupon.status === "active" ? "inactive" : "active",
              },
        ),
      );
    } catch (error) {}
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

  const columns: Column<CouponDataTable>[] = [
    {
      key: "code",
      title: "Coupon Code",
      align: "left",
      render: (row) => <CouponCode code={row.code} />,
    },
    {
      key: "type",
      title: "Type",
      align: "left",
      render: (row) => <CouponTypeCompo type={row.type} />,
    },
    {
      key: "value",
      title: "Discount",
      align: "left",
      render: (row) => <Discount value={row.value} type={row.type} />,
    },
    {
      key: "minPurchase",
      title: "Min Purchase",
      align: "left",
      render: (row) => <MinPurchase minPurchase={row.minPurchase} />,
    },
    {
      key: "maxDiscount",
      title: "Max Discount",
      align: "left",
      render: (row) => <MaxDiscount maxDiscount={row.maxDiscount} />,
    },
    {
      key: "applicableUsers",
      title: "Users",
      align: "left",
      render: (row) => <Users applicableUsers={row.applicableUsers} />,
    },
    {
      key: "usage",
      title: "Usage",
      align: "center",
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
      render: (row) => <Expiry expiryDate={row.expiryDate} />,
    },
    {
      key: "status",
      title: "Status",
      align: "left",
      render: (row) => (
        <Status
          status={row.status}
          onToggle={() => handleToggleCouponStatus(row._id)}
        />
      ),
    },
    {
      key: "createdBy",
      title: "Created By",
      align: "left",
      render: (row) => <CreatedBy createdBy={row.createdBy} />,
    },
    {
      key: "createdAt",
      title: "Created At",
      align: "left",
      render: (row) => <CreatedAt createdAt={row.createdAt} />,
    },
  ];

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
