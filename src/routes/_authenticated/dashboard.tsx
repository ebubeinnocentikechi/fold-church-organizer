import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Stat } from "@/components/app-shell";
import { today } from "@/components/record-dialog";
import { money, sumBy, useRows } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Fold" }, { name: "description", content: "Your church at a glance." }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data: members = [] } = useRows("members");
  const { data: visitors = [] } = useRows("visitors");
  const { data: gifts = [] } = useRows("donations");
  const { data: exps = [] } = useRows("expenses");
  const month = today().slice(0, 7);
  const mmdd = today().slice(5);
  const giftsMonth = sumBy(gifts.filter((g) => g.given_on.startsWith(month)), (g) => Number(g.amount));
  const expMonth = sumBy(exps.filter((e) => e.spent_on.startsWith(month)), (e) => Number(e.amount));
  const pending = visitors.filter((v) => v.follow_up_status === "pending");
  const birthdays = members.filter((m) => m.birthday && m.birthday.slice(5, 7) === mmdd.slice(0, 2));

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Members" value={members.length} />
        <Stat label="Visitors this month" value={visitors.filter((v) => v.visit_date.startsWith(month)).length} />
        <Stat label="Giving this month" value={money(giftsMonth)} />
        <Stat label="Net this month" value={money(giftsMonth - expMonth)} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Visitors needing follow-up" link="/visitors">
          {pending.slice(0, 6).map((v) => <Line key={v.id} a={v.full_name} b={v.phone ?? v.visit_date} />)}
          {!pending.length && <Empty />}
        </Panel>
        <Panel title="Recent gifts" link="/giving">
          {gifts.slice(0, 6).map((g) => <Line key={g.id} a={`${g.category} · ${g.given_on}`} b={money(Number(g.amount))} />)}
          {!gifts.length && <Empty />}
        </Panel>
        <Panel title="Birthdays this month" link="/members">
          {birthdays.map((m) => <Line key={m.id} a={m.full_name} b={m.birthday!.slice(5)} />)}
          {!birthdays.length && <Empty />}
        </Panel>
      </div>
    </>
  );
}

function Panel({ title, link, children }: { title: string; link: "/visitors" | "/giving" | "/members"; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="mb-3 flex justify-between"><p className="font-bold">{title}</p><Link to={link} className="text-sm text-primary">View all</Link></div>
      <div className="divide-y">{children}</div>
    </div>
  );
}
const Line = ({ a, b }: { a: string; b: string }) => <div className="flex justify-between py-2 text-sm capitalize"><span>{a}</span><span className="text-muted-foreground">{b}</span></div>;
const Empty = () => <p className="py-2 text-sm text-muted-foreground">Nothing here yet.</p>;
