import React from "react";
import { AnimatePresence, motion } from "framer-motion";

// Lib
import { cn } from "@/lib/utils";

import { getRowKey } from "./DataTable";

// Types
import type { Column } from "./types";

// Icons
import { ChevronRight } from "lucide-react";

interface Props<T> {
  columns: Column<T>[];

  data: T[];

  rowKey: keyof T | ((row: T) => string);

  expandable?: boolean;

  expandedRowKey?: string | null;

  renderExpandedRow?: (row: T) => React.ReactNode;

  onExpandedRowChange?: (row: T) => void;
}

export function DataTableBody<T>({
  columns,
  data,
  rowKey,
  expandable,
  expandedRowKey,
  renderExpandedRow,
  onExpandedRowChange,
}: Props<T>) {
  const columnCount = columns.length + (expandable ? 1 : 0);

  const isRowExpanded = (row: T) => {
    if (!expandable) return false;

    return getRowKey(row, rowKey) === expandedRowKey;
  };

  const handleRowExpand = (row: T) => {
    if (!expandable || !renderExpandedRow) return;

    onExpandedRowChange?.(row);
  };

  return (
    <tbody>
      {data.map((row) => {
        const key = getRowKey(row, rowKey);

        return (
          <React.Fragment key={key}>
            <tr
              onClick={() => handleRowExpand(row)}
              className="border-b border-zinc-800 hover:bg-zinc-800/40 transition"
            >
              {expandable && (
                <ExpandIcon
                  isRowExpanded={isRowExpanded(row)}
                  onClick={() => handleRowExpand(row)}
                />
              )}

              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`
                px-4
                py-3
                text-sm
                text-zinc-200

                ${column.align === "center" ? "text-center" : ""}
                ${column.align === "right" ? "text-right" : ""}
                ${column.hideOnMobile ? "hidden md:table-cell" : ""}
              `}
                >
                  {column.render
                    ? column.render(row)
                    : String(row[column.key as keyof typeof row] ?? "-")}
                </td>
              ))}
            </tr>

            <AnimatePresence>
              {isRowExpanded(row) && renderExpandedRow && (
                <tr>
                  <td colSpan={columnCount} className="p-0 bg-background/60">
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: {
                          duration: 0.2,
                          ease: [0.4, 0, 0.2, 1],
                        },
                        opacity: {
                          duration: 0.2,
                          ease: "easeOut",
                        },
                      }}
                      className="overflow-hidden border-b border-zinc-800/80 bg-background/60"
                    >
                      <div className="px-6 py-6">{renderExpandedRow(row)}</div>
                    </motion.div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </React.Fragment>
        );
      })}
    </tbody>
  );
}

const ExpandIcon = ({
  isRowExpanded,
  onClick,
}: {
  isRowExpanded?: boolean;
  onClick: () => void;
}) => {
  return (
    <td>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          aria-expanded={isRowExpanded}
          aria-label={isRowExpanded ? "Collapse row" : "Expand row"}
          className="w-fit rounded-full p-1 hover:bg-muted transition-all duration-200 group cursor-pointer"
        >
          <ChevronRight
            size={16}
            className={cn(
              "text-foreground/60 group-hover:text-foreground transition-all duration-200",
              isRowExpanded ? "rotate-0" : "rotate-90",
            )}
          />
        </button>
      </div>
    </td>
  );
};
