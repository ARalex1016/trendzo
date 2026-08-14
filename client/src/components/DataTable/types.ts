import type { ReactNode } from "react";

export type ColumnAlign = "left" | "center" | "right";

// export type DataTableRowId = string | number;

export interface Column<T> {
  /**
   * Unique identifier for this column.
   */
  // key: keyof T | string;
  key: keyof T;

  /**
   * Column title.
   */
  title: string;

  /**
   * Width (optional)
   */
  width?: string;

  /**
   * Text alignment
   */
  align?: ColumnAlign;

  /**
   * Custom renderer
   */
  render?: (row: T) => ReactNode;

  /**
   * Hide on mobile
   */
  hideOnMobile?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface DataTableProps<T> {
  columns: Column<T>[];

  data: T[];

  rowKey: keyof T | ((row: T) => string);

  loading?: boolean;

  emptyMessage?: string;

  pagination?: Pagination;

  // getRowId: (row: T, index: number) => DataTableRowId;

  expandable?: boolean;

  isRowExpandable?: (row: T, index: number) => boolean;

  renderExpandedRow?: (row: T) => ReactNode;

  // expandedRowId?: DataTableRowId | null;

  // onExpandedRowChange?: (rowId: DataTableRowId | null, row: T | null) => void;
  // onExpandedRowChange?: (rowId: DataTableRowId | null) => void;

  renderExpandIcon?: (expanded: boolean) => ReactNode;

  onPageChange?: (page: number) => void;
}
