import type { ReactNode } from "react";

export type ColumnAlign = "left" | "center" | "right";

export interface Column<T> {
  /**
   * Unique identifier for this column.
   */
  key: keyof T | string;

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

  loading?: boolean;

  emptyMessage?: string;

  pagination?: Pagination;

  onPageChange?: (page: number) => void;
}
