import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Church, LayoutDashboard, Users, UserPlus, HandCoins, Wallet, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/members", label: "Members", icon: Users },
  { to: "/visitors", label: "Visitors", icon: UserPlus },
  { to: "/giving", label: "Giving", icon: HandCoins },
  { to: "/finances", label: "Finances", icon: Wallet },
] as const;

export function AppShell() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="min-h-screen bg-muted md:flex">
      <aside className="border-b bg-card md:sticky md:top-0 md:h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center gap-2 p-5 text-lg font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Church className="h-5 w-5" /></span>
          Fold
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
          {nav.map((n) => (
            <Link key={n.to} to={n.to}
              className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}>
              <n.icon className="h-4 w-4" />{n.label}
            </Link>
          ))}
          <button onClick={signOut} className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted md:mt-4">
            <LogOut className="h-4 w-4" />Sign out
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-10"><Outlet /></main>
    </div>
  );
}

export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
}
