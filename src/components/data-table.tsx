import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";

export function DataTable<T extends { id: string }>({ rows, cols, onDelete, empty }: {
  rows: T[]; cols: { label: string; render: (r: T) => ReactNode }[]; onDelete?: (id: string) => void; empty: string;
}) {
  if (!rows.length) return <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">{empty}</div>;
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left text-muted-foreground">
          <tr>{cols.map((c) => <th key={c.label} className="px-4 py-3 font-medium">{c.label}</th>)}{onDelete && <th />}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              {cols.map((c) => <td key={c.label} className="px-4 py-3">{c.render(r)}</td>)}
              {onDelete && (
                <td className="px-4 py-3 text-right">
                  <button aria-label="Delete" onClick={() => confirm("Delete this record?") && onDelete(r.id)}
                    className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
