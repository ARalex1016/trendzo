// Types
import type { Column } from "./types";

interface Props<T> {
  columns: Column<T>[];

  data: T[];
}

export function DataTableBody<T>({ columns, data }: Props<T>) {
  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b border-zinc-800 hover:bg-zinc-800/40 transition"
        >
          {columns.map((column) => (
            <td
              key={String(column.key)}
              className={`
                px-6
                py-4
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
      ))}
    </tbody>
  );
}
