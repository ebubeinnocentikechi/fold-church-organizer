import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Stat } from "@/components/app-shell";
import { RecordDialog, today } from "@/components/record-dialog";
import { DataTable } from "@/components/data-table";
import { money, sumBy, useAdd, useRemove, useRows } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/finances")({
  head: () => ({ meta: [{ title: "Finances — Fold" }, { name: "description", content: "Income, expenses and balance for your church." }] }),
  component: Finances,
});

function lastMonths(n: number) {
  const out: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(`${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

function Finances() {
  const { data: gifts = [] } = useRows("donations");
  const { data: exps = [] } = useRows("expenses");
  const add = useAdd("expenses");
  const del = useRemove("expenses");
  const income = sumBy(gifts, (d) => Number(d.amount));
  const spent = sumBy(exps, (e) => Number(e.amount));
  const months = lastMonths(6).map((m) => ({
    m,
    inc: sumBy(gifts.filter((g) => g.given_on.startsWith(m)), (g) => Number(g.amount)),
    exp: sumBy(exps.filter((e) => e.spent_on.startsWith(m)), (e) => Number(e.amount)),
  }));
  const max = Math.max(1, ...months.flatMap((x) => [x.inc, x.exp]));

  return (
    <>
      <PageHeader title="Finances">
        <RecordDialog title="Add expense" onSubmit={(v) => add.mutateAsync({ ...v, amount: Number(v["amount"]) } as never)} fields={[
          { name: "description", label: "Description", required: true },
          { name: "amount", label: "Amount", type: "number", required: true },
          { name: "category", label: "Category", options: ["general", "salaries", "utilities", "rent", "outreach", "maintenance", "equipment", "welfare"] },
          { name: "spent_on", label: "Date", type: "date", defaultValue: today() },
        ]} />
      </PageHeader>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total income" value={money(income)} />
        <Stat label="Total expenses" value={money(spent)} />
        <Stat label="Balance" value={money(income - spent)} />
      </div>
      <div className="mb-6 rounded-2xl border bg-card p-6">
        <p className="mb-4 font-bold">Last 6 months</p>
        <div className="flex h-48 items-end gap-4">
          {months.map((x) => (
            <div key={x.m} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-40 w-full items-end justify-center gap-1">
                <div title={money(x.inc)} className="w-1/3 rounded-t bg-primary" style={{ height: `${(x.inc / max) * 100}%` }} />
                <div title={money(x.exp)} className="w-1/3 rounded-t bg-accent" style={{ height: `${(x.exp / max) * 100}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{x.m.slice(5)}/{x.m.slice(2, 4)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><i className="h-3 w-3 rounded bg-primary" />Income</span>
          <span className="flex items-center gap-1"><i className="h-3 w-3 rounded bg-accent" />Expenses</span>
        </div>
      </div>
      <h2 className="mb-3 text-xl font-bold">Expenses</h2>
      <DataTable rows={exps} empty="No expenses recorded yet." onDelete={(id) => del.mutate(id)} cols={[
        { label: "Date", render: (e) => e.spent_on },
        { label: "Description", render: (e) => <b>{e.description}</b> },
        { label: "Category", render: (e) => <span className="capitalize">{e.category}</span> },
        { label: "Amount", render: (e) => money(Number(e.amount)) },
      ]} />
    </>
  );
}
