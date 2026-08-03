interface Props {
  columns: number;

  message: string;
}

export function DataTableEmpty({ columns, message }: Props) {
  return (
    <tbody>
      <tr>
        <td colSpan={columns} className="py-16 text-center text-zinc-400">
          {message}
        </td>
      </tr>
    </tbody>
  );
}
