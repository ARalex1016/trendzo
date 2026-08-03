import { DataTableHeader } from "./DataTableHeader";
import { DataTableBody } from "./DataTableBody";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableLoading } from "./DataTableLoading";
import { DataTableEmpty } from "./DataTableEmpty";

// Types
import type { DataTableProps } from "./types";

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data found.",
  pagination,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <DataTableHeader columns={columns} />

          {loading ? (
            <DataTableLoading columns={columns.length} />
          ) : data.length === 0 ? (
            <DataTableEmpty columns={columns.length} message={emptyMessage} />
          ) : (
            <DataTableBody columns={columns} data={data} />
          )}
        </table>
      </div>

      {pagination && onPageChange && (
        <DataTablePagination
          pagination={pagination}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
