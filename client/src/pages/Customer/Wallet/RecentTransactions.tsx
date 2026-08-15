// Components
import { DataTable } from "@/components/DataTable/DataTable";

// Types
import type { Column } from "@/components/DataTable/types";
import type { Ledger } from "@/types/ledger";

const columns: Column<Ledger>[] = [
  {
    key: "source",
    title: "Source",
    align: "left",
    // render: (row) => (
    //   <CustomerData name={row.customer.name} email={row.customer.email} />
    // ),
  },
  {
    key: "amount",
    title: "Amount",
    align: "left",
    // render: (row) => (
    //   <CustomerData name={row.customer.name} email={row.customer.email} />
    // ),
  },
  {
    key: "status",
    title: "Status",
    align: "left",
    // render: (row) => (
    //   <CustomerData name={row.customer.name} email={row.customer.email} />
    // ),
  },
  {
    key: "createdAt",
    title: "Date",
    align: "left",
    // render: (row) => (
    //   <CustomerData name={row.customer.name} email={row.customer.email} />
    // ),
  },
];

const RecentTransactions = () => {
  return (
    <div>
      {/* <DataTable
        columns={columns}
        data={referrals}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        expandable={true}
        onPageChange={handlePageChange}
        renderExpandedRow={(referral) => (
          <ReferralExpandedData referral={referral} />
        )}
      /> */}
    </div>
  );
};

export default RecentTransactions;
