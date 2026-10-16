import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set a new password — Fold" }, { name: "description", content: "Choose a new password for your Fold account." }] }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const password = String(new FormData(e.currentTarget).get("password"));
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  }
  return (
    <div className="grid min-h-screen place-items-center bg-muted px-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-8">
        <h1 className="text-2xl font-extrabold">Set a new password</h1>
        <div><Label htmlFor="password">New password</Label><Input id="password" name="password" type="password" minLength={6} required /></div>
        <Button className="w-full" disabled={loading}>Update password</Button>
      </form>
    </div>
  );
}
