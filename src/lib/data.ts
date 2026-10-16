import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type TableName = "members" | "visitors" | "donations" | "expenses";
export type Row<T extends TableName> = Database["public"]["Tables"][T]["Row"];
export type Insert<T extends TableName> = Database["public"]["Tables"][T]["Insert"];

const orderCol: Record<TableName, string> = {
  members: "created_at",
  visitors: "visit_date",
  donations: "given_on",
  expenses: "spent_on",
};

export function useRows<T extends TableName>(table: T) {
  return useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderCol[table], { ascending: false });
      if (error) throw error;
      return data as unknown as Row<T>[];
    },
  });
}

export function useAdd<T extends TableName>(table: T) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Insert<T>) => {
      const { error } = await supabase.from(table).insert(row as never);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [table] }); toast.success("Saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdate<T extends TableName>(table: T) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Insert<T>> }) => {
      const { error } = await supabase.from(table).update(patch as never).eq("id" as never, id as never);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRemove(table: TableName) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id" as never, id as never);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [table] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function sumBy<T>(rows: T[], f: (r: T) => number) {
  return rows.reduce((a, r) => a + f(r), 0);
}

export function formObject(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const o: Record<string, string | null> = {};
  fd.forEach((v, k) => { const s = String(v).trim(); o[k] = s === "" ? null : s; });
  return o;
}
