import { useState, useEffect, useCallback } from "react";

// Components
import FilterReferral from "./FilterReferral";
import { DataTable } from "@/components/DataTable/DataTable";
import { StatusBadge } from "../status";
import { ReferralExpandedData } from "./ReferralExpandedData";
import { CustomerData, Reward, JoinedAt } from "./ReferralTableData";

// Store
import useReferralStore from "@/store/useReferralStore";

// Types
import type { Column } from "@/components/DataTable/types";
import type { IReferralHistory } from "@/types/referral.type";
import type { Meta } from "@/types/response.type";
import type { ReferralStatus } from "@/types/referral.type";
import type { ReferralFilterStatus } from "./FilterReferral";

export interface Referral {
  id: string;

  customer: {
    name: string;
    email: string;
  };

  reward: number;

  status: ReferralStatus;

  createdAt: string | Date;

  updatedAt: string | Date;

  referralCodeUsed: string;

  qualifyingOrderAmount?: number;

  minPurchaseRequired?: number;

  qualifiedAt?: string | Date;

  deliveredAt?: string | Date;

  holdUntil?: string | Date;

  cancelReason?: string;
}

export type ReferralSort =
  | "newest"
  | "oldest"
  | "reward_asc"
  | "reward_desc"
  | "status";

export type ReferralFilters = {
  search: string;
  status: ReferralFilterStatus;
  sort: ReferralSort;
};

const columns: Column<Referral>[] = [
  {
    key: "customer",
    title: "Customer",
    align: "left",
    render: (row) => (
      <CustomerData name={row.customer.name} email={row.customer.email} />
    ),
  },
  {
    key: "createdAt",
    title: "Joined",
    align: "left",
    render: (row) => <JoinedAt date={row.createdAt} />,
  },
  {
    key: "status",
    title: "Status",
    align: "left",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "reward",
    title: "Reward",
    align: "left",
    render: (row) => <Reward reward={row.reward} status={row.status} />,
  },
];

const convertReferralToTableData = () => {
  return (item: IReferralHistory): Referral => ({
    id: item._id,
    customer: {
      name: item.invitee.name,
      email: item.invitee.email,
    },
    reward: item.rewardAmount,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    referralCodeUsed: item.referralCodeUsed,
    qualifyingOrderAmount: item.qualifyingOrderAmount ?? undefined,
    minPurchaseRequired: item.minPurchaseRequired ?? undefined,
    qualifiedAt: item.qualifiedAt ?? undefined,
    deliveredAt: item.deliveredAt ?? undefined,
    holdUntil: item.holdUntil ?? undefined,
    cancelReason: item.cancelReason ?? undefined,
  });
};

const DEFAULT_FILTERS: ReferralFilters = {
  search: "",
  status: "all",
  sort: "newest",
};

const ReferralHistory = () => {
  const { getMyReferrals } = useReferralStore();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState<ReferralFilters>(DEFAULT_FILTERS);

  const fetchMyReferral = useCallback(
    async (page: number, currentFilters: ReferralFilters) => {
      setLoading(true);

      try {
        const res = await getMyReferrals({
          page,
          search: currentFilters.search,
          status: currentFilters.status,
          sort: currentFilters.sort,
        });

        if (!res) return;

        if (res.meta) {
          setPagination(res.meta);
        }

        const mapReferralToTableRow = convertReferralToTableData();

        const tableData: Referral[] = res.data.map(mapReferralToTableRow);

        setReferrals(tableData);
      } catch (error) {
        console.error("Failed to fetch referral history:", error);
      } finally {
        setLoading(false);
      }
    },
    [getMyReferrals],
  );

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleFiltersChange = (newFilters: ReferralFilters) => {
    setFilters(newFilters);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  useEffect(() => {
    fetchMyReferral(pagination.page, filters);
  }, [pagination.page, filters, fetchMyReferral]);

  return (
    <div className="space-y-3">
      <p className="text-2xl font-medium">Referrals History</p>

      <FilterReferral filters={filters} onFiltersChange={handleFiltersChange} />

      <DataTable
        columns={columns}
        data={referrals}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        expandable={true}
        onPageChange={handlePageChange}
        renderExpandedRow={(referral) => (
          <ReferralExpandedData referral={referral} />
        )}
      />
    </div>
  );
};

export default ReferralHistory;
