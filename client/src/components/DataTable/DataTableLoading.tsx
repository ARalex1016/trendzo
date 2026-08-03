interface Props {
  columns: number;
}

export function DataTableLoading({ columns }: Props) {
  return (
    <tbody>
      {[1, 2, 3, 4, 5].map((row) => (
        <tr key={row} className="border-b border-zinc-800">
          {Array.from({ length: columns }).map((_, i) => (
            <td key={i} className="px-6 py-4">
              <div className="h-4 rounded bg-zinc-800 animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
