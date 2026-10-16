import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Stat } from "@/components/app-shell";
import { RecordDialog, today } from "@/components/record-dialog";
import { DataTable } from "@/components/data-table";
import { money, sumBy, useAdd, useRemove, useRows } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/giving")({
  head: () => ({ meta: [{ title: "Giving — Fold" }, { name: "description", content: "Record tithes, offerings and donations." }] }),
  component: Giving,
});

export const givingCategories = ["tithe", "offering", "building fund", "missions", "thanksgiving", "pledge", "other"];

function Giving() {
  const { data = [] } = useRows("donations");
  const { data: members = [] } = useRows("members");
  const add = useAdd("donations");
  const del = useRemove("donations");
  const month = today().slice(0, 7);
  const year = today().slice(0, 4);
  const nameOf = (id: string | null) => members.find((m) => m.id === id)?.full_name;
  const byCat = givingCategories.map((c) => ({ c, t: sumBy(data.filter((d) => d.category === c), (d) => Number(d.amount)) })).filter((x) => x.t > 0);

  return (
    <>
      <PageHeader title="Giving">
        <RecordDialog title="Record gift" onSubmit={async (v) => {
          await add.mutateAsync({ ...v, amount: Number(v.amount), member_id: v.member_id || null } as never);
        }} fields={[
          { name: "amount", label: "Amount", type: "number", required: true },
          { name: "category", label: "Category", options: givingCategories },
          { name: "method", label: "Method", options: ["cash", "bank transfer", "card", "mobile money", "cheque"] },
          { name: "member_id", label: "Member (optional)", options: [{ value: "", label: "—" }, ...members.map((m) => ({ value: m.id, label: m.full_name }))] },
          { name: "donor_name", label: "Or donor name" },
          { name: "given_on", label: "Date", type: "date", defaultValue: today() },
          { name: "note", label: "Note" },
        ]} />
      </PageHeader>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="This month" value={money(sumBy(data.filter((d) => d.given_on.startsWith(month)), (d) => Number(d.amount)))} />
        <Stat label="This year" value={money(sumBy(data.filter((d) => d.given_on.startsWith(year)), (d) => Number(d.amount)))} />
        <Stat label="Number of gifts" value={data.length} />
      </div>
      {byCat.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {byCat.map((x) => <span key={x.c} className="rounded-full bg-card px-4 py-2 text-sm capitalize border">{x.c}: <b>{money(x.t)}</b></span>)}
        </div>
      )}
      <DataTable rows={data} empty="No gifts recorded yet." onDelete={(id) => del.mutate(id)} cols={[
        { label: "Date", render: (d) => d.given_on },
        { label: "Giver", render: (d) => nameOf(d.member_id) ?? d.donor_name ?? "Anonymous" },
        { label: "Category", render: (d) => <span className="capitalize">{d.category}</span> },
        { label: "Method", render: (d) => <span className="capitalize">{d.method}</span> },
        { label: "Amount", render: (d) => <b>{money(Number(d.amount))}</b> },
      ]} />
    </>
  );
}
