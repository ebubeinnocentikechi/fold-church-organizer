import { createFileRoute } from "@tanstack/react-router";
import { UserCheck } from "lucide-react";
import { PageHeader, Stat } from "@/components/app-shell";
import { RecordDialog, today } from "@/components/record-dialog";
import { DataTable } from "@/components/data-table";
import { useAdd, useRemove, useRows, useUpdate } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/visitors")({
  head: () => ({ meta: [{ title: "Visitors — Fold" }, { name: "description", content: "Track first-time visitors and follow-ups." }] }),
  component: Visitors,
});

const statuses = ["pending", "contacted", "visited again", "converted"];

function Visitors() {
  const { data = [] } = useRows("visitors");
  const add = useAdd("visitors");
  const del = useRemove("visitors");
  const upd = useUpdate("visitors");
  const addMember = useAdd("members");
  const month = today().slice(0, 7);

  async function convert(v: (typeof data)[number]) {
    await addMember.mutateAsync({ full_name: v.full_name, email: v.email, phone: v.phone });
    upd.mutate({ id: v.id, patch: { follow_up_status: "converted" } });
  }

  return (
    <>
      <PageHeader title="Visitors">
        <RecordDialog title="Add visitor" onSubmit={(v) => add.mutateAsync(v as never)} fields={[
          { name: "full_name", label: "Full name", required: true },
          { name: "phone", label: "Phone" },
          { name: "email", label: "Email", type: "email" },
          { name: "invited_by", label: "Invited by" },
          { name: "visit_date", label: "Visit date", type: "date", defaultValue: today() },
          { name: "notes", label: "Notes" },
        ]} />
      </PageHeader>
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Stat label="Total visitors" value={data.length} />
        <Stat label="This month" value={data.filter((v) => v.visit_date.startsWith(month)).length} />
        <Stat label="Awaiting follow-up" value={data.filter((v) => v.follow_up_status === "pending").length} />
        <Stat label="Became members" value={data.filter((v) => v.follow_up_status === "converted").length} />
      </div>
      <DataTable rows={data} empty="No visitors recorded yet." onDelete={(id) => del.mutate(id)} cols={[
        { label: "Name", render: (v) => <b>{v.full_name}</b> },
        { label: "Contact", render: (v) => <span className="text-muted-foreground">{[v.phone, v.email].filter(Boolean).join(" · ") || "—"}</span> },
        { label: "Visited", render: (v) => v.visit_date },
        { label: "Invited by", render: (v) => v.invited_by ?? "—" },
        { label: "Follow-up", render: (v) => (
          <select value={v.follow_up_status} onChange={(e) => upd.mutate({ id: v.id, patch: { follow_up_status: e.target.value } })}
            className="rounded-md border bg-background px-2 py-1 capitalize">
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        ) },
        { label: "", render: (v) => v.follow_up_status !== "converted" && (
          <button onClick={() => convert(v)} className="inline-flex items-center gap-1 text-primary"><UserCheck className="h-4 w-4" />Make member</button>
        ) },
      ]} />
    </>
  );
}
