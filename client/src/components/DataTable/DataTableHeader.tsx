// Types
import type { Column } from "./types";

interface Props<T> {
  columns: Column<T>[];
  expandable?: boolean;
}

export function DataTableHeader<T>({ columns, expandable }: Props<T>) {
  return (
    <thead className="bg-zinc-950 sticky top-0">
      <tr>
        {expandable && <th className="w-12 text-center"></th>}

        {columns.map((column) => (
          <th
            key={String(column.key)}
            className={`
              px-4
              py-4
              text-sm
              font-semibold
              uppercase
              tracking-wide
              text-zinc-300
              border-b
              border-zinc-800

              ${column.align === "center" ? "text-center" : ""}
              ${column.align === "right" ? "text-right" : ""}
              ${column.align === "left" ? "text-left" : ""}
              ${column.width ?? ""}
              ${column.hideOnMobile ? "hidden md:table-cell" : ""}
            `}
          >
            {column.title}
          </th>
        ))}
      </tr>
    </thead>
  );
}
