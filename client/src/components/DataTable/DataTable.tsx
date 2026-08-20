import { useState } from "react";

// Components
import { DataTableHeader } from "./DataTableHeader";
import { DataTableBody } from "./DataTableBody";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableLoading } from "./DataTableLoading";
import { DataTableEmpty } from "./DataTableEmpty";

// Types
import type { DataTableProps } from "./types";

export function getRowKey<T>(
  row: T,
  rowKey: keyof T | ((row: T) => string),
): string {
  if (typeof rowKey === "function") {
    return rowKey(row);
  }

  return String(row[rowKey]);
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = "No data found.",
  pagination,
  expandable,
  renderExpandedRow,
  onPageChange,
}: DataTableProps<T>) {
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);

  const handleRowExpand = (row: T) => {
    if (!expandable || !renderExpandedRow) return;

    const key = getRowKey(row, rowKey);

    setExpandedRowKey((currentKey) => (currentKey === key ? null : key));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="min-w-full no-scrollbar">
          <DataTableHeader columns={columns} expandable={expandable} />

          {loading ? (
            <DataTableLoading columns={columns.length} />
          ) : data.length === 0 ? (
            <DataTableEmpty columns={columns.length} message={emptyMessage} />
          ) : (
            <DataTableBody
              columns={columns}
              data={data}
              rowKey={rowKey}
              expandable={expandable}
              expandedRowKey={expandedRowKey}
              renderExpandedRow={renderExpandedRow}
              onExpandedRowChange={handleRowExpand}
            />
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
