// Types
import type { Column } from "./types";

interface Props<T> {
  columns: Column<T>[];
}

export function DataTableHeader<T>({ columns }: Props<T>) {
  return (
    <thead className="bg-zinc-950 sticky top-0">
      <tr>
        {columns.map((column) => (
          <th
            key={String(column.key)}
            className={`
              px-6
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
