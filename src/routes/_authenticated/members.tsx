import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Stat } from "@/components/app-shell";
import { RecordDialog, today } from "@/components/record-dialog";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { useAdd, useRemove, useRows, useUpdate } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/members")({
  head: () => ({ meta: [{ title: "Members — Fold" }, { name: "description", content: "Manage your church members." }] }),
  component: Members,
});

function Members() {
  const { data = [] } = useRows("members");
  const add = useAdd("members");
  const del = useRemove("members");
  const upd = useUpdate("members");
  const [q, setQ] = useState("");
  const rows = data.filter((m) => `${m.full_name} ${m.email ?? ""} ${m.phone ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  const month = today().slice(0, 7);
  return (
    <>
      <PageHeader title="Members">
        <RecordDialog title="Add member" onSubmit={(v) => add.mutateAsync(v as never)} fields={[
          { name: "full_name", label: "Full name", required: true },
          { name: "email", label: "Email", type: "email" },
          { name: "phone", label: "Phone" },
          { name: "gender", label: "Gender", options: ["male", "female"] },
          { name: "birthday", label: "Birthday", type: "date" },
          { name: "joined_on", label: "Joined on", type: "date", defaultValue: today() },
        ]} />
      </PageHeader>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total members" value={data.length} />
        <Stat label="Active" value={data.filter((m) => m.status === "active").length} />
        <Stat label="Joined this month" value={data.filter((m) => m.joined_on.startsWith(month)).length} />
      </div>
      <Input placeholder="Search members…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-sm bg-card" />
      <DataTable rows={rows} empty="No members yet. Add your first member." onDelete={(id) => del.mutate(id)} cols={[
        { label: "Name", render: (m) => <b>{m.full_name}</b> },
        { label: "Contact", render: (m) => <span className="text-muted-foreground">{[m.phone, m.email].filter(Boolean).join(" · ") || "—"}</span> },
        { label: "Birthday", render: (m) => m.birthday ?? "—" },
        { label: "Joined", render: (m) => m.joined_on },
        { label: "Status", render: (m) => (
          <select value={m.status} onChange={(e) => upd.mutate({ id: m.id, patch: { status: e.target.value } })}
            className="rounded-md border bg-background px-2 py-1 capitalize">
            {["active", "inactive", "transferred"].map((s) => <option key={s}>{s}</option>)}
          </select>
        ) },
      ]} />
    </>
  );
}
