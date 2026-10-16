import { createFileRoute } from "@tanstack/react-router";
import {
  Users, HandCoins, CalendarCheck, MessageSquare, BarChart3, Smartphone,
  Check, ArrowRight, Church, Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fold — Church management software that grows with you" },
      { name: "description", content: "Manage members, giving, attendance, events and communication for your church in one simple platform." },
      { property: "og:title", content: "Fold — Church management made simple" },
      { property: "og:description", content: "Members, giving, attendance and messaging for churches of every size." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Users, title: "Member management", text: "Keep a living directory of members, families and first-timers with follow-up workflows." },
  { icon: HandCoins, title: "Online giving", text: "Accept tithes, offerings and pledges online and track every contribution in real time." },
  { icon: CalendarCheck, title: "Attendance & check-in", text: "Record service attendance and children's check-in in seconds from any device." },
  { icon: MessageSquare, title: "SMS & email", text: "Reach your congregation with bulk messages, birthday greetings and reminders." },
  { icon: BarChart3, title: "Reports & insights", text: "Spot growth trends with dashboards for attendance, finance and engagement." },
  { icon: Smartphone, title: "Branded mobile app", text: "Give members an app to give, register for events and stay connected." },
];

const plans = [
  { name: "Starter", price: "Free", note: "Up to 100 members", items: ["Member directory", "Attendance", "Basic reports"] },
  { name: "Growth", price: "$29", note: "per month, up to 1,000 members", items: ["Everything in Starter", "Online giving", "SMS & email", "Events & forms"], featured: true },
  { name: "Ministry", price: "$79", note: "per month, unlimited members", items: ["Everything in Growth", "Multi-branch", "Mobile app", "Priority support"] },
];

function Index() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2 text-lg font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Church className="h-5 w-5" /></span>
            Fold
          </a>
          <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#stories" className="hover:text-foreground">Stories</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden text-sm font-medium sm:block">Log in</a>
            <a href="#pricing" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">Get started</a>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span className="inline-flex rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-secondary-foreground">Trusted by 5,000+ churches</span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Run your church with <span className="text-primary">clarity</span>, not spreadsheets.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Fold brings members, giving, attendance and communication into one simple home — so your team spends less time on admin and more time on people.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#pricing" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground hover:opacity-90">Start free <ArrowRight className="h-4 w-4" /></a>
            <a href="#features" className="rounded-full border bg-card px-6 py-3.5 font-semibold hover:bg-muted">Book a demo</a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-secondary" />
          <div className="relative rounded-2xl border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="font-bold">Sunday overview</p>
              <span className="text-xs text-muted-foreground">This week</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[["Attendance", "1,284"], ["Giving", "$18.4k"], ["First-timers", "37"]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-muted p-4">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="mt-1 text-xl font-extrabold">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex h-32 items-end gap-2">
              {[40, 55, 48, 70, 62, 85, 78, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md bg-primary/80" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-accent p-4 text-sm font-medium text-accent-foreground">12 members celebrate birthdays this week 🎉</div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-muted py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-2xl text-4xl font-extrabold tracking-tight">Everything your ministry needs, in one place</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border bg-card p-7">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary"><f.icon className="h-6 w-6" /></span>
                <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Our follow-up rate doubled within three months.", "Pastor Grace A.", "City Light Assembly"],
            ["Online giving finally feels effortless for our members.", "David O.", "Finance lead, New Hope"],
            ["We manage four branches from one dashboard now.", "Rev. Samuel K.", "Living Waters Church"],
          ].map(([q, n, c]) => (
            <figure key={n} className="rounded-2xl border bg-card p-7">
              <div className="flex gap-1 text-accent">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <blockquote className="mt-4 text-lg font-medium">“{q}”</blockquote>
              <figcaption className="mt-5 text-sm"><b>{n}</b><br /><span className="text-muted-foreground">{c}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-ink py-24 text-ink-foreground">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-extrabold tracking-tight">Simple pricing for every church</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className={`rounded-2xl p-8 ${p.featured ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"}`}>
                <p className="font-semibold">{p.name}</p>
                <p className="mt-4 text-4xl font-extrabold">{p.price}</p>
                <p className="mt-1 text-sm opacity-75">{p.note}</p>
                <ul className="mt-6 space-y-3 text-sm">
                  {p.items.map((i) => <li key={i} className="flex gap-2"><Check className="h-4 w-4 shrink-0" />{i}</li>)}
                </ul>
                <a href="#" className={`mt-8 block rounded-full py-3 text-center font-semibold ${p.featured ? "bg-card text-card-foreground" : "bg-primary text-primary-foreground"}`}>Choose {p.name}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row">
        <p>© 2026 Fold. Built for churches everywhere.</p>
        <p>hello@fold.church</p>
      </footer>
    </div>
  );
}
