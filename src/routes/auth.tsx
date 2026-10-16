import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Church } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Fold" },
      { name: "description", content: "Sign in or create your Fold church account." },
      { property: "og:title", content: "Sign in — Fold" },
      { property: "og:description", content: "Access your church dashboard." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/dashboard" }); });
  }, [navigate]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password") ?? "");
    setLoading(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      } else if (mode === "up") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/dashboard", data: { church_name: fd.get("church") } },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/dashboard" });
        else setSent("Check your email to confirm your account, then sign in.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
        if (error) throw error;
        setSent("We sent you a link to reset your password.");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setLoading(false); }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-muted px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <a href="/" className="mb-6 flex items-center gap-2 text-lg font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Church className="h-5 w-5" /></span>Fold
        </a>
        <h1 className="text-2xl font-extrabold">
          {mode === "in" ? "Welcome back" : mode === "up" ? "Create your church account" : "Reset password"}
        </h1>
        {sent ? (
          <p className="mt-6 rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">{sent}</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "up" && (
              <div><Label htmlFor="church">Church name</Label><Input id="church" name="church" required /></div>
            )}
            <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
            {mode !== "forgot" && (
              <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" minLength={6} required /></div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait…" : mode === "in" ? "Sign in" : mode === "up" ? "Sign up" : "Send reset link"}
            </Button>
          </form>
        )}
        <div className="mt-6 flex justify-between text-sm">
          {mode !== "in" ? (
            <button className="text-primary" onClick={() => { setMode("in"); setSent(null); }}>Back to sign in</button>
          ) : (
            <>
              <button className="text-primary" onClick={() => setMode("up")}>Create account</button>
              <button className="text-muted-foreground" onClick={() => setMode("forgot")}>Forgot password?</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
