import { useState, useEffect } from "react";

// Components
import { DataTable } from "@/components/DataTable/DataTable";

// Store
import useReferralStore from "@/store/useReferralStore";

// Types
import type { Column } from "@/components/DataTable/types";
import type { IReferralHistory } from "@/types/referral.type";
import type { Meta } from "@/types/response.type";

export interface Referral {
  id: string;

  customer: {
    name: string;
    email: string;
  };

  email: string;

  reward: number;

  status: "pending" | "qualified" | "holding" | "completed" | "cancelled";

  createdAt: string;
}

const CustomerData = ({ name, email }: Referral["customer"]) => {
  return (
    <div className="flex-col">
      <p className="text-sm font-medium text-foreground line-clamp-1">{name}</p>

      <p className="text-xs text-foreground/60 line-clamp-1">{email}</p>
    </div>
  );
};

export function StatusBadge({ status }: { status: Referral["status"] }) {
  const styles = {
    pending: "bg-yellow-500/20 text-yellow-400",

    qualified: "bg-blue-500/20 text-blue-400",

    holding: "bg-purple-500/20 text-purple-400",

    completed: "bg-green-500/20 text-green-400",

    cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`

                rounded-full

                px-3

                py-1

                text-xs

                font-medium

                ${styles[status]}

            `}
    >
      {status}
    </span>
  );
}

const columns: Column<Referral>[] = [
  {
    key: "customer",
    title: "Customer",
    render: (row) => (
      <CustomerData name={row.customer.name} email={row.customer.email} />
    ),
  },
  {
    key: "reward",
    title: "Reward",
    align: "center",
  },
  {
    key: "status",
    title: "Status",
    align: "center",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "createdAt",
    title: "Joined",
    align: "center",
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
];

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

  const fetchMyReferral = async (page = pagination.page) => {
    setLoading(true);

    try {
      let res = await getMyReferrals(page);
      console.log(res);

      if (!res) return;

      setPagination(res.meta!);

      const tableData: Referral[] = res.data.map((item: IReferralHistory) => ({
        id: item._id,
        customer: { name: item.invitee.name, email: item.invitee.email },
        email: item.invitee.email,
        reward: item.rewardAmount,
        status: item.status,
        createdAt: item.createdAt,
      }));

      setReferrals(tableData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));

    fetchMyReferral(page);
  };

  useEffect(() => {
    fetchMyReferral();
  }, []);

  return (
    <div className="space-y-5 sm:space-x-8">
      <p className="text-2xl font-medium">Referrals History</p>

      <DataTable
        columns={columns}
        data={referrals}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ReferralHistory;
