import { useState, useEffect } from "react";

// Components
import SizeFilter from "./SizeFilter";
import { DataTable } from "@/components/DataTable/DataTable";
import {
  SizeName,
  Type,
  Measurement,
  Unit,
  Status,
  CreatedAt,
  Actions,
} from "./SizesDataTable";

// Store
import useAuthStore from "@/store/useAuthStore";
import useSizeStore from "@/store/useSizeStore";

// Types
import type {
  AdminSize,
  SizeType,
  SizeMeasurements,
  SizeUnit,
} from "@/types/size.types";
import type { Meta } from "@/types/response.type";
import type { Column } from "@/components/DataTable/types";

export type SizeStatusProps = "active" | "inactive" | "all";

export type SizeSort = "newest" | "oldest";

export type SizeFilters = {
  search: string;
  status: SizeStatusProps;
  sort: SizeSort;
};

export interface SizeDataTable {
  _id: string;

  name: string;

  slug: string;

  type: SizeType;

  measurements: SizeMeasurements;

  unit: SizeUnit;

  isActive: boolean;

  createdBy?: {
    name: string;
  };

  createdAt: string;

  updatedAt: string;

  actions: string;
}

const columns: Column<SizeDataTable>[] = [
  {
    key: "name",
    title: "Size",
    align: "left",
    render: (row) => (
      <SizeName name={row.name} slug={row.slug} type={row.type} />
    ),
  },
  {
    key: "type",
    title: "Type",
    align: "left",
    render: (row) => <Type type={row.type} />,
  },
  {
    key: "measurements",
    title: "Measurements",
    align: "left",
  },
  {
    key: "unit",
    title: "Unit",
    align: "left",
    render: (row) => <Unit unit={row.unit} />,
  },
  {
    key: "isActive",
    title: "Status",
    align: "left",
    render: (row) => <Status isActive={row.isActive} />,
  },
  {
    key: "createdAt",
    title: "Created At",
    align: "left",
    render: (row) => <CreatedAt createdAt={row.createdAt} />,
  },
  {
    key: "actions",
    title: "Actions",
    align: "center",
    render: (row) => <Actions sizeId={row._id} />,
  },
];

const DEFAULT_FILTERS: SizeFilters = {
  search: "",
  status: "all",
  sort: "newest",
};

const mapSizeToSizeTable = (size: AdminSize): SizeDataTable => ({
  _id: size._id ?? "",

  name: size.name,

  slug: size.slug,

  type: size.type,

  measurements: size.measurements ?? "",

  unit: size.unit ?? "cm",

  isActive: size.isActive,

  createdBy: size.createdBy,

  createdAt: size?.createdAt ?? "",

  updatedAt: size?.updatedAt ?? "",

  actions: "",
});

const SizeHistory = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { adminSizes, getAllSizes } = useSizeStore();

  const [filters, setFilters] = useState<SizeFilters>(DEFAULT_FILTERS);

  const [sizes, setSizes] = useState<SizeDataTable[]>([]);

  const [pagination, setPagination] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleFiltersChange = (newFilters: SizeFilters) => {
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

  const fetchAllSizes = async () => {
    setLoading(true);
    try {
      await getAllSizes();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminSizes) return;

    setSizes(adminSizes.data.map(mapSizeToSizeTable));

    setPagination(
      adminSizes.meta ?? {
        page: 1,
        limit: 10,
        total: adminSizes.data.length,
        pages: 1,
      },
    );
  }, [adminSizes]);

  useEffect(() => {
    if (!isAuthenticated && user?.role !== "admin" && user?.role !== "operator")
      return;

    fetchAllSizes();
  }, [pagination.page, user?.role, filters, isAuthenticated]);

  return (
    <div className="space-y-5">
      <SizeFilter filters={filters} onFiltersChange={handleFiltersChange} />

      <DataTable
        columns={columns}
        data={sizes}
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

export default SizeHistory;
